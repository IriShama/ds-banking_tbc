import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import * as AllIcons from './icons';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(AllIcons),
    },
    size: {
      control: 'number',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: Object.keys(AllIcons)[0] as keyof typeof AllIcons,
    size: 24,
  },
};

export const Gallery = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 100px)', gap: '16px', padding: '24px' }}>
    {Object.keys(AllIcons).map((name) => (
      <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name={name as keyof typeof AllIcons} size={24} />
        <span style={{ fontSize: '10px', color: '#666', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
      </div>
    ))}
  </div>
);