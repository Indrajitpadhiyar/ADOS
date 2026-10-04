import React, { useState, useRef, useEffect, useCallback } from "react";

// Reusable canvas context for fast, layout-free text width measurements
let measureCanvas = null;
let measureCtx = null;

function getTextWidth(text, inputEl) {
  if (!text) return 0;
  if (typeof window === "undefined" || !inputEl) return 0;

  if (!measureCanvas) {
    measureCanvas = document.createElement("canvas");
    measureCtx = measureCanvas.getContext("2d");
  }

  const style = window.getComputedStyle(inputEl);
  measureCtx.font = `${style.fontWeight || "400"} ${style.fontSize || "14px"} ${style.fontFamily || "Outfit, sans-serif"}`;
  if (style.letterSpacing && style.letterSpacing !== "normal") {
    try {
      measureCtx.letterSpacing = style.letterSpacing;
    } catch {
      // Fallback if browser doesn't support ctx.letterSpacing
    }
  }

  return measureCtx.measureText(text).width;
}

export default function SmoothInput({
  type = "text",
  name,
  value = "",
  onChange,
  placeholder,
  required = false,
  className = "",
  rightElement = null,
  onEnterNext,
  inputRef: externalRef,
  autoComplete,
  ...props
}) {
  const internalRef = useRef(null);
  const inputRef = externalRef || internalRef;

  const [isFocused, setIsFocused] = useState(false);
  const [caretLeft, setCaretLeft] = useState(20);
  const [isTyping, setIsTyping] = useState(false);
  const [isSelectionCollapsed, setIsSelectionCollapsed] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const typingTimeoutRef = useRef(null);

  // Calculate current caret position in pixels
  const updateCaretPosition = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    setIsSelectionCollapsed(start === end);

    // If text is masked (password), use bullet characters for width calculation
    let textToMeasure = "";
    if (type === "password") {
      textToMeasure = "\u2022".repeat(start);
    } else {
      textToMeasure = String(value || "").slice(0, start);
    }

    const style = window.getComputedStyle(el);
    const paddingLeft = parseFloat(style.paddingLeft) || 20;
    const scrollLeft = el.scrollLeft || 0;
    const textWidth = getTextWidth(textToMeasure, el);

    const calculatedLeft = paddingLeft + textWidth - scrollLeft;
    setCaretLeft(calculatedLeft);
  }, [inputRef, type, value]);

  // Handle typing / cursor animation state
  const triggerMovement = useCallback(() => {
    setIsTyping(true);
    setIsReady(true);
    updateCaretPosition();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 450);
  }, [updateCaretPosition]);

  // When value changes, recalculate caret
  useEffect(() => {
    if (isFocused) {
      triggerMovement();
    }
  }, [value, isFocused, triggerMovement]);

  const handleFocus = (e) => {
    setIsFocused(true);
    setIsReady(true);
    // Short delay to let browser set selectionStart on click/tab
    setTimeout(() => {
      updateCaretPosition();
    }, 10);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setIsTyping(false);
    props.onBlur?.(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnterNext) {
      e.preventDefault();
      onEnterNext();
      return;
    }
    // For navigation keys (Left, Right, Home, End, Backspace, Delete)
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Backspace", "Delete"].includes(
        e.key
      )
    ) {
      setTimeout(triggerMovement, 0);
    }
    props.onKeyDown?.(e);
  };

  const handleChange = (e) => {
    onChange?.(e);
    triggerMovement();
  };

  return (
    <div className="relative w-full flex items-center">
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={triggerMovement}
        onClick={triggerMovement}
        onSelect={triggerMovement}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`w-full px-5 py-3.5 rounded-full border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed84f] focus:ring-2 focus:ring-[#9ed84f]/25 transition-all bg-white shadow-sm smooth-caret-input ${
          rightElement ? "pr-12" : ""
        } ${className}`}
        {...props}
      />

      {/* Smooth Gliding Animated Caret */}
      {isFocused && isSelectionCollapsed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 block rounded-full"
          style={{
            left: `${caretLeft}px`,
            top: "50%",
            transform: "translateY(-50%)",
            width: "2px",
            height: "18px",
            backgroundColor: "#4c7c1b",
            boxShadow: "0 0 6px rgba(158, 216, 79, 0.75)",
            transition: isReady
              ? "left 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease"
              : "none",
            animation: isTyping ? "none" : "smoothCaretBlink 1.05s infinite ease-in-out",
          }}
        />
      )}

      {/* Optional Right Action (e.g. Eye toggle or match icon) */}
      {rightElement && (
        <div className="absolute right-4 flex items-center gap-2">
          {rightElement}
        </div>
      )}
    </div>
  );
}
