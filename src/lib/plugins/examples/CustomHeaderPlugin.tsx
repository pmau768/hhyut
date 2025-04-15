import { UIPlugin } from '../types';

const CustomHeaderPlugin: UIPlugin = {
  id: 'custom-header',
  name: 'Custom Header Plugin',
  version: '1.0.0',
  description: 'Adds a custom header component',
  type: 'ui',
  mountPoint: 'header',
  component: () => (
    <div className="bg-primary/10 p-2 rounded-lg">
      <p className="text-sm text-center">Custom Header Content</p>
    </div>
  ),
};

export default CustomHeaderPlugin;