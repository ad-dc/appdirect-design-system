'use client';

import React from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/styles/theme';

/**
 * Client-side root provider wrapper.
 *
 * Lives in a `'use client'` boundary because `theme` (in `styles/theme.ts`)
 * contains a `components.Button.vars` callback function. Functions cannot be
 * serialized across the Next.js server→client boundary, so the theme must be
 * referenced from a client component rather than passed in from a server
 * component layout.
 */
export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light" cssVariablesSelector=":root">
      {children}
    </MantineProvider>
  );
}
