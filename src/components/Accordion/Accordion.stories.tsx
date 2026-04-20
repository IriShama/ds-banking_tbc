import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <div style={{ width: '375px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Accordion>

const sampleItems = [
  {
    title: 'How to open an account?',
    description: 'Go to the "Accounts" section and click the "Open a new account" button',
    showDescription: true,
    showDivider: true,
    defaultExpanded: false,
  },
  {
    title: 'How long does the translation take?',
    description: 'Transfers within the bank are instant. Interbank transfers take up to 3 business days',
    showDescription: true,
    showDivider: true,
    defaultExpanded: true,
  },
]

export const Default: Story = {
  args: { items: sampleItems },
}

export const NoDescription: Story = {
  args: {
    items: sampleItems.map(item => ({ ...item, showDescription: false })),
  },
}

export const NoDividers: Story = {
  args: {
    items: sampleItems.map(item => ({ ...item, showDivider: false })),
  },
}