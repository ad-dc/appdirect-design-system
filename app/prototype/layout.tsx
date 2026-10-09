import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AppDirect Design System',
  description: 'Design-system source of truth for AppDirect admin UIs',
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
