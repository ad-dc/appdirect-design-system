import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '__PROTOTYPE_NAME__',
  description: 'AppDirect design-system prototype',
};

export default function HomePage() {
  redirect('/prototype');
}
