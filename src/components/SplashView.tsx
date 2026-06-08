/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Cpu } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashViewProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between items-center text-white overflow-hidden p-8 font-sans">
      {/* Background glowing dynamic blur orbs representing eWeLink style */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[90%] h-[40%] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header section (blank/status spacer) */}
      <div className="w-full flex justify-between text-xs text-slate-400 font-mono pt-4 z-10">
        <span className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Ramón Electrónica IoT
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          SECURE PWA
        </span>
      </div>

      {/* Central Brand Identity */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-6 z-10">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-32 h-32 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-700 rounded-3xl p-0.5 shadow-2xl shadow-blue-500/20 flex items-center justify-center cursor-default"
        >
          {/* Internal network-grid design inside icon */}
          <div className="absolute inset-2 border border-white/10 rounded-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -ml-16 -mt-16 w-32 h-32 rounded-3xl bg-radial from-transparent to-black/30 pointer-events-none" />
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-black font-display tracking-tight text-white select-none drop-shadow-md">
              R
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight font-display bg-gradient-to-r from-white via-sky-200 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            Ramón Electrónica <span className="text-xl">🇻🇪</span>
          </h1>
          <p className="text-xs tracking-[0.3em] font-medium text-slate-400 uppercase select-none">
            Ecosistema Domótico ESP32
          </p>
        </motion.div>
      </div>

      {/* Footer message matching "Works with Everything" eWeLink look */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-center space-y-4 z-10 pb-8"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800">
          <Zap className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
          <span>Sincronización Ultrarrápida eWeLink</span>
        </div>
        <p className="text-[11px] text-slate-500 font-mono tracking-wider">
          Works With ESP32 / ESP8266 venezuelan edition
        </p>
      </motion.div>
    </div>
  );
}
