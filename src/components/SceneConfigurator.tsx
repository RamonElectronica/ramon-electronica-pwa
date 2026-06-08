/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Save, 
  AlertCircle, 
  Check, 
  TrendingUp, 
  CloudLightning,
  Activity,
  CheckCircle,
  Lightbulb,
  Wifi,
  Trash2
} from 'lucide-react';

interface Scene {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
}

export default function SceneConfigurator() {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 'sc-1',
      name: 'Simulador de Presencia',
      trigger: 'Cuando cae la tarde (06:00 PM)',
      action: 'Encender Luz Perimetral (1)',
      active: true,
    },
    {
      id: 'sc-2',
      name: 'Ahorro Eléctrico Máximo',
      trigger: 'A las 06:15 AM de la mañana',
      action: 'Apagar todos los reflectores exteriores',
      active: true,
    }
  ]);

  const [creatorOpen, setCreatorOpen] = useState(false);
  const [newName, setNewName] = useState('Escena Automatizada');
  const [newTrigger, setNewTrigger] = useState('Al detectar Anochecer local');
  const [newAction, setNewAction] = useState('Encender Reflector Principal');

  const handleDelete = (id: string) => {
    setScenes(scenes.filter(sc => sc.id !== id));
  };

  const handleToggle = (id: string) => {
    setScenes(scenes.map(sc => sc.id === id ? { ...sc, active: !sc.active } : sc));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sc: Scene = {
      id: `sc-${Date.now()}`,
      name: newName,
      trigger: newTrigger,
      action: newAction,
      active: true
    };
    setScenes([...scenes, sc]);
    setCreatorOpen(false);
    // Reset inputs
    setNewName('Escena Automatizada');
    setNewTrigger('Al detectar Anochecer local');
    setNewAction('Encender Reflector Principal');
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 text-slate-800 font-sans bg-slate-50">
      
      {/* Top Banner Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display">
          Mis Escenas Inteligentes
        </h2>
        <button
          onClick={() => setCreatorOpen(true)}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-105 cursor-pointer flex items-center justify-center transition-all active:scale-95 shadow-sm shadow-blue-500/5"
          title="Crear Nueva Escena"
        >
          <Plus className="w-5 h-5 font-bold" />
        </button>
      </div>

      <div className="px-6 py-4 space-y-4">
        
        {/* Banner Informative Indicator */}
        <div className="bg-gradient-to-r from-blue-550 to-indigo-600 text-white p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] uppercase tracking-wider font-mono bg-white/10 px-2 py-0.5 rounded-full inline-block">
            Motor de Reglas Domóticas
          </span>
          <h3 className="text-base font-bold font-display">Sincronización de hardware</h3>
          <p className="text-xs text-blue-100 leading-relaxed font-sans">
            Las escenas permiten enlazar varios interruptores de Ramón Electrónica para que funcionen juntos al unísono, o dependan del horario solar.
          </p>
        </div>

        {/* Scene Lists */}
        <div className="space-y-3 pt-2">
          {scenes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-150 text-center space-y-2">
              <CloudLightning className="w-8 h-8 text-slate-350 mx-auto animate-pulse" />
              <p className="text-xs font-semibold text-slate-400">No tienes ninguna escena automatizada.</p>
              <button 
                onClick={() => setCreatorOpen(true)}
                className="text-xs text-blue-500 font-bold hover:underline"
              >
                Crea una ahora mismo
              </button>
            </div>
          ) : (
            scenes.map((scene) => (
              <motion.div
                key={scene.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-sm text-slate-800 tracking-tight">
                      {scene.name}
                    </h4>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2.5">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(scene.id)}
                      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer focus:outline-none ${
                        scene.active ? 'bg-blue-500' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                        scene.active ? 'left-4.5' : 'left-0.5'
                      }`} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(scene.id)}
                      className="p-1 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Automation triggers representation - Matches image 4 logic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans">
                  <div className="flex items-center gap-1.5 p-2 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-slate-450 uppercase font-mono tracking-wider text-[9px] font-bold block shrink-0">Si:</span>
                    <span className="text-slate-700 font-medium truncate">{scene.trigger}</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-2 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="text-slate-450 uppercase font-mono tracking-wider text-[9px] font-bold block shrink-0">Entonces:</span>
                    <span className="text-slate-700 font-medium truncate">{scene.action}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Slide overlay Scene Creator - Matches Image 4 "Si esto desencadena, entonces aquellas acciones, Agregar" */}
      <AnimatePresence>
        {creatorOpen && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center p-4">
            <div className="absolute inset-0" onClick={() => setCreatorOpen(false)} />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-sm bg-white rounded-t-[32px] p-6 text-slate-800 border-t border-slate-100 z-10 shadow-2xl pb-10"
            >
              {/* Drag Bar */}
              <div className="w-12 h-1 bg-slate-205 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg tracking-tight font-display text-slate-900">
                  Añadir Escena Manual / Auto
                </h3>
                <button onClick={() => setCreatorOpen(false)} className="text-xs text-slate-400 font-semibold">
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nombre de Escena</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
                    required
                  />
                </div>

                {/* Section triggers - Matches image 4 layout */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-150 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-450 uppercase font-mono tracking-wider font-bold block">
                      Si esto desencadena (Trigger)
                    </span>
                    <select
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none"
                    >
                      <option value="Al detectar Anochecer local (06:30 PM)">Al detectar Anochecer local (06:30 PM)</option>
                      <option value="Al salir el Sol (06:00 AM)">Al salir el Sol (06:00 AM)</option>
                      <option value="Cuando la red WiFi se desconecte">Cuando la red WiFi se desconecte</option>
                      <option value="Tocar Botón de Emergencia">Tocar Botón de Emergencia</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-450 uppercase font-mono tracking-wider font-bold block">
                      Entonces aquellas acciones (Acción)
                    </span>
                    <select
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none"
                    >
                      <option value="Encender Reflector Principal">Encender Reflector Principal</option>
                      <option value="Apagar todo el sistema de riego">Apagar todo el sistema de riego</option>
                      <option value="Sincronizar Luces Perimetrales (1 -> ON)">Sincronizar Luces Perimetrales (1 -&gt; ON)</option>
                      <option value="Activar ventilador auxiliar">Activar ventilador auxiliar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCreatorOpen(false)}
                    className="py-2.5 border border-slate-200 text-slate-400 hover:bg-slate-50 rounded-xl text-xs font-bold font-sans cursor-pointer"
                  >
                    Retroceder
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Escena</span>
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
