/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, TrendingUp, RefreshCw, Calendar, Flame, AlertCircle, Sparkles, Sliders, Shield } from 'lucide-react';
import { Device } from '../types';

interface StatsDashboardProps {
  devices: Device[];
}

export default function StatsDashboard({ devices }: StatsDashboardProps) {
  const activeDevices = devices.filter(d => d.state === 'ON').length;
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week'>('day');

  // Interactive mock logs / data representation for Venezuela environment
  const todayUsage = [
    { hour: '06 AM', kwh: 0.12 },
    { hour: '09 AM', kwh: 0.45 },
    { hour: '12 PM', kwh: 0.88 },
    { hour: '03 PM', kwh: 1.20 },
    { hour: '06 PM', kwh: 1.65 },
    { hour: '09 PM', kwh: 2.10 },
    { hour: '12 AM', kwh: 0.95 }
  ];

  const weeklyUsage = [
    { day: 'Lun', kwh: 8.5 },
    { day: 'Mar', kwh: 10.2 },
    { day: 'Mie', kwh: 9.1 },
    { day: 'Jue', kwh: 14.6 },
    { day: 'Vie', kwh: 12.3 },
    { day: 'Sab', kwh: 11.2 },
    { day: 'Dom', kwh: 6.8 }
  ];

  const totalKwhToday = todayUsage.reduce((acc, curr) => acc + curr.kwh, 0).toFixed(2);
  const totalKwhWeek = weeklyUsage.reduce((acc, curr) => acc + curr.kwh, 0).toFixed(1);

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 text-slate-800 font-sans bg-slate-50">
      
      {/* Header Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display">
          Estadísticas de Consumo
        </h2>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-205">
          <button
            onClick={() => setSelectedPeriod('day')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
              selectedPeriod === 'day' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
              selectedPeriod === 'week' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            Semana
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        
        {/* Active hardware summary row resembling image 8 ("1 dispositivo está encendido") */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Resumen de carga</span>
            <p className="text-xs text-slate-700 font-medium">
              Hay <strong className="text-blue-500 font-bold">{activeDevices}</strong> {activeDevices === 1 ? 'dispositivo encendido' : 'dispositivos encendidos'} en tu red.
            </p>
          </div>
          <span className={`w-3.5 h-3.5 rounded-full ${activeDevices > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
        </div>

        {/* Energy Dashboard Panel - Matches icon on image 8 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Panel de Energía Doméstica</h3>
                <p className="text-[10px] text-slate-450">Historial de consumo estimado (kWh)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Consumo {selectedPeriod === 'day' ? 'Hoy' : 'Semanal'}</span>
              <strong className="text-base text-slate-900 font-display font-black">
                {selectedPeriod === 'day' ? `${totalKwhToday} kWh` : `${totalKwhWeek} kWh`}
              </strong>
            </div>
          </div>

          {/* Interactive SVG Column Chart representing metrics */}
          <div className="h-44 bg-slate-50/50 border border-slate-150 rounded-2xl p-4 flex items-end justify-between font-mono text-[9px] relative overflow-hidden select-none">
            {/* Horizontal Grid lines */}
            <div className="absolute top-1/4 left-0 right-0 h-px bg-slate-100/80 pointer-events-none" />
            <div className="absolute top-2/4 left-0 right-0 h-px bg-slate-100/80 pointer-events-none" />
            <div className="absolute top-3/4 left-0 right-0 h-px bg-slate-100/80 pointer-events-none" />

            {selectedPeriod === 'day' ? (
              todayUsage.map((item, idx) => {
                // Sizing helper
                const pct = (item.kwh / 2.50) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end z-10 space-y-2 group">
                    <div className="text-[8px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.kwh}
                    </div>
                    <div 
                      className="w-4 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md hover:from-blue-500 hover:to-indigo-400 transition-all duration-300"
                      style={{ height: `${Math.max(pct, 12)}%` }}
                    />
                    <span className="text-slate-400 scale-95">{item.hour}</span>
                  </div>
                );
              })
            ) : (
              weeklyUsage.map((item, idx) => {
                const pct = (item.kwh / 18.0) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end z-10 space-y-2 group">
                    <div className="text-[8px] font-bold text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.kwh}k
                    </div>
                    <div 
                      className="w-5 bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-md hover:from-indigo-500 hover:to-blue-400 transition-all duration-300"
                      style={{ height: `${Math.max(pct, 15)}%` }}
                    />
                    <span className="text-slate-400 font-semibold">{item.day}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Presence Simulator card - Matches image 8 "Simular Presencia: Enciende y apaga..." */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-slate-800">Simulador de Presencia Activo</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Enciende y apaga tus bombillos o luces perimetrales de forma aleatoria para despistar y simular que hay personas dentro de la oficina o casa cuando estás fuera. Se adapta al horario de Venezuela.
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert('Simulador de Presencia activado de forma aleatoria. Los módulos correspondientes han recibido el vector de guardia.')}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-150 transition-colors cursor-pointer"
          >
            Habilitar Simulación
          </button>
        </div>

        {/* Diagnostics & voltage levels */}
        <div className="p-4 bg-slate-100 border border-slate-150 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
          <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
          <p className="leading-relaxed">
            Frecuencia eléctrica nominal certificada en 60Hz. Diagnóstico integrado Ramón Electrónica sin anomalías térmicas en los relés.
          </p>
        </div>

      </div>
    </div>
  );
}
