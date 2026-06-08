/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User as UserIcon, 
  ChevronRight, 
  Settings, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Smartphone, 
  Heart, 
  LogOut,
  Sparkles,
  Wifi,
  CloudLightning,
  SmartphoneIcon
} from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

export default function ProfileView({ user, onLogout }: ProfileViewProps) {
  return (
    <div className="w-full flex flex-col min-h-screen pb-24 text-slate-800 font-sans bg-slate-50">
      
      {/* Top Profile Header including User Info from image 10 */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 pt-10 text-white border-b border-slate-805 text-left relative overflow-hidden">
        {/* Glow orbs decoration */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex justify-between items-start z-10 relative">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 border-2 border-white/15 flex items-center justify-center font-display text-2xl font-black text-white select-none shadow-md">
              RE
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-lg font-display tracking-tight text-white leading-none">
                  Ramón Electrónica
                </h3>
                <span className="text-[10px] bg-blue-500/25 text-blue-400 border border-blue-500/30 font-semibold px-1.5 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                ramonelectronicaapp@gmail.com
              </p>
              <button 
                onClick={() => alert(`Información Comercial:\nDueño: Ing. Ramón Quero\nContacto de Negocios: ramonelectronicaapp@gmail.com\nEdición de hardware: ESP32/ESP8266 domótica segura (PWA).`)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Más información</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => alert('Ajustes del Ecosistema Ramón Electrónica cargados localmente.')}
            className="p-1.5 bg-white/10 hover:bg-white/15 text-slate-300 rounded-xl cursor-pointer"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Compatible integrations badgeline - Matches image 10 */}
        <div className="mt-6 pt-4 border-t border-white/5 space-y-2 relative z-10 select-none">
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-450 block font-mono">
            Integración de Voz Certificada
          </span>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-[10px] bg-white/10 text-slate-100 border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
              🗣️ Google Assistant
            </span>
            <span className="text-[10px] bg-white/10 text-slate-100 border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
              🗣️ Alexa Echo
            </span>
            <span className="text-[10px] bg-white/10 text-slate-100 border border-white/5 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
              🔌 IFTTT Rules
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        
        {/* Core Profile Links row echoing image 10 */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50 text-xs font-semibold text-slate-700 text-left">
          
          <button 
            onClick={() => alert(`Soporte de Ramón Electrónica:\nSincroniza tus módulos ESP32 de forma autónoma sin depender de servidores de eWeLink en China.`)}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Administrar Accesos y Permisos</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button 
            onClick={() => alert('Entrando al foro local de programadores domóticos ESP32 en Venezuela...')}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>Foro de Soporte Técnico</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button 
            onClick={() => alert('Complemento Prime disponible vinculando tu reloj inteligente.')}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <div className="flex items-center gap-1.5">
                <span>Wear OS Smartwatches</span>
                <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono uppercase">Prime</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button 
            onClick={() => alert('Vincule su vehículo en la consola del automóvil mediante la app oficial.')}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <SmartphoneIcon className="w-4 h-4 text-purple-500" />
              <div className="flex items-center gap-1.5">
                <span>Android Auto & CarPlay</span>
                <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono uppercase">Advanced</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div 
            onClick={() => alert('Funciones de firmware en fase de pruebas para interruptores Ramón Electrónica.')}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer relative"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Funciones Piloto Beta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-505 rounded-full" />
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

        </div>

        {/* Secondary Profile Blocks echoing image 10 */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50 text-xs font-semibold text-slate-700 text-left">
          
          <button 
            onClick={() => alert('Por favor, envíe sus preguntas directas a ramonelectronicaapp@gmail.com.')}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-slate-450" />
              <span>Ayuda y Comentarios Comerciales</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button 
            onClick={() => alert('Agradecemos especialmente a toda nuestra distinguida clientela en Venezuela y los probadores de hardware del Ing. Ramón Quero.')}
            className="w-full px-5 py-3.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Agradecimiento Especial</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="w-full px-5 py-3.5 flex items-center justify-between font-mono text-[10px] text-slate-400 bg-slate-50/50">
            <span>Versión de Applet</span>
            <strong className="text-slate-500">v4.0.12 Gold (Venezuela)</strong>
          </div>

        </div>

        {/* Logout Trigger button */}
        <button
          onClick={onLogout}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión Localmente</span>
        </button>

      </div>
    </div>
  );
}
