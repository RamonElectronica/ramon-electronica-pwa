/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Cpu, 
  MapPin, 
  Bluetooth, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  SquarePlay, 
  ToggleLeft,
  ChevronRight,
  Droplet
} from 'lucide-react';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (name: string, room: string) => void;
}

export default function AddDeviceModal({ isOpen, onClose, onAddDevice }: AddDeviceModalProps) {
  const [step, setStep] = useState<'info' | 'linking' | 'success'>('info');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('switch'); // switch, light, pump, outlet
  const [deviceRoom, setDeviceRoom] = useState('Livingroom'); // Livingroom, Bedroom, Other
  
  // Simulated logs state for connection setup
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const scanLogs = [
    'Buscando firma de radiofrecuencia de módulos ESP32 / ESP8266 cercanos...',
    '¡Señal inalámbrica localizada! Canal RF 6 (RSSI: -53dBm)...',
    'Solicitando permisos GPS de red para sincronizar coordenadas GMT-4...',
    'Estableciendo canal seguro de sincronización Bluetooth BLE...',
    'Inyectando apodo y registrando módulo inteligente en Ramón Electrónica Backend...',
    '¡Módulo configurado exitosamente!'
  ];

  // Progression of the scanning simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'linking') {
      if (scanStepIndex < scanLogs.length - 1) {
        timer = setTimeout(() => {
          setScanStepIndex(prev => prev + 1);
        }, 800);
      } else {
        timer = setTimeout(() => {
          // Add the device to state
          onAddDevice(
            deviceName.trim() || `${getDeviceTypeLabel(deviceType)} IoT`,
            deviceRoom
          );
          setStep('success');
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [step, scanStepIndex]);

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case 'light': return 'Luz/Reflector';
      case 'pump': return 'Bomba/Motor';
      case 'outlet': return 'Tomacorriente';
      default: return 'Interruptor Domótico';
    }
  };

  const handleStartLinking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
    setScanStepIndex(0);
    setStep('linking');
  };

  const handleResetModal = () => {
    setDeviceName('');
    setDeviceType('switch');
    setDeviceRoom('Livingroom');
    setStep('info');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'linking' ? undefined : handleResetModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 25 }}
            className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden text-white shadow-2xl z-10"
          >
            {/* Top Indicator Accent gradient */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#108EE9] via-blue-500 to-indigo-650" />

            {/* Close button - hidden during critical pairing connection */}
            {step !== 'linking' && (
              <button
                onClick={handleResetModal}
                className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Modal Scrollable core body */}
            <div className="p-6">
              
              {/* STEP 1: INITIAL INFORMATION GATHERING */}
              {step === 'info' && (
                <form onSubmit={handleStartLinking} className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#108EE9] tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">
                      Paso 1: Configuración
                    </span>
                    <h3 className="text-base font-bold font-display tracking-tight mt-1">
                      Registrar Módulo Inteligente
                    </h3>
                    <p className="text-xs text-slate-400">
                      Vinculed un módulo Ramón Electrónica en su hogar.
                    </p>
                  </div>

                  {/* Device Name input */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                      Nombre o Apodo del Dispositivo
                    </label>
                    <input
                      type="text"
                      required
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="Ej: Bombillo Garaje, Bomba Tanque"
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-[#108EE9] text-sm rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-colors font-sans placeholder:text-slate-600"
                    />
                  </div>

                  {/* Type Selector options */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                      Tipo de Dispositivo
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setDeviceType('switch')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          deviceType === 'switch' 
                            ? 'bg-blue-600/15 border-[#108EE9] text-white shadow-md' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <ToggleLeft className={`w-4 h-4 mt-0.5 ${deviceType === 'switch' ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div className="leading-tight">
                          <p className="text-[11px] font-bold">Interruptor</p>
                          <span className="text-[9px] opacity-70">Switch IoT</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeviceType('light')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          deviceType === 'light' 
                            ? 'bg-blue-600/15 border-[#108EE9] text-white shadow-md' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <Lightbulb className={`w-4 h-4 mt-0.5 ${deviceType === 'light' ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div className="leading-tight">
                          <p className="text-[11px] font-bold">Luz o Reflector</p>
                          <span className="text-[9px] opacity-70">Iluminación</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeviceType('pump')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          deviceType === 'pump' 
                            ? 'bg-blue-600/15 border-[#108EE9] text-white shadow-md' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <Droplet className={`w-4 h-4 mt-0.5 ${deviceType === 'pump' ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div className="leading-tight">
                          <p className="text-[11px] font-bold">Motor o Bomba</p>
                          <span className="text-[9px] opacity-70">Carga Inductiva</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeviceType('outlet')}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          deviceType === 'outlet' 
                            ? 'bg-blue-600/15 border-[#108EE9] text-white shadow-md' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <Cpu className={`w-4 h-4 mt-0.5 ${deviceType === 'outlet' ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div className="leading-tight">
                          <p className="text-[11px] font-bold">Tomacorriente</p>
                          <span className="text-[9px] opacity-70">Enchufe inteligente</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Room Selector tags */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                      Habitación / Ubicación de Red
                    </label>
                    <div className="flex gap-2 mt-1">
                      {['Livingroom', 'Bedroom', 'Other'].map((room) => {
                        const translateRoom = room === 'Livingroom' ? 'Sala/Estar' : room === 'Bedroom' ? 'Dormitorio' : 'Otros / Patio';
                        return (
                          <button
                            key={room}
                            type="button"
                            onClick={() => setDeviceRoom(room)}
                            className={`flex-1 py-1.5 px-2.5 text-[10px] font-semibold text-center rounded-lg border transition-all cursor-pointer ${
                              deviceRoom === room 
                                ? 'bg-slate-850 border-[#108EE9] text-[#108EE9] scale-[1.03]' 
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {translateRoom}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button to jump to pairing logs simulation */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={!deviceName.trim()}
                      className="w-full py-2.5 px-4 bg-[#108EE9] hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-blue-550/10"
                    >
                      <span>Vincular con Ramón Electrónica</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: PAIRING HARDWARE VIA BLUETOOTH BLE & GPS TIMEOUT */}
              {step === 'linking' && (
                <div className="py-6 flex flex-col items-center justify-center space-y-5 text-center">
                  <div className="relative">
                    {/* Pulsing ring outer glows */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150 duration-1000" />
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping scale-110 duration-1500" />
                    
                    <div className="h-16 w-16 bg-gradient-to-tr from-sky-450 to-blue-600 rounded-3xl flex items-center justify-center relative z-10 shadow-lg shadow-blue-500/20 border border-blue-400/20">
                      <Cpu className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold tracking-tight">
                      Sincronizando Hardware
                    </h3>
                    <div className="flex justify-center items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Emparejando ESP32 local
                    </div>
                  </div>

                  {/* Micro logs list with current status printed in mono font */}
                  <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-800 min-h-[90px] flex items-center justify-center">
                    <div className="space-y-2 w-full text-left">
                      <div className="flex items-start gap-2.5">
                        <Loader2 className="w-3.5 h-3.5 text-[#108EE9] animate-spin shrink-0 mt-0.5" />
                        <p className="text-[11px] font-mono text-slate-300 leading-normal">
                          {scanLogs[scanStepIndex]}
                        </p>
                      </div>
                      
                      {/* Percent loader dynamic width */}
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#108EE9] h-full transition-all duration-300"
                          style={{ width: `${((scanStepIndex + 1) / scanLogs.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic max-w-[250px] mx-auto">
                    Por favor, asegúrese de que el interruptor está cerca y con el indicador LED parpadeando rápido.
                  </p>
                </div>
              )}

              {/* STEP 3: VINCULO TOTALMENTE EXITOSO */}
              {step === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      ¡Módulo Vinculado con Éxito!
                    </h3>
                    <p className="text-xs text-slate-400 px-2 max-w-[280px]">
                      El dispositivo <strong className="text-emerald-400 font-semibold">{deviceName || 'Módulo Inteligente'}</strong> ya está integrado en su red domótica y está listo para recibir comandos.
                    </p>
                  </div>

                  <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Mapeado en:</span>
                    <span className="font-semibold text-slate-300">
                      {deviceRoom === 'Livingroom' ? 'Sala/Estar' : deviceRoom === 'Bedroom' ? 'Dormitorio' : 'Otros / Patio'}
                    </span>
                  </div>

                  <button
                    onClick={handleResetModal}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-transform active:scale-[0.98] cursor-pointer mt-2"
                  >
                    Ir a la Consola
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
