import { Outlet } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Date Header */}
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-wahdat-green" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;