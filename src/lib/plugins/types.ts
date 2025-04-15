import { ReactNode } from 'react';

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
}

export interface ConfigPlugin extends Plugin {
  type: 'config';
  config: Record<string, any>;
}

export interface FunctionPlugin extends Plugin {
  type: 'function';
  execute: (...args: any[]) => any;
}

export interface UIPlugin extends Plugin {
  type: 'ui';
  component: () => ReactNode;
  mountPoint: string;
}

export type AnyPlugin = ConfigPlugin | FunctionPlugin | UIPlugin;

export interface PluginRegistry {
  configs: Map<string, ConfigPlugin>;
  functions: Map<string, FunctionPlugin>;
  ui: Map<string, UIPlugin>;
}

export interface PluginManagerConfig {
  enableHotReload?: boolean;
  validatePlugins?: boolean;
  onError?: (error: Error) => void;
}