'use client';

import React from 'react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/styles/theme';

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light" cssVariablesSelector=":root">
      {children}
    </MantineProvider>
  );
}
