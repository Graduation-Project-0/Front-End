import React from "react";
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
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm logout"
      onClick={() => {
        if (loading) return;
        onRequestClose();
      }}
    >
      <div
        className="mx-auto w-full min-w-0 max-w-md shrink-0 rounded-2xl border border-[#1E7D04]/40 bg-[#111111]/70 p-8 text-center shadow-[0_0_25px_rgba(0,255,0,0.1)] backdrop-blur-md md:w-[min(28rem,100%)] md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white md:text-2xl">Logout</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Are you sure you want to logout?
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onRequestClose}
            className="flex-1 rounded-full border border-gray-700 bg-transparent py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Yes, Logout"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
