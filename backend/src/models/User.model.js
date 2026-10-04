import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 30 * 60 * 1000; // 30 minutes lockout

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [70, "Name cannot exceed 70 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Prevents accidental exposure in queries
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationTokenHash: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.emailVerificationTokenHash;
        delete ret.emailVerificationExpires;
        delete ret.loginAttempts;
        delete ret.lockUntil;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.isNew) {
    // Offset by 1s to ensure token timestamp > passwordChangedAt
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is currently locked out
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Handle failed login attempt and progressive lockouts
userSchema.methods.handleFailedLogin = async function () {
  // If a previous lockout period has expired, reset counter to 1
  if (this.lockUntil && this.lockUntil <= Date.now()) {
    return this.model("User").updateOne(
      { _id: this._id },
      {
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 },
      }
    );
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME_MS) };
  }

  await this.model("User").updateOne({ _id: this._id }, updates);
};

// Reset login attempts on successful authentication
userSchema.methods.handleSuccessfulLogin = async function () {
  await this.model("User").updateOne(
    { _id: this._id },
    {
      $set: {
        lastLoginAt: new Date(),
        loginAttempts: 0,
      },
      $unset: { lockUntil: 1 },
    }
  );
};

// Check if user changed password after a given JWT timestamp
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

export const User = mongoose.model("User", userSchema);
