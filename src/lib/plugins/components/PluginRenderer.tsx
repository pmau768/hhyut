import { useUIComponents } from '../hooks/usePlugins';

interface PluginRendererProps {
  mountPoint: string;
}

const PluginRenderer = ({ mountPoint }: PluginRendererProps) => {
  const components = useUIComponents(mountPoint);

  return (
    <>
      {components.map((Component, index) => (
        <Component key={index} />
      ))}
    </>
  );
};

export default PluginRenderer;