import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  CalendarDays,
  ClipboardList,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import clinicLogo from '@/assets/clinic-logo.png';

interface SidebarProps {
  user?: {
    name: string;
    role: string;
  };
}

const Sidebar = ({ user = { name: "Dr. Johnson", role: "Administrator" } }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Patient Records', href: '/records', icon: FileText },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Treatment Plans', href: '/treatments', icon: ClipboardList },
  ];

  return (
    <div className={`
      ${isCollapsed ? 'w-20' : 'w-72'} 
      bg-gradient-to-b from-medical-primary to-medical-primary/90 
      text-white transition-all duration-300 ease-in-out
      flex flex-col min-h-screen
    `}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img src={clinicLogo} alt="Clinic Logo" className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="text-lg font-bold">DentalCare</h1>
                <p className="text-xs text-white/80">Management System</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Welcome, {user.name}</p>
              <p className="text-sm text-white/80">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center w-full px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors duration-200">
          <LogOut className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;