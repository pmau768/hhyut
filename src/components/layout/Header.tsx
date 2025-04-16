import { FC } from 'react';
import SignOutButton from '@/components/auth/SignOutButton';
import { getUser } from '@/lib/localStorage';

const Header: FC = () => {
  const user = getUser();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-50 px-4 py-3 border-b backdrop-blur-lg bg-background/80 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-lg font-semibold">Dog Activity Tracker</h1>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-muted-foreground">
            {user?.name}
          </div>
          <SignOutButton size="sm" />
        </div>
      </div>
    </header>
  );
};

export default Header;