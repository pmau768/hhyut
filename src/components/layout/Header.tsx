import { FC } from 'react';

const Header: FC = () => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-card z-50 px-4 py-3 border-b backdrop-blur-lg bg-background/80 shadow-sm">
      <h1 className="text-lg font-semibold text-center">Dog Activity Tracker</h1>
    </div>
  );
};

export default Header;