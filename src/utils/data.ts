/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Device } from '../types';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev-1',
    name: 'Luz perimetral (1)',
    state: 'ON',
    room: 'Todos',
    isOnline: true,
    schedules: [
      { id: 'sch-1', time: '18:45', action: 'ON', active: true, label: 'Encender de noche' },
      { id: 'sch-2', time: '06:00', action: 'OFF', active: true, label: 'Apagar de mañana' }
    ]
  },
  {
    id: 'dev-2',
    name: 'Reflector Principal Entrada',
    state: 'OFF',
    room: 'Todos',
    isOnline: true,
    schedules: [
      { id: 'sch-3', time: '19:00', action: 'ON', active: true, label: 'Seguridad nocturna' },
      { id: 'sch-4', time: '05:30', action: 'OFF', active: true, label: 'Apagar reflector' }
    ]
  },
  {
    id: 'dev-3',
    name: 'Bomba de Agua Tanque',
    state: 'OFF',
    room: 'Livingroom',
    isOnline: true,
    schedules: []
  },
  {
    id: 'dev-4',
    name: 'Ventilador Habitación',
    state: 'ON',
    room: 'Bedroom',
    isOnline: true,
    schedules: [
      { id: 'sch-5', time: '22:00', action: 'ON', active: false, label: 'Enfriar cuarto' }
    ]
  },
  {
    id: 'dev-5',
    name: 'Luz Interna Pasillo',
    state: 'OFF',
    room: 'Other',
    isOnline: true,
    schedules: []
  }
];

export const ROOMS = ['Todos', 'Livingroom', 'Bedroom', 'Other'];
