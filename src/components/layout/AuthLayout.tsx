import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-primary">Dog Activity Tracker</h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </main>
      
      <footer className="py-4 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Dog Activity Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout; 