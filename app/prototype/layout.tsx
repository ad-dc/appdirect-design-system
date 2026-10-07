import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prototype | AppDirect Design System',
  description: 'Prototype pages belong in ad-dc/appdirect-prototype-template',
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
