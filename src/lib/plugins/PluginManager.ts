import { AnyPlugin, PluginRegistry, PluginManagerConfig } from './types';
import { ReactNode } from 'react';

class PluginManager {
  private static instance: PluginManager;
  private registry: PluginRegistry = {
    configs: new Map(),
    functions: new Map(),
    ui: new Map(),
  };
  private config: PluginManagerConfig;

  private constructor(config: PluginManagerConfig = {}) {
    this.config = {
      enableHotReload: false,
      validatePlugins: true,
      onError: console.error,
      ...config,
    };
  }

  static getInstance(config?: PluginManagerConfig): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager(config);
    }
    return PluginManager.instance;
  }

  registerPlugin(plugin: AnyPlugin): void {
    try {
      if (this.config.validatePlugins) {
        this.validatePlugin(plugin);
      }

      switch (plugin.type) {
        case 'config':
          this.registry.configs.set(plugin.id, plugin);
          break;
        case 'function':
          this.registry.functions.set(plugin.id, plugin);
          break;
        case 'ui':
          this.registry.ui.set(plugin.id, plugin);
          break;
        default:
          throw new Error(`Unknown plugin type: ${(plugin as any).type}`);
      }
    } catch (error) {
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  unregisterPlugin(pluginId: string): void {
    this.registry.configs.delete(pluginId);
    this.registry.functions.delete(pluginId);
    this.registry.ui.delete(pluginId);
  }

  getPlugin(pluginId: string): AnyPlugin | undefined {
    return (
      this.registry.configs.get(pluginId) ||
      this.registry.functions.get(pluginId) ||
      this.registry.ui.get(pluginId)
    );
  }

  getPluginsByType(type: AnyPlugin['type']): Map<string, AnyPlugin> {
    switch (type) {
      case 'config':
        return this.registry.configs;
      case 'function':
        return this.registry.functions;
      case 'ui':
        return this.registry.ui;
      default:
        throw new Error(`Unknown plugin type: ${type}`);
    }
  }

  executeFunction(pluginId: string, ...args: any[]): any {
    const plugin = this.registry.functions.get(pluginId);
    if (!plugin) {
      throw new Error(`Function plugin not found: ${pluginId}`);
    }
    return plugin.execute(...args);
  }

  getConfig(pluginId: string): Record<string, any> | undefined {
    const plugin = this.registry.configs.get(pluginId);
    return plugin?.config;
  }

  getUIComponents(mountPoint: string): Array<() => ReactNode> {
    const components: Array<() => ReactNode> = [];
    this.registry.ui.forEach((plugin) => {
      if (plugin.mountPoint === mountPoint) {
        components.push(plugin.component);
      }
    });
    return components;
  }

  private validatePlugin(plugin: AnyPlugin): void {
    if (!plugin.id || !plugin.name || !plugin.version || !plugin.type) {
      throw new Error('Invalid plugin: missing required fields');
    }

    switch (plugin.type) {
      case 'function':
        if (typeof plugin.execute !== 'function') {
          throw new Error('Invalid function plugin: missing execute method');
        }
        break;
      case 'ui':
        if (typeof plugin.component !== 'function' || !plugin.mountPoint) {
          throw new Error('Invalid UI plugin: missing component or mountPoint');
        }
        break;
      case 'config':
        if (!plugin.config || typeof plugin.config !== 'object') {
          throw new Error('Invalid config plugin: missing config object');
        }
        break;
    }
  }
}

export default PluginManager;