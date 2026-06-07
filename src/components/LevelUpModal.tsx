"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface LevelUpModalProps {
  oldLevel: number;
  newLevel: number;
  rank: string;
  onClose: () => void;
}

export default function LevelUpModal({ oldLevel, newLevel, rank, onClose }: LevelUpModalProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 400);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-500 ${
          visible ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-20 blur-lg animate-pulse" />

        <div className="relative text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">⬆️</span>
          </div>

          {/* Title */}
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Level Up!
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Nível {newLevel}
          </h2>

          {/* Level progression */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-500">{oldLevel}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Antes</p>
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 via-blue-500 to-purple-500 max-w-[80px]" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">{newLevel}</span>
              </div>
              <p className="text-xs text-blue-600 mt-1 font-medium">Agora</p>
            </div>
          </div>

          {/* Rank badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 mb-6">
            <span className="text-sm text-gray-600">Rank atual:</span>
            <span className={`badge badge-${getRankColor(rank)}`}>{rank}</span>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-500 mb-6">
            Continue estudando para desbloquear novos títulos e conquistas!
          </p>

          <button
            onClick={handleClose}
            className="btn btn-primary btn-lg w-full"
          >
            Continuar estudando
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function getRankColor(rank: string): string {
  const map: Record<string, string> = {
    E: "gray", D: "orange", C: "green", B: "blue", A: "purple", S: "yellow",
  };
  return map[rank] || "gray";
}
