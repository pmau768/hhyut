import { ConfigPlugin } from '../types';

const customThemePlugin: ConfigPlugin = {
  id: 'custom-theme',
  name: 'Custom Theme Plugin',
  version: '1.0.0',
  description: 'Adds custom theme configuration',
  type: 'config',
  config: {
    colors: {
      primary: '#00ff00',
      secondary: '#ff0000',
    },
    fonts: {
      heading: 'Roboto',
      body: 'Open Sans',
    },
  },
};

export default customThemePlugin;