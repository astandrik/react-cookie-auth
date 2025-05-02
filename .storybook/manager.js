import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'React Cookie Auth',
  brandUrl: 'https://github.com/astandrik/react-cookie-auth',
  brandTarget: '_blank',
  
  // UI colors
  colorPrimary: '#2563eb', // Blue 600
  colorSecondary: '#3b82f6', // Blue 500
  
  // UI
  appBg: '#f8fafc', // Slate 50
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0', // Slate 200
  appBorderRadius: 6,
  
  // Typography
  fontBase: '"Inter", "Segoe UI", sans-serif',
  fontCode: 'monospace',
});

addons.setConfig({
  theme,
  enableShortcuts: true,
});