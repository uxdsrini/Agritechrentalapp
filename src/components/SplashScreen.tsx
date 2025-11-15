import { Sprout } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Sprout className="h-20 w-20 text-green-600 animate-bounce" />
            <div className="absolute inset-0 h-20 w-20 bg-green-400 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 justify-center">
          <Sprout className="h-8 w-8 text-green-600" />
          AgriRent
        </h1>
        <p className="text-gray-600 text-lg mb-8">Agricultural Equipment Rental</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    </div>
  );
}
