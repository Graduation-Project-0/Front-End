import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Renders to document.body so `position: fixed` is always relative to the viewport
 * (avoids clipping/off-center dialogs inside transformed or scroll parents).
 */
export default function LogoutConfirmDialog({
  open,
  loading,
  onRequestClose,
  onConfirm,
}) {
  const cancelBtnRef = useRef(null);
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    // Auto-focus the cancel button on mount/open for safety and keyboard UX
    const focusTimer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onRequestClose();
      }

      // Trap Tab within the two dialog buttons
      if (e.key === "Tab") {
        const focusable = [cancelBtnRef.current, confirmBtnRef.current].filter(
          Boolean,
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onRequestClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/75 p-4 backdrop-blur-sm motion-safe:transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      onClick={() => {
        if (loading) return;
        onRequestClose();
      }}
    >
      <div
        className="mx-auto w-full min-w-0 max-w-md shrink-0 rounded-2xl border border-[#1E7D04]/50 bg-[#111111]/90 p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.9)] backdrop-blur-xl motion-safe:transition-all motion-safe:duration-200 md:w-[min(28rem,100%)] md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="logout-dialog-title"
          className="text-xl font-semibold text-white md:text-2xl"
        >
          Logout
        </h3>
        <p
          id="logout-dialog-description"
          className="mt-3 text-sm leading-relaxed text-gray-400"
        >
          Are you sure you want to logout?
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            ref={cancelBtnRef}
            type="button"
            disabled={loading}
            onClick={onRequestClose}
            className="flex-1 rounded-full border border-gray-700 bg-transparent py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            aria-busy={loading}
            className="flex-1 rounded-full border border-red-500/40 bg-red-500/15 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Yes, Logout"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
