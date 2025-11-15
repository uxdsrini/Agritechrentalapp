import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { VendorsPage } from './pages/VendorsPage';
import { VendorDetailPage } from './pages/VendorDetailPage';
import { EquipmentListPage } from './pages/EquipmentListPage';
import { EquipmentDetailPage } from './pages/EquipmentDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { BottomNav } from './components/BottomNav';

type View =
  | { type: 'home' }
  | { type: 'vendors' }
  | { type: 'vendor-detail'; vendorId: string }
  | { type: 'equipment-list'; category?: string }
  | { type: 'equipment-detail'; equipmentId: string }
  | { type: 'bookings' }
  | { type: 'profile' };

function AppContent() {
  const [view, setView] = useState<View>({ type: 'home' });
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const { currentUser, loading } = useAuth();

  const navigateHome = () => setView({ type: 'home' });
  const navigateVendors = () => setView({ type: 'vendors' });
  const navigateVendorDetail = (vendorId: string) => setView({ type: 'vendor-detail', vendorId });
  const navigateEquipmentList = (category?: string) => setView({ type: 'equipment-list', category });
  const navigateEquipmentDetail = (equipmentId: string) => setView({ type: 'equipment-detail', equipmentId });
  const navigateBookings = () => setView({ type: 'bookings' });
  const navigateProfile = () => setView({ type: 'profile' });

  const getCurrentNavView = () => {
    if (view.type === 'home') return 'home';
    if (view.type === 'equipment-list' || view.type === 'equipment-detail') return 'equipment';
    if (view.type === 'bookings') return 'bookings';
    if (view.type === 'profile') return 'profile';
    return 'home';
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    if (authView === 'login') {
      return <LoginPage onSwitchToSignup={() => setAuthView('signup')} />;
    }
    return <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
  }

  if (view.type === 'home') {
    return (
      <>
        <HomePage
          onCategoryClick={navigateEquipmentList}
          onEquipmentClick={navigateEquipmentDetail}
          onViewAllEquipment={() => navigateEquipmentList()}
          onViewAllVendors={navigateVendors}
        />
        <BottomNav
          currentView={getCurrentNavView()}
          onNavigateHome={navigateHome}
          onNavigateEquipment={() => navigateEquipmentList()}
          onNavigateBookings={navigateBookings}
          onNavigateProfile={navigateProfile}
        />
      </>
    );
  }

  if (view.type === 'vendors') {
    return (
      <VendorsPage
        onBack={navigateHome}
        onVendorClick={navigateVendorDetail}
      />
    );
  }

  if (view.type === 'vendor-detail') {
    return (
      <VendorDetailPage
        vendorId={view.vendorId}
        onBack={navigateVendors}
        onEquipmentClick={navigateEquipmentDetail}
      />
    );
  }

  if (view.type === 'equipment-list') {
    return (
      <>
        <EquipmentListPage
          onBack={navigateHome}
          onEquipmentClick={navigateEquipmentDetail}
          category={view.category}
        />
        <BottomNav
          currentView={getCurrentNavView()}
          onNavigateHome={navigateHome}
          onNavigateEquipment={() => navigateEquipmentList()}
          onNavigateBookings={navigateBookings}
          onNavigateProfile={navigateProfile}
        />
      </>
    );
  }

  if (view.type === 'equipment-detail') {
    return (
      <>
        <EquipmentDetailPage
          equipmentId={view.equipmentId}
          onBack={() => setView({ type: 'equipment-list' })}
          onVendorClick={navigateVendorDetail}
        />
        <BottomNav
          currentView={getCurrentNavView()}
          onNavigateHome={navigateHome}
          onNavigateEquipment={() => navigateEquipmentList()}
          onNavigateBookings={navigateBookings}
          onNavigateProfile={navigateProfile}
        />
      </>
    );
  }

  if (view.type === 'bookings') {
    return (
      <>
        <BookingsPage
          onBack={navigateHome}
        />
        <BottomNav
          currentView={getCurrentNavView()}
          onNavigateHome={navigateHome}
          onNavigateEquipment={() => navigateEquipmentList()}
          onNavigateBookings={navigateBookings}
          onNavigateProfile={navigateProfile}
        />
      </>
    );
  }

  if (view.type === 'profile') {
    return (
      <>
        <ProfilePage
          onBookingsClick={navigateBookings}
        />
        <BottomNav
          currentView={getCurrentNavView()}
          onNavigateHome={navigateHome}
          onNavigateEquipment={() => navigateEquipmentList()}
          onNavigateBookings={navigateBookings}
          onNavigateProfile={navigateProfile}
        />
      </>
    );
  }

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
