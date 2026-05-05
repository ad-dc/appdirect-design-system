import type { Metadata } from "next";

// Mantine CSS imports (load first)
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';

// Custom CSS (load after Mantine to override)
import "./globals.css";
import 'remixicon/fonts/remixicon.css';

import { RootProviders } from "@/components/RootProviders";

export const metadata: Metadata = {
  title: "Cursor Mantine App",
  description: "Runtime shell for the AppDirect Mantine design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
