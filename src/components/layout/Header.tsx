import { FC } from 'react';

const Header: FC = () => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-card z-50 p-4 border-b backdrop-blur-lg bg-background/80">
      <h1 className="text-xl font-semibold text-center">Dog Activity Tracker</h1>
    </div>
  );
};

export default Header;