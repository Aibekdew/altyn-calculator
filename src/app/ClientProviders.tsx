'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import ReduxProvider from '@/providers/ReduxProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class">
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}
