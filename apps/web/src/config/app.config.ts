/**
 * Application Configuration
 * Central configuration for app-wide settings
 */

export const appConfig = {
  // Application Information
  name: 'MAGNA',
  fullName: 'MAGNA Process Management',
  description: 'Système de gestion des processus métier',
  version: '1.0.0',

  // Branding
  logo: {
    text: 'MAGNA',
    icon: '⚡', // You can replace with actual logo component/path
  },

  // Theme
  theme: {
    primaryColor: 'orange',
    accentColor: 'black',
  },

  // Contact & Links
  support: {
    email: 'support@magna.com',
    phone: '+33 1 23 45 67 89',
  },

  // Features flags (for enabling/disabling features)
  features: {
    notifications: true,
    search: true,
    darkMode: false,
  },
} as const;

export type AppConfig = typeof appConfig;
