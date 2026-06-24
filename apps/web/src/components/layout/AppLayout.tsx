import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="app-shell">
    <Header />
    <main className="app-main">{children}</main>
    <Footer />
  </div>
);
