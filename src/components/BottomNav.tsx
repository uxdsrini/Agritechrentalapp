import { Home, Package, Calendar, User } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigateHome: () => void;
  onNavigateEquipment: () => void;
  onNavigateBookings: () => void;
  onNavigateProfile: () => void;
}

export function BottomNav({
  currentView,
  onNavigateHome,
  onNavigateEquipment,
  onNavigateBookings,
  onNavigateProfile,
}: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, onClick: onNavigateHome },
    { id: 'equipment', label: 'Equipment', icon: Package, onClick: onNavigateEquipment },
    { id: 'bookings', label: 'Bookings', icon: Calendar, onClick: onNavigateBookings },
    { id: 'profile', label: 'Profile', icon: User, onClick: onNavigateProfile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                  isActive
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
