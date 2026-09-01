import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prototypes | __PROTOTYPE_NAME__',
  description: 'Prototype pages built with the AppDirect design system kit',
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
