import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CalendarDays,
  ClipboardList,
  UserCheck,
  LogOut,
  Check,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { profile, signOut, isAdmin } = useAuth();
  const { toast } = useToast();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Doctors', href: '/doctors', icon: UserCheck },
    { name: 'Treatment Plans', href: '/treatments', icon: ClipboardList },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  ];

  return (
    <div className={`
      ${isCollapsed ? 'w-20' : 'w-80'} 
      bg-wahdat-green
      text-white transition-all duration-300 ease-in-out
      flex flex-col min-h-screen shadow-lg
    `}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-wahdat-green" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Wahdat Dental</h1>
                <p className="text-sm text-white/90">Clinic Center</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-4 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/20 text-white font-medium border-l-4 border-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-4'}`} />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      {!isCollapsed && profile && (
        <div className="px-4 py-2 border-t border-white/20">
          <div className="flex items-center space-x-2 text-sm text-white/90">
            <User className="h-4 w-4" />
            <div>
              <p className="font-medium text-white">{profile.name}</p>
              <p className="text-xs text-white/70 capitalize">{profile.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4">
        <button 
          className="flex items-center w-full px-4 py-4 text-white/90 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 group"
          onClick={async () => {
            await signOut();
            toast({
              title: "Signed out successfully",
              description: "You have been logged out.",
            });
          }}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-4'}`} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;