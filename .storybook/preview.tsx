import React from 'react';
import type { Preview } from '@storybook/nextjs-vite';
import { MantineProvider } from '@mantine/core';
import { theme } from '../styles/theme';

// Web fonts (load first so @font-face is registered before any selectors use them)
import '@fontsource-variable/inter';
import '@fontsource-variable/roboto-mono';

// Mantine + app CSS (mirrors app/layout.tsx so stories render with the same vars and overrides)
import '@mantine/core/styles.layer.css';
import '../app/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MantineProvider theme={theme} defaultColorScheme="light" cssVariablesSelector=":root">
        <Story />
      </MantineProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [],
        method: 'alphabetical',
        includeNames: false,
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      toc: true,
    },
    a11y: {
      test: 'todo',
    },
  },
  tags: ['autodocs'],
};

export default preview;