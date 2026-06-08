/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Newspaper, HelpCircle, MessageSquare, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';

interface AlertItem {
  id: string;
  source: 'sistema' | 'escena';
  title: string;
  desc: string;
  time: string;
}

export default function MessageInbox() {
  const [selectedSubTab, setSelectedSubTab] = useState<'Aviso' | 'Guía' | 'Explorar'>('Aviso');

  // Interactive warnings / logs
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'al-1',
      source: 'sistema',
      title: 'Dispositivo Vinculado',
      desc: 'El módulo Luz perimetral (1) / ESP32 se ha registrado correctamente en tu red Ramón Electrónica.',
      time: 'Hace 5 min'
    },
    {
      id: 'al-2',
      source: 'escena',
      title: 'Escena Ejecutada Automáticamente',
      desc: 'Regla [Ahorro Eléctrico Máximo]: Todos los reflectores se apagaron al amanecer.',
      time: 'Hoy, 06:15 AM'
    }
  ]);

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 text-slate-800 font-sans bg-slate-50">
      
      {/* Top Navigation Row echoing image 9 */}
      <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-around items-center h-14 text-sm font-semibold text-slate-400 select-none">
          <button
            onClick={() => setSelectedSubTab('Guía')}
            className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:text-slate-700 transition-colors ${
              selectedSubTab === 'Guía' ? 'text-blue-500 border-b-2 border-blue-500' : ''
            }`}
          >
            Guía
          </button>
          <button
            onClick={() => setSelectedSubTab('Explorar')}
            className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:text-slate-700 transition-colors ${
              selectedSubTab === 'Explorar' ? 'text-blue-500 border-b-2 border-blue-500' : ''
            }`}
          >
            Explorar
          </button>
          <button
            onClick={() => setSelectedSubTab('Aviso')}
            className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:text-slate-700 transition-colors relative ${
              selectedSubTab === 'Aviso' ? 'text-blue-500 border-b-2 border-blue-500' : ''
            }`}
          >
            Aviso
            {alerts.length > 0 && (
              <span className="absolute top-3.5 right-6 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        
        {selectedSubTab === 'Aviso' ? (
          <>
            {/* Header controls */}
            {alerts.length > 0 && (
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Ecosistema de Notificaciones</span>
                <button 
                  onClick={handleClearAlerts}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Marcar todas como leídas
                </button>
              </div>
            )}

            {/* List items representation echoing image 9 */}
            {alerts.length === 0 ? (
              <div className="py-16 text-center space-y-5 flex flex-col items-center justify-center">
                {/* Simulated clipboard empty graphic requested by Image 9 */}
                <div className="relative w-32 h-32 opacity-40">
                  <div className="absolute inset-0 bg-slate-200 rounded-full blur-xl pointer-events-none" />
                  <div className="w-24 h-28 bg-white border border-slate-205 rounded-xl mx-auto flex flex-col py-4 px-3 space-y-3 shadow-inner">
                    <div className="w-12 h-2 bg-slate-200 rounded-full mx-auto" />
                    <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                    <div className="w-[85%] h-1.5 bg-slate-100 rounded-full" />
                    <div className="w-[90%] h-1.5 bg-slate-100 rounded-full" />
                    <div className="w-[60%] h-1.5 bg-slate-105 rounded-full mt-2" />
                  </div>
                  {/* Little character simulator */}
                  <span className="absolute bottom-1 right-2 w-7 h-7 bg-blue-105 rounded-full border border-blue-200 flex items-center justify-center text-[10px]">👤</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">No tienes ninguna notificación.</p>
                  <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    Las alertas operativas sobre tus módulos ESP32 de Ramón Electrónica aparecerán en este buzón.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-3.5"
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      alert.source === 'sistema' ? 'bg-blue-50 text-blue-500' : 'bg-indigo-50 text-indigo-500'
                    }`}>
                      <Smartphone className="w-4.5 h-4.5" />
                    </div>
                    
                    <div className="space-y-1 text-left flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-805 tracking-tight">
                          {alert.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                        {alert.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : selectedSubTab === 'Guía' ? (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <h3 className="font-bold text-sm text-slate-800">Sincronización Manual de Relés</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Para enlazar tu interruptor Ramón Electrónica por primera vez, presione el botón físico del dispositivo durante 5 segundos hasta que el LED parpadee rápidamente de color azul.
              </p>
              <span className="text-[10px] text-blue-500 font-bold hover:underline block cursor-pointer">Ver video demostración &gt;</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <h3 className="font-bold text-sm text-slate-800">Control por Comandos de voz</h3>
              <p className="text-xs text-slate-505 leading-relaxed">
                Nuestros dispositivos son totalmente compatibles con asistentes como Alexa y Google Home sin necesidad de pasarelas costosas. Sincronice mediante eWeLink oficial.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 text-white border border-indigo-500/20">
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 font-mono block mb-1">Catálogo 2026</span>
              <h3 className="font-bold text-base font-display">Interruptores Inteligentes Ramón Electrónica</h3>
              <p className="text-xs text-indigo-200 leading-relaxed mt-1 mb-3">
                Adquiere módulos de relé reforzados para bombas de agua y aires acondicionados que operan óptimamente con las fluctuaciones de red locales.
              </p>
              <button 
                onClick={() => alert('Generando enlace al catálogo comercial en WhatsApp Ramón Electrónica...')}
                className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-400 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
              >
                Preguntar en Soporte
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
