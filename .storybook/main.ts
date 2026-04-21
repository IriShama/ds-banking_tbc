import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const svgr = await import('@svgr/rollup');
    return mergeConfig(config, {
      plugins: [svgr.default()],
    });
  },
};

export default config;