import React from "react";

export default function Loader() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">

        {/* Logo Spinner */}
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-sm font-display">
            JF
          </div>

          {/* Spinner Ring */}
          <div className="absolute inset-0 rounded-xl border-2 border-zinc-300 border-t-zinc-900 animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-sm text-zinc-500 font-medium tracking-wide">
          Loading...
        </p>

      </div>
    </div>
  );
}