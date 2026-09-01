import type { Metadata } from 'next';

import '@fontsource-variable/inter';
import '@fontsource-variable/roboto-mono';

import '@mantine/core/styles.css';
import '@appdirect/ds-prototype-kit/css/foundations.css';
import '@appdirect/ds-prototype-kit/css/mantine.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';

import './globals.css';
import 'remixicon/fonts/remixicon.css';

import { RootProviders } from '@/components/RootProviders';

export const metadata: Metadata = {
  title: '__PROTOTYPE_NAME__',
  description: 'Prototype workspace using the AppDirect design system kit',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
