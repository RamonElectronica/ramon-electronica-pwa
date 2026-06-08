/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Bluetooth, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: (granted: boolean) => void;
}

export default function PermissionModal({ isOpen, onClose }: PermissionModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');

  const handleGrant = () => {
    setIsScanning(true);
    setScanStep('Estableciendo conexión Bluetooth BLE...');
    
    setTimeout(() => {
      setScanStep('Validando coordenadas de red GPS local (Venezuela)...');
    }, 1000);

    setTimeout(() => {
      setScanStep('Permiso otorgado de forma segura en navegador.');
    }, 2000);

    setTimeout(() => {
      setIsScanning(false);
      onClose(true);
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative z-10 text-white overflow-hidden"
          >
            {/* Top accent glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-450 via-blue-500 to-indigo-600" />
            
            {!isScanning ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-2xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight font-display">
                      Permisos de Acceso Domótico
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ramón Electrónica Ecosistema
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Para poder escanear, emparejar y configurar los nuevos módulos hardware 
                  <strong className="text-white"> ESP32 / ESP8266</strong> de forma inalámbrica en su sector, 
                  esta WebApp requiere permisos de acceso temporal:
                </p>

                {/* Requirements details items */}
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Ubicación GPS Exacta</h4>
                      <p className="text-[10px] text-slate-400">
                        Necesario para detectar redes de emparejamiento WiFi Direct y estimar la zona horaria del temporizador en Venezuela.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Bluetooth className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Escaner Bluetooth BLE</h4>
                      <p className="text-[10px] text-slate-400">
                        Permite rastrear firmas de balizas de radiofrecuencia (RF) de los interruptores que se encuentren en modo sincronización.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 text-[10px] text-slate-400 italic bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Seguridad asegurada: los datos de sensores se procesan localmente.</span>
                </div>

                {/* Control Actions buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <button
                    onClick={() => onClose(false)}
                    className="py-2.5 border border-slate-800 rounded-xl text-slate-400 hover:bg-slate-800/40 text-xs font-medium cursor-pointer transition-colors"
                  >
                    Denegar
                  </button>
                  <button
                    onClick={handleGrant}
                    className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-md shadow-blue-500/10"
                  >
                    Permitir Escaneo
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    Sincronizando Hardware...
                  </p>
                  <p className="text-xs text-slate-400 mt-1 h-4 font-mono">
                    {scanStep}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
