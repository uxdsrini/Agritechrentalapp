import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  onClick: () => void;
}

export function CategoryCard({ name, icon: Icon, count, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group hover:-translate-y-1"
    >
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
          <Icon className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
      <p className="text-sm text-gray-500">{count} available</p>
    </button>
  );
}
