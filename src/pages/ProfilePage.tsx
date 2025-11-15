import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { User, Mail, Phone, Calendar, LogOut } from 'lucide-react';

interface ProfilePageProps {
  onBookingsClick: () => void;
}

export function ProfilePage({ onBookingsClick }: ProfilePageProps) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Profile" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {currentUser.displayName || 'User'}
            </h2>
            <p className="text-green-100">{currentUser.email}</p>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Email Address</p>
                <p className="text-sm text-gray-600 mt-1">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Display Name</p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentUser.displayName || 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Account Created</p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentUser.metadata.creationTime
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Phone Number</p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentUser.phoneNumber || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-6 border-t border-gray-200 space-y-3">
            <button
              onClick={onBookingsClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">View My Bookings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Your personal information is kept secure and 
            will only be shared with vendors when you make a booking request.
          </p>
        </div>
      </div>
    </div>
  );
}
