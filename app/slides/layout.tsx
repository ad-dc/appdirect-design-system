import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Factory deck | AppDirect DS',
  description: 'Slide deck for the AppDirect agentic production building blocks',
};

export default function SlidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
