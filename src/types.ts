/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Schedule {
  id: string;
  time: string; // e.g., "18:45"
  action: 'ON' | 'OFF';
  active: boolean;
  label: string; // e.g., "Encender permanentemente" or "Apagar automático"
}

export interface Device {
  id: string;
  name: string;
  state: 'ON' | 'OFF';
  room: string;
  isOnline: boolean;
  schedules: Schedule[];
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}
