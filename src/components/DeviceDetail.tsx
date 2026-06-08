/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Power, 
  Clock, 
  Plus, 
  Trash2, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Sliders,
  Calendar,
  Sparkles,
  ToggleLeft,
  Check,
  Pencil,
  X
} from 'lucide-react';
import { Device, Schedule } from '../types';

interface DeviceDetailProps {
  device: Device;
  onBack: () => void;
  onUpdateDevice: (updated: Device) => void;
}

export default function DeviceDetail({ device, onBack, onUpdateDevice }: DeviceDetailProps) {
  const isOn = device.state === 'ON';
  
  // Renaming state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(device.name);

  // Sync tempName with incoming updates
  useEffect(() => {
    setTempName(device.name);
  }, [device.name]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateDevice({
        ...device,
        name: tempName.trim()
      });
    }
    setIsEditingName(false);
  };
  
  // Timer scheduling states
  const [showAddTimer, setShowAddTimer] = useState(false);
  const [newTime, setNewTime] = useState('18:45');
  const [newAction, setNewAction] = useState<'ON' | 'OFF'>('ON');
  const [newLabel, setNewLabel] = useState('Automatización Regular');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lu', 'Ma', 'Mi', 'Ju', 'Vi']);

  const togglePower = () => {
    const nextState = isOn ? 'OFF' : 'ON';
    onUpdateDevice({
      ...device,
      state: nextState
    });
  };

  const handleToggleSchedule = (scheduleId: string) => {
    const updatedSchedules = device.schedules.map(sch => {
      if (sch.id === scheduleId) {
        return { ...sch, active: !sch.active };
      }
      return sch;
    });
    onUpdateDevice({
      ...device,
      schedules: updatedSchedules
    });
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const updatedSchedules = device.schedules.filter(sch => sch.id !== scheduleId);
    onUpdateDevice({
      ...device,
      schedules: updatedSchedules
    });
  };

  const dayOptions = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const [hours, minutes] = newTime.split(':');
    let displayTime = newTime;
    
    // Format elegantly (AM/PM)
    const hrVal = parseInt(hours);
    const suffix = hrVal >= 12 ? 'PM' : 'AM';
    const displayHr = hrVal % 12 === 0 ? 12 : hrVal % 12;
    const formattedLabel = `${newAction === 'ON' ? 'Encender' : 'Apagar'} ${displayHr}:${minutes} ${suffix}`;

    const newSch: Schedule = {
      id: `sch-${Date.now()}`,
      time: newTime,
      action: newAction,
      active: true,
      label: formattedLabel
    };

    onUpdateDevice({
      ...device,
      schedules: [...device.schedules, newSch]
    });

    setShowAddTimer(false);
    // Reset defaults
    setNewTime('18:45');
    setNewLabel('Automatización Regular');
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950 font-sans text-white pb-32">
      
      {/* Top Details Nav Bar */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
        <button 
          onClick={onBack}
          className="p-1 hover:bg-white/10 rounded-xl text-slate-400 cursor-pointer hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {isEditingName ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveName();
                } else if (e.key === 'Escape') {
                  setIsEditingName(false);
                }
              }}
              className="bg-slate-900 border border-blue-500 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none w-36 font-sans"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/10 active:scale-[0.9] transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="p-1.5 bg-rose-600/20 text-rose-400 rounded-lg border border-rose-500/10 active:scale-[0.9] transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingName(true)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-blue-400 transition-colors group select-none"
            title="Editar nombre"
          >
            <span className="text-sm font-bold tracking-tight font-display text-white group-hover:text-blue-500 transition-colors">
              {device.name}
            </span>
            <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
        )}

        {/* Info/More dots */}
        <button 
          onClick={() => {
            alert(`Módulo: ESP32-WROOM\nFabricante: Ramón Electrónica 🇻🇪\nCanal: Integración Segura sin Nube Pública (Seguridad Doméstica Avanzada).`);
          }}
          className="p-1 hover:bg-white/10 rounded-xl text-slate-400 cursor-pointer hover:text-white transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Main control wheel zone */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 relative overflow-hidden">
        {/* Dynamic Glow backing depending on state */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
          isOn ? 'bg-blue-600/35 scale-110' : 'bg-slate-800/10 scale-90'
        }`} />

        <div className="text-center space-y-2 z-10 mb-8 select-none">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block font-mono">
            Estado de Interruptor
          </span>
          <h3 className={`text-3xl font-black font-display transition-colors ${
            isOn ? 'text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-500'
          }`}>
            {isOn ? 'ENCENDIDO' : 'APAGADO'}
          </h3>
          <p className="text-[10px] text-emerald-400 font-mono tracking-wider flex items-center justify-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            MÓDULO ESP32 ONLINE
          </p>
        </div>

        {/* GIANT CIRCULAR BUTTON - Required: glowing intense eWeLink blue (#108EE9) if ON, or gray (#2d3748) if OFF */}
        <div className="relative z-10 mb-10">
          {/* External concentric indicator rings */}
          <div className={`absolute inset-[-20px] rounded-full border transition-all duration-700 ${
            isOn ? 'border-sky-500/20 scale-105' : 'border-slate-800/20'
          }`} />
          <div className={`absolute inset-[-40px] rounded-full border transition-all duration-1000 ${
            isOn ? 'border-blue-500/10 scale-110' : 'border-slate-900/10'
          }`} />

          <button
            onClick={togglePower}
            className={`w-52 h-52 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 hover:scale-[1.03] active:scale-95 border-4 ${
              isOn 
                ? 'bg-[#108EE9] border-sky-300/30 text-white animate-glow'
                : 'bg-[#2d3748] border-slate-700/50 text-slate-400'
            }`}
          >
            <Power className={`w-18 h-18 stroke-[2.5] transition-transform duration-500 ${
              isOn ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'scale-90 text-slate-500'
            }`} />
            
            <span className="text-[10px] font-bold tracking-widest uppercase mt-3 font-mono opacity-80">
              {isOn ? 'Tocar para Apagar' : 'Tocar para Encender'}
            </span>
          </button>
        </div>

        {/* Hardware Status Specs Card */}
        <div className="w-full max-w-sm px-6">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex justify-between text-xs select-none font-mono text-slate-400">
            <div className="text-center space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Potencia</span>
              <strong className="text-slate-205 text-sm">{isOn ? '34.2 W' : '0.0 W'}</strong>
            </div>
            <div className="w-px bg-white/5" />
            <div className="text-center space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Tensión</span>
              <strong className="text-slate-205 text-sm">118.5 VAC</strong>
            </div>
            <div className="w-px bg-white/5" />
            <div className="text-center space-y-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Ubicación</span>
              <strong className="text-slate-200 text-xs">{device.room}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TEMPORIZADOR SECTION - Required: Program/Schedule automatic hours list & action form */}
      <div className="px-6 mt-4">
        <div className="bg-slate-900/70 border border-white/5 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base font-display">
                Temporizadores Automáticos
              </h3>
            </div>
            <button
              onClick={() => setShowAddTimer(true)}
              className="px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-semibold hover:bg-blue-500/20 cursor-pointer transition-all flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Programar</span>
            </button>
          </div>

          {/* Schedules list */}
          <div className="space-y-3">
            {device.schedules.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs space-y-1.5">
                <Clock className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <p>No hay temporizadores configurados.</p>
                <p className="text-[10px] text-slate-600 italic">Configure un horario (Ej: Encender de noche y apagar de mañana).</p>
              </div>
            ) : (
              device.schedules.map((schedule) => (
                <div 
                  key={schedule.id}
                  className={`flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border transition-all ${
                    schedule.active ? 'border-blue-500/20' : 'border-slate-900'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        schedule.action === 'ON' ? 'bg-sky-400 shadow-sm shadow-sky-405' : 'bg-amber-400 shadow-sm shadow-amber-405'
                      }`} />
                      <strong className="text-sm font-semibold tracking-tight text-slate-100">
                        {schedule.time}
                      </strong>
                      <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded-md font-mono uppercase tracking-wider">
                        {schedule.action === 'ON' ? 'Encender' : 'Apagar'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-none">
                      {schedule.label} • Lun - Dom
                    </p>
                  </div>

                  {/* Actions buttons for timer config */}
                  <div className="flex items-center gap-2.5">
                    {/* Toggle Slider schedule */}
                    <button
                      onClick={() => handleToggleSchedule(schedule.id)}
                      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer focus:outline-none ${
                        schedule.active ? 'bg-blue-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                        schedule.active ? 'left-4.5' : 'left-0.5'
                      }`} />
                    </button>

                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="p-1 bg-slate-900 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                      title="Eliminar Horario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Slide overlay for adding schedule */}
      <AnimatePresence>
        {showAddTimer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
            {/* Backdrop cover click handler */}
            <div className="absolute inset-0" onClick={() => setShowAddTimer(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-slate-900 rounded-t-[32px] p-6 text-white border-t border-white/5 z-10"
            >
              {/* Drag bar decoration */}
              <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Nuevo Horario Automático
                </h4>
                <button 
                  onClick={() => setShowAddTimer(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleAddSchedule} className="space-y-5">
                {/* Time picker layout */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">Hora de Ejecución</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-center tracking-widest text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Switch direction action toggle */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">Acción a realizar</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewAction('ON')}
                      className={`py-2.5 rounded-xl text-center text-xs font-semibold cursor-pointer transition-all ${
                        newAction === 'ON' 
                          ? 'bg-blue-600 shadow-lg shadow-blue-500/10 text-white' 
                          : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Encender (ON)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAction('OFF')}
                      className={`py-2.5 rounded-xl text-center text-xs font-semibold cursor-pointer transition-all ${
                        newAction === 'OFF' 
                          ? 'bg-blue-600 shadow-lg shadow-blue-500/10 text-white' 
                          : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Apagar (OFF)
                    </button>
                  </div>
                </div>

                {/* venezuela target label */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">Etiqueta de Tarea</label>
                  <input
                    type="text"
                    placeholder="Ej. Sincronizar Luces de Patio"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Day option list */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium block">Días Repetitivos</label>
                  <div className="flex justify-between">
                    {dayOptions.map((day) => {
                      const active = selectedDays.includes(day);
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => toggleDaySelection(day)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center transition-colors ${
                            active 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-950 text-slate-500 hover:text-slate-350'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTimer(false)}
                    className="py-3 border border-slate-800 text-slate-400 hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs cursor-pointer flex items-center justify-center gap-1 shadow-lg shadow-blue-500/10"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Horario</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
