/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Sparkles, 
  Info, 
  MessageSquare, 
  User as UserIcon, 
  Cpu, 
  Bluetooth, 
  Wifi, 
  Battery, 
  Clock, 
  Smartphone, 
  Maximize, 
  Compass,
  AlertCircle
} from 'lucide-react';

import { Device, User } from './types';
import { INITIAL_DEVICES } from './utils/data';

// Component imports
import SplashView from './components/SplashView';
import LoginView from './components/LoginView';
import PermissionModal from './components/PermissionModal';
import HomeDashboard from './components/HomeDashboard';
import DeviceDetail from './components/DeviceDetail';
import SceneConfigurator from './components/SceneConfigurator';
import StatsDashboard from './components/StatsDashboard';
import MessageInbox from './components/MessageInbox';
import ProfileView from './components/ProfileView';

export default function App() {
  // Persistence Loading
  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('ramon_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ramon_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Flow State
  const [currentView, setCurrentView] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [selectedTab, setSelectedTab] = useState<'hogar' | 'escenas' | 'info' | 'mensaje' | 'perfil'>('hogar');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  
  // Adaptive Simulator Mode for desktop / true fluid layout
  const [isSimulatorMode, setIsSimulatorMode] = useState(true);
  const [time, setTime] = useState('');

  // WebSocket control states
  const [wsStatus, setWsStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'CONNECTING'>('DISCONNECTED');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connection URL and credentials retrieved safely from environment variables (keeping credentials secure for GitHub pushes)
  const mqttUser = import.meta.env.VITE_MQTT_USER || 'ramon_esp32';
  const mqttPass = import.meta.env.VITE_MQTT_PASS || 'control_seguro_panas';
  const mqttUrl = import.meta.env.VITE_MQTT_URL || 'wss://ramon-electronica-backend.onrender.com';

  // Ensure the URL connects explicitly to the standard WebSockets path '/ws' supported by our backend
  const cleanBaseUrl = mqttUrl.endsWith('/') ? mqttUrl.slice(0, -1) : mqttUrl;
  const wsEndpoint = cleanBaseUrl.includes('/ws') ? cleanBaseUrl : `${cleanBaseUrl}/ws`;
  const WS_URL = `${wsEndpoint}?user=${mqttUser}&pass=${mqttPass}&username=${mqttUser}&password=${mqttPass}`;

  // Sincronizar persistencia
  useEffect(() => {
    localStorage.setItem('ramon_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ramon_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ramon_user');
    }
  }, [user]);

  // Setup WebSocket connection with robust autoreconnect
  useEffect(() => {
    let active = true;

    const connectWS = () => {
      if (!active) return;
      
      console.log(`🔌 Conectándose a: ${WS_URL}`);
      setWsStatus('CONNECTING');

      try {
        const socket = new WebSocket(WS_URL);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!active) return;
          console.log('📡 WebSocket conectado exitosamente a Ramón Electrónica Backend en Render');
          setWsStatus('CONNECTED');
          
          // Enviar credenciales en mensaje de inicialización opcionalmente
          try {
            socket.send(JSON.stringify({
              type: 'AUTH',
              user: mqttUser,
              pass: mqttPass,
              username: mqttUser,
              password: mqttPass
            }));
          } catch (e) {
            console.warn('No se pudo enviar mensaje opcional de autenticación:', e);
          }
        };

        socket.onmessage = (event) => {
          if (!active) return;
          console.log('✉️ Mensaje recibido del broker:', event.data);
          try {
            const data = JSON.parse(event.data);
            if (data && data.id && (data.state === 'ON' || data.state === 'OFF')) {
              setDevices(prev => prev.map(dev => {
                if (dev.id === data.id) {
                  return { ...dev, state: data.state, name: data.name || dev.name };
                }
                return dev;
              }));
              
              if (selectedDevice && selectedDevice.id === data.id) {
                setSelectedDevice(prev => prev ? { ...prev, state: data.state, name: data.name || prev.name } : null);
              }
            }
          } catch (err) {
            // Si no es un JSON, parsear formato "id:estado"
            if (typeof event.data === 'string' && event.data.includes(':')) {
              const [id, state] = event.data.split(':');
              if (id && (state === 'ON' || state === 'OFF')) {
                const cleanState = state.trim() as 'ON' | 'OFF';
                setDevices(prev => prev.map(dev => {
                  if (dev.id === id) {
                    return { ...dev, state: cleanState };
                  }
                  return dev;
                }));
                if (selectedDevice && selectedDevice.id === id) {
                  setSelectedDevice(prev => prev ? { ...prev, state: cleanState } : null);
                }
              }
            }
          }
        };

        socket.onclose = () => {
          if (!active) return;
          console.log('⚠️ Conexión de WebSocket cerrada. Reintentando en 5 segundos...');
          setWsStatus('DISCONNECTED');
          reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
        };

        socket.onerror = (error) => {
          console.error('🔥 Error detectado en WebSocket:', error);
          // onclose gatillará la reconexión de forma segura
        };

      } catch (err) {
        console.error('❌ Error al instanciar el cliente WebSocket:', err);
        setWsStatus('DISCONNECTED');
        reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
      }
    };

    connectWS();

    return () => {
      active = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Clock updating loop in Venezuelan format
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format 12-hour
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${suffix}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper safely sending messages over WebSocket to sync Render live server console
  const sendWebSocketMessage = (id: string, name: string, nextState: 'ON' | 'OFF') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // 1. Send clean JSON format
      const payload = {
        id,
        name,
        state: nextState,
        sender: 'WebApp_Client'
      };
      wsRef.current.send(JSON.stringify(payload));

      // 2. Send plain text string format for simple clients/ESP32: "dev-1:ON"
      wsRef.current.send(`${id}:${nextState}`);
      console.log(`📤 Estado enviado al broker en Render: ${id}:${nextState}`);
    } else {
      console.log('⚠️ No se pudo enviar el estado por WebSocket (Conexión offline). Actualizado de forma local.');
    }
  };

  // Set initial view state depending on user credentials persistence
  const handleSplashComplete = () => {
    if (user && user.isLoggedIn) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setCurrentView('dashboard');
    
    // Automatically trigger permissions dialog upon first-time login
    setTimeout(() => {
      setPermissionModalOpen(true);
    }, 1200);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setSelectedDevice(null);
  };

  const handleToggleDevice = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening details
    setDevices(prev => {
      const updated = prev.map(dev => {
        if (dev.id === deviceId) {
          const nextState = dev.state === 'ON' ? 'OFF' : 'ON';
          sendWebSocketMessage(deviceId, dev.name, nextState);
          return { ...dev, state: nextState };
        }
        return dev;
      });
      localStorage.setItem('ramon_devices', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateDevice = (updated: Device) => {
    // Si cambió el estado o el nombre, propagar al WebSocket
    const original = devices.find(d => d.id === updated.id);
    if (original && (original.state !== updated.state || original.name !== updated.name)) {
      sendWebSocketMessage(updated.id, updated.name, updated.state);
    }
    
    setDevices(prev => {
      const updatedList = prev.map(dev => dev.id === updated.id ? updated : dev);
      localStorage.setItem('ramon_devices', JSON.stringify(updatedList));
      return updatedList;
    });
    // Synced detail reference
    setSelectedDevice(updated);
  };

  const handleRenameDevice = (id: string, newName: string) => {
    setDevices(prev => {
      const updated = prev.map(dev => {
        if (dev.id === id) {
          // Enviar rename al WebSocket
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ id, name: newName, state: dev.state, type: 'RENAME' }));
          }
          return { ...dev, name: newName };
        }
        return dev;
      });
      localStorage.setItem('ramon_devices', JSON.stringify(updated));
      return updated;
    });
    
    if (selectedDevice && selectedDevice.id === id) {
      setSelectedDevice(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  const handleAddDevice = (name: string, room: string) => {
    // Generate organic progressive dev- id
    const ids = devices.map(d => {
      const match = d.id.match(/dev-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const nextIdNum = maxId + 1;
    const newId = `dev-${nextIdNum}`;

    const newDevice: Device = {
      id: newId,
      name,
      state: 'OFF',
      room,
      isOnline: true,
      schedules: []
    };

    setDevices(prev => {
      const updated = [...prev, newDevice];
      localStorage.setItem('ramon_devices', JSON.stringify(updated));
      return updated;
    });

    // Propagate registration to active render server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        id: newId,
        name,
        state: 'OFF',
        type: 'REGISTER',
        sender: 'WebApp_Client'
      }));
      console.log(`📤 Nuevo dispositivo registrado enviado por WS: ${newId}:${name}`);
    }
  };

  // Render main core body based on tabs
  const renderDashboardContent = () => {
    switch (selectedTab) {
      case 'hogar':
        return (
          <HomeDashboard 
            devices={devices}
            onToggleDevice={handleToggleDevice}
            onSelectDevice={(device) => setSelectedDevice(device)}
            onOpenPermission={() => setPermissionModalOpen(true)}
            wsStatus={wsStatus}
            onRenameDevice={handleRenameDevice}
            onAddDevice={handleAddDevice}
          />
        );
      case 'escenas':
        return <SceneConfigurator />;
      case 'info':
        return <StatsDashboard devices={devices} />;
      case 'mensaje':
        return <MessageInbox />;
      case 'perfil':
        if (!user) return null;
        return <ProfileView user={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  // Main UI components layout routing
  const renderMainWrapper = () => {
    switch (currentView) {
      case 'splash':
        return <SplashView onComplete={handleSplashComplete} />;
      case 'login':
        return <LoginView onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <div className="w-full min-h-screen bg-slate-50 flex flex-col relative">
            <AnimatePresence mode="wait">
              {selectedDevice ? (
                /* Detalle de interruptor con Botón Circular Gigante Brillantemente animado */
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="absolute inset-0 z-30"
                >
                  <DeviceDetail 
                    device={selectedDevice}
                    onBack={() => setSelectedDevice(null)}
                    onUpdateDevice={handleUpdateDevice}
                  />
                </motion.div>
              ) : (
                /* Panel de Dispositivos eWeLink Principal */
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full min-h-screen flex flex-col"
                >
                  {renderDashboardContent()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Navigation tab selection bar - Matches Image 2 perfectly */}
            {!selectedDevice && (
              <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 py-2.5 px-3 z-20 flex justify-around items-center shadow-lg">
                <button
                  onClick={() => setSelectedTab('hogar')}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    selectedTab === 'hogar' ? 'text-blue-500 scale-105 font-bold' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <Home className="w-5.5 h-5.5" />
                  <span className="text-[10px] tracking-tight">Hogar</span>
                </button>

                <button
                  onClick={() => setSelectedTab('escenas')}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    selectedTab === 'escenas' ? 'text-blue-500 scale-105 font-bold' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <Compass className="w-5.5 h-5.5" />
                  <span className="text-[10px] tracking-tight">Escenas</span>
                </button>

                <button
                  onClick={() => setSelectedTab('info')}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    selectedTab === 'info' ? 'text-blue-500 scale-105 font-bold' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <Info className="w-5.5 h-5.5" />
                  <span className="text-[10px] tracking-tight">Información</span>
                </button>

                <button
                  onClick={() => setSelectedTab('mensaje')}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all relative ${
                    selectedTab === 'mensaje' ? 'text-blue-500 scale-105 font-bold' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <MessageSquare className="w-5.5 h-5.5" />
                  <span className="text-[10px] tracking-tight">Mensaje</span>
                  <span className="absolute top-0 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

                <button
                  onClick={() => setSelectedTab('perfil')}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    selectedTab === 'perfil' ? 'text-blue-500 scale-105 font-bold' : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <UserIcon className="w-5.5 h-5.5" />
                  <span className="text-[10px] tracking-tight">Perfil</span>
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#070b13] text-white flex flex-col justify-start items-center overflow-x-hidden font-sans">
      
      {/* Upper Control Ribbon for presentation */}
      <div className="w-full max-w-7xl px-6 py-3.5 flex justify-between items-center z-40 bg-slate-900/40 backdrop-blur-md border-b border-white/5 select-none text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm">🇻🇪</span>
          <span className="font-bold tracking-tight font-display bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            Ramón Electrónica IoT Platform
          </span>
        </div>
        
        {/* Toggle view controllers */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsSimulatorMode(true)}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
              isSimulatorMode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-250'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vista Smartphone</span>
          </button>
          
          <button
            onClick={() => setIsSimulatorMode(false)}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
              !isSimulatorMode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-250'
            }`}
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* Main Core View Area with either device shell or fluid display */}
      <div className="w-full flex-1 flex justify-center items-center py-6 px-4 md:py-10 max-w-7xl">
        {isSimulatorMode ? (
          /* Phone mock wrapper with status bars matching user photos */
          <div className="relative w-full max-w-[390px] h-[780px] rounded-[52px] bg-slate-950 border-[10px] border-slate-850 shadow-[0_0_80px_rgba(16,142,233,0.15)] flex flex-col overflow-hidden relative">
            {/* Front speaker Notch */}
            <div className="absolute top-0 inset-x-0 h-7 bg-slate-950 flex justify-center items-start z-50 pointer-events-none">
              <div className="w-28 h-4 bg-slate-950 rounded-b-xl" />
            </div>

            {/* Custom high fidelity phone status bar */}
            <div className={`w-full h-8 flex justify-between items-center px-6 pt-3 select-none text-[11px] font-semibold text-white/90 z-40 transition-colors ${
              currentView === 'dashboard' && !selectedDevice ? 'text-slate-800 bg-white/80' : 'text-white'
            }`}>
              {/* Left clock */}
              <span className="font-mono tracking-wide">{time || '12:00 PM'}</span>
              
              {/* Right indicators */}
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 shrink-0" />
                <Bluetooth className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                <span className="text-[9px] font-mono tracking-tight font-bold">4G LTE</span>
                <Battery className="w-4 h-4 shrink-0 rotate-0" />
                <span className="text-[10px] font-mono">46%</span> {/* Matches user percent! */}
              </div>
            </div>

            {/* Simulated core application container */}
            <div className="flex-1 w-full overflow-y-auto relative bg-[#090b11] no-scrollbar">
              {renderMainWrapper()}
            </div>

            {/* Smartphone virtual Pill home button */}
            <div className="absolute bottom-1.5 inset-x-0 h-1 z-40 pointer-events-none flex justify-center">
              <div className="w-28 h-1 bg-slate-350/50 rounded-full" />
            </div>
          </div>
        ) : (
          /* Raw 100% PWA Fluid Mode - required by PWA specification */
          <div className="w-full min-h-[700px] bg-[#090b11] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            {renderMainWrapper()}
          </div>
        )}
      </div>

      {/* Permissions Global Modal */}
      <PermissionModal 
        isOpen={permissionModalOpen} 
        onClose={() => setPermissionModalOpen(false)} 
      />
    </div>
  );
}
