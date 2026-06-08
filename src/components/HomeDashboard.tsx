/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ChevronDown, 
  SlidersHorizontal, 
  Ellipsis, 
  CloudRain, 
  CloudSun, 
  Tv, 
  Radio, 
  CornerDownRight, 
  Power, 
  Volume2, 
  Bell, 
  Search,
  Check,
  EyeOff,
  LayoutGrid,
  TrendingUp,
  CloudLightning,
  ChevronRight,
  Sparkles,
  RefreshCw,
  MapPin,
  Bluetooth,
  Pencil,
  X
} from 'lucide-react';
import { Device } from '../types';
import { ROOMS } from '../utils/data';
import AddDeviceModal from './AddDeviceModal';

interface HomeDashboardProps {
  devices: Device[];
  onToggleDevice: (id: string, e: React.MouseEvent) => void;
  onSelectDevice: (device: Device) => void;
  onOpenPermission: () => void;
  wsStatus: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  onRenameDevice: (id: string, newName: string) => void;
  onAddDevice: (name: string, room: string) => void;
}

export default function HomeDashboard({ 
  devices, 
  onToggleDevice, 
  onSelectDevice,
  onOpenPermission,
  wsStatus,
  onRenameDevice,
  onAddDevice
}: HomeDashboardProps) {
  const [selectedRoom, setSelectedRoom] = useState('Todos');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hideDisconnected, setHideDisconnected] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  
  // Modal for adding a device state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Renaming state controls
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  
  // Carousel Banner State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Smarter Scenes v4.0",
      desc: "Combina sensores y automatiza tu casa.",
      bg: "bg-radial from-slate-900 via-slate-950 to-blue-950",
      border: "border-blue-500/30",
      accent: <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
    },
    {
      title: "Ramón Electrónica 🇻🇪",
      desc: "Módulos domóticos adaptados al voltaje de Venezuela.",
      bg: "bg-radial from-slate-900 via-slate-950 to-indigo-950",
      border: "border-indigo-500/30",
      accent: <CloudLightning className="w-8 h-8 text-indigo-400 animate-pulse" />
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const filteredDevices = devices.filter((device) => {
    const matchesRoom = selectedRoom === 'Todos' || device.room === selectedRoom;
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConnection = !hideDisconnected || device.isOnline;
    return matchesRoom && matchesSearch && matchesConnection;
  });

  return (
    <div className="w-full flex flex-col min-h-full pb-32 text-slate-800 font-sans relative">
      
      {/* Dynamic Header mimicking image 2 */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
        <div className="relative">
          <button 
            onClick={() => setShowRoomDropdown(!showRoomDropdown)}
            className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
          >
            <span className="text-xl font-bold text-slate-900 font-display tracking-tight group-hover:text-slate-700">
              {selectedRoom === 'Todos' ? 'Mi Hogar 🇻🇪' : selectedRoom}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* Room Selector Dropdown */}
          <AnimatePresence>
            {showRoomDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowRoomDropdown(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40"
                >
                  {ROOMS.map((room) => (
                    <button
                      key={room}
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowRoomDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center justify-between cursor-pointer"
                    >
                      <span>{room === 'Todos' ? 'Ver Todos' : room}</span>
                      {selectedRoom === room && <Check className="w-4 h-4 text-blue-500" />}
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => {
                      alert('Añadir habitaciones personalizadas está disponible en la versión comercial Ramón Electrónica Pro.');
                      setShowRoomDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-400 italic hover:bg-slate-50 cursor-pointer"
                  >
                    Administrar habitaciones
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Global plus action button in header linked directly to addition */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md shadow-blue-500/15 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          title="Agregar Módulo"
        >
          <Plus className="w-5 h-5 font-bold" />
        </button>
      </div>

      {/* WebSocket Live Connection Badge */}
      <div className="px-6 mt-3 flex flex-col gap-2">
        {wsStatus === 'CONNECTED' ? (
          <div className="w-full py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-xl text-[10.5px] font-semibold flex items-center justify-between select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Sincronización Activa • WebSocket Conectado
            </span>
            <span className="text-[9px] uppercase tracking-wider font-mono opacity-85 px-1.5 py-0.5 bg-emerald-100/80 rounded">
              Broker Live
            </span>
          </div>
        ) : wsStatus === 'CONNECTING' ? (
          <div className="w-full py-2 px-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-xl text-[10.5px] font-semibold flex items-center justify-between select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
              Conectando con el Broker en Render...
            </span>
            <span className="text-[9px] uppercase tracking-wider font-mono opacity-85 px-1.5 py-0.5 bg-amber-100/80 rounded animate-pulse">
              Buscando
            </span>
          </div>
        ) : (
          <div className="w-full py-2 px-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 rounded-xl text-[10.5px] font-semibold flex items-center justify-between select-none">
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              Sincronización Offline • Auto-reconexión cada 5s
            </span>
            <span className="text-[9px] uppercase tracking-wider font-mono opacity-85 px-1.5 py-0.5 bg-rose-100/85 rounded">
              Offline
            </span>
          </div>
        )}

        {/* Database Permanent Storage Status */}
        <div className="w-full py-2 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-700 rounded-xl text-[10.5px] font-semibold flex items-center justify-between select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Base de Datos: {devices.length} {devices.length === 1 ? 'Módulo detectado' : 'Módulos detectados'} • Memoria Cifrada Local
          </span>
          <span className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-blue-600">
            LOCAL-DB ✓
          </span>
        </div>
      </div>

      {/* Interactive Sliding Banner mimicking "Smarter Scenes" */}
      <div className="px-6 mt-4">
        <div 
          onClick={handleNextSlide}
          className={`relative overflow-hidden w-full rounded-2xl border ${slides[currentSlide].border} p-5 ${slides[currentSlide].bg} text-white shadow-sm flex items-center justify-between cursor-pointer group hover:shadow-md transition-all`}
        >
          {/* Neon light effect lines inside banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
          <div className="space-y-1 z-10 max-w-[75%]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
              Novedad Comercial
            </span>
            <h3 className="text-base font-bold tracking-tight font-display text-white">
              {slides[currentSlide].title}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {slides[currentSlide].desc}
            </p>
          </div>
          <div className="z-10 bg-white/5 p-2 rounded-xl border border-white/10 group-hover:scale-115 transition-transform shrink-0">
            {slides[currentSlide].accent}
          </div>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {slides.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full ${idx === currentSlide ? 'bg-white w-3' : 'bg-white/30'} transition-all`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filter Category Tabs & Icons Identical to image 2 */}
      <div className="px-6 mt-5 flex items-center justify-between">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-0.5 pr-4 max-w-[75%]">
          {ROOMS.map((room) => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className="relative py-1 text-sm font-semibold tracking-wide cursor-pointer shrink-0 transition-colors focus:outline-none"
            >
              <span className={selectedRoom === room ? 'text-slate-900 border-b-2 border-blue-500 pb-1.5' : 'text-slate-400 hover:text-slate-600'}>
                {room === 'Todos' ? 'Todos los Equipos' : room}
              </span>
            </button>
          ))}
        </div>

        {/* Action icons row mirroring image 2 */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => {
              if (searchTerm) setSearchTerm('');
              else {
                const term = prompt('Buscar dispositivo por nombre:');
                if (term) setSearchTerm(term);
              }
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
            title="Buscar dispositivo"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Options Dropdown mimicking screen 3 */}
          <AnimatePresence>
            {showOptionsDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowOptionsDropdown(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-8 w-56 bg-white rounded-2xl shadow-xl border border-slate-150 py-2.5 z-45"
                >
                  <label className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 block select-none">
                    Ajustes de Vista
                  </label>
                  <button
                    onClick={() => {
                      setHideDisconnected(!hideDisconnected);
                      setShowOptionsDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <EyeOff className="w-4 h-4 text-slate-400" />
                    <span>{hideDisconnected ? "Mostrar Desconectados" : "Ocultar Desconectados"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsGridView(!isGridView);
                      setShowOptionsDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <span>{isGridView ? "Vista en Lista" : "Vista en Cuadrícula"}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Connection Mode Indicator Venezuela */}
      {searchTerm && (
        <div className="mx-6 mt-3 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs flex justify-between items-center">
          <span>Filtro de búsqueda: <strong>"{searchTerm}"</strong></span>
          <button onClick={() => setSearchTerm('')} className="text-blue-500 hover:underline">Reestablecer</button>
        </div>
      )}

      {/* Devices Area */}
      <div className="px-6 mt-5">
        {filteredDevices.length === 0 ? (
          <div className="w-full bg-slate-50 rounded-3xl p-10 text-center border border-slate-100 space-y-3">
            <p className="text-slate-400 text-sm font-semibold">No se encontraron interruptores en esta zona.</p>
            <p className="text-xs text-slate-450 leading-relaxed font-sans">
              Asegúrate de que tus módulos ESP32 / ESP8266 se encuentren encendidos e iniciados bajo la marca Ramón Electrónica.
            </p>
            <button 
              onClick={onOpenPermission}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/50 rounded-xl text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Escanear interruptores locales
            </button>
          </div>
        ) : (
          <div className={isGridView ? "grid grid-cols-2 gap-4" : "space-y-3"}>
            {filteredDevices.map((device, idx) => {
              const isOn = device.state === 'ON';
              const isEditing = editingId === device.id;
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative flex ${isGridView ? 'flex-col justify-between items-start h-40' : 'items-center justify-between'} p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all duration-200`}
                >
                  {/* Left info part of device */}
                  <div 
                    className="flex items-center gap-3.5 cursor-pointer flex-1 w-full"
                    onClick={() => {
                      if (!isEditing) {
                        onSelectDevice(device);
                      }
                    }}
                  >
                    {/* Glowing Switch Icon container similar to image 2 */}
                    <div className={`p-2.5 rounded-xl transition-all shrink-0 ${
                      isOn 
                        ? 'bg-blue-150 text-blue-600 shadow-sm shadow-blue-500/10' 
                        : 'bg-slate-100/80 text-slate-400'
                    }`}>
                      <Power className="w-5 h-5 font-bold" />
                    </div>

                    {isEditing ? (
                      <div 
                        className="flex items-center gap-1.5 flex-1 mr-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (tempName.trim()) {
                                onRenameDevice(device.id, tempName.trim());
                              }
                              setEditingId(null);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                          className="bg-slate-50 border border-blue-400 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none w-full max-w-[125px]"
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (tempName.trim()) {
                              onRenameDevice(device.id, tempName.trim());
                            }
                            setEditingId(null);
                          }}
                          className="p-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 cursor-pointer"
                          title="Confirmar"
                        >
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 cursor-pointer"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-left flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 group/title">
                          <h4 className="text-sm font-semibold text-slate-800 font-sans tracking-tight truncate max-w-[140px] group-hover/title:text-blue-600 transition-colors">
                            {device.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(device.id);
                              setTempName(device.name);
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Editar apodo"
                          >
                            <Pencil className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                        
                        {/* Connection Cloud Green Tag */}
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                            Conectado • En línea
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: State Label + Toggle Slider identical to image 2 */}
                  {!isEditing && (
                    <div className={`flex ${isGridView ? 'w-full justify-between mt-auto' : 'items-center'} gap-3`}>
                      {!isGridView && (
                        <span className={`text-[10px] font-bold font-mono tracking-wider transition-colors ${
                          isOn 
                            ? 'text-emerald-500' 
                            : 'text-slate-400'
                        }`}>
                          {isOn ? 'ENCENDIDO' : 'APAGADO'}
                        </span>
                      )}

                      <button
                        onClick={(e) => onToggleDevice(device.id, e)}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer focus:outline-none ${
                          isOn ? 'bg-blue-500 shadow-md shadow-blue-500/15' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${
                          isOn ? 'left-6.5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  )}

                  {/* Corner indicator details */}
                  <div className="absolute top-2 right-2 flex gap-0.5">
                    <span className="text-[8px] bg-slate-100 text-slate-400 px-1 rounded-sm uppercase tracking-widest font-mono">
                      {device.room}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Quick Execution Panel */}
      <div className="px-6 mt-3 text-slate-400 text-[10px] text-center font-mono select-none">
        Dispositivos Domésticos Inteligentes Ramón Electrónica v4
      </div>

      {/* Floating Add Device button matching eWeLink commercial setup */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="absolute bottom-24 right-6 w-14 h-14 bg-[#108EE9] hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/35 border border-blue-400/20 z-30 transition-all cursor-pointer focus:outline-none"
        title="Agregar Dispositivo Ramón Electrónica"
      >
        <Plus className="w-7 h-7 stroke-[3px]" />
      </motion.button>

      {/* Pairing Smart Wizard Dialog Modal */}
      <AddDeviceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDevice={onAddDevice}
      />
    </div>
  );
}
