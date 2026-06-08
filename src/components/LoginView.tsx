/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'cliente@example.com',
    password: '',
  });
  const [error, setError] = useState('');
  
  // Simulated SMTP pipeline state
  const [isSimulatingSending, setIsSimulatingSending] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const executeSmtpSimulation = (name: string, email: string) => {
    setIsSimulatingSending(true);
    setSimulationSteps([
      'Generando solicitud de registro para Ramón Electrónica 🇻🇪...',
      'Cifrando contraseña en túnel SHA-256 seguro...',
      'Sincronizando con el servidor central de eWeLink...',
      'Estableciendo canal MQTT de aprovisionamiento...',
      `Simulando envío de datos de registro a: ramonelectronicaapp@gmail.com...`,
      'Enviando credenciales: ' + name + ' <' + email + '>',
      'Confirmación recibida: Correo administrativo notificado con éxito. ✅'
    ]);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulatingSending(false);
            onLogin({ name, email, isLoggedIn: true });
          }, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Por favor, rellene todos los campos obligatorios.');
      return;
    }
    
    if (isRegistering) {
      if (!formData.name) {
        setError('Por favor, ingrese su nombre para el registro comercial.');
        return;
      }
      // Start elegant simulation
      executeSmtpSimulation(formData.name, formData.email);
    } else {
      // Simulate simple login bypass with default info or real inputs
      onLogin({
        name: formData.name || 'Ramón Quero',
        email: formData.email,
        isLoggedIn: true
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-white overflow-hidden font-sans">
      {/* Glow Orbs background to match eWeLink splash screen */}
      <div className="absolute top-[-10%] right-[-15%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic Panel */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-4 select-none">
            <span className="text-3xl font-black font-display text-white">R</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display text-white">
            Ramón Electrónica 🇻🇪
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isRegistering ? 'Cree su cuenta comercial de domótica' : 'Inicie sesión en su panel de interruptores'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-medium text-slate-400 tracking-wide uppercase px-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej. Ramón Quero"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 tracking-wide uppercase px-1">
              Usuario o Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="ramonquero187@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 tracking-wide uppercase px-1">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 mt-6 active:scale-95 transition-all"
          >
            <span>{isRegistering ? 'Completar Registro Comercial' : 'Iniciar Sesión Control'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <p className="text-slate-500">
            {isRegistering ? '¿Ya tiene instalado el sistema?' : '¿Dispositivo nuevo de Ramón Electrónica?'}
          </p>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 hover:text-blue-300 font-medium ml-1 mt-1 cursor-pointer transition-colors"
          >
            {isRegistering ? 'Inicie sesión aquí' : 'Registre su nuevo equipo aquí'}
          </button>
        </div>
      </div>

      {/* High Fidelity SMTP Simulation Screen */}
      <AnimatePresence>
        {isSimulatingSending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white font-display">
                    Canal Administrativo IoT
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sincronizando credenciales comerciales
                  </p>
                </div>
              </div>

              {/* Server Terminal Panel */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-400 min-h-[180px] flex flex-col justify-end space-y-2 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full select-none">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  FORWARD_PORT_3000
                </div>
                
                {simulationSteps.slice(0, stepIndex + 1).map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-1 ${idx === stepIndex ? 'text-blue-400' : 'text-slate-500'}`}
                  >
                    <span className="text-blue-600 select-none shrink-0">&gt;</span>
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Servidor Destinatario:</span>
                  <span className="text-slate-200 font-medium">SMTP Ramón Electrónica v4</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Notificación Directa:</span>
                  <span className="text-sky-300 font-bold font-mono">ramonelectronicaapp@gmail.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
