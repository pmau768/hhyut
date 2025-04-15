import { useState, useEffect } from 'react';
import PluginManager from '../PluginManager';
import { AnyPlugin } from '../types';

export function usePlugins(type?: AnyPlugin['type']) {
  const [plugins, setPlugins] = useState<Map<string, AnyPlugin>>(new Map());
  const pluginManager = PluginManager.getInstance();

  useEffect(() => {
    if (type) {
      setPlugins(pluginManager.getPluginsByType(type));
    } else {
      const allPlugins = new Map();
      ['config', 'function', 'ui'].forEach((t) => {
        const typePlugins = pluginManager.getPluginsByType(t as AnyPlugin['type']);
        typePlugins.forEach((plugin, id) => allPlugins.set(id, plugin));
      });
      setPlugins(allPlugins);
    }
  }, [type]);

  return plugins;
}

export function useUIComponents(mountPoint: string) {
  const [components, setComponents] = useState<Array<() => React.ReactNode>>([]);
  const pluginManager = PluginManager.getInstance();

  useEffect(() => {
    setComponents(pluginManager.getUIComponents(mountPoint));
  }, [mountPoint]);

  return components;
}