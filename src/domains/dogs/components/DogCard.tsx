/**
 * DogCard Component
 * Displays a dog profile in a card format
 */

import { DogProfile } from '../types';

// Interface for component props
interface DogCardProps {
  dog: DogProfile;
  onEdit?: (dog: DogProfile) => void;
  onDelete?: (id: string) => void;
  onClick?: (dog: DogProfile) => void;
}

/**
 * DogCard displays a dog profile in a card format
 */
export const DogCard = ({ dog, onEdit, onDelete, onClick }: DogCardProps) => {
  // Handler for edit button
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(dog);
    }
  };

  // Handler for delete button
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm(`Are you sure you want to delete ${dog.name}?`)) {
        onDelete(dog.id);
      }
    }
  };

  // Handler for card click
  const handleClick = () => {
    if (onClick) {
      onClick(dog);
    }
  };

  return (
    <div 
      className="bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-center p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
          <img 
            src={dog.avatar || dog.profileImage || "https://via.placeholder.com/100"} 
            alt={dog.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{dog.name}</h3>
          <p className="text-sm text-gray-500 truncate">{dog.breed} • {dog.age} years</p>
          <div className="flex items-center mt-1 space-x-2">
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {dog.energyLevel}
            </span>
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
              {dog.size}
            </span>
          </div>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex space-x-2 ml-2">
            {onEdit && (
              <button 
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Edit dog"
              >
                Edit
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete dog"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      
      {dog.description && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-700 line-clamp-2">{dog.description}</p>
        </div>
      )}
      
      {dog.stats && (
        <div className="border-t px-4 py-3 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div>
            <span className="font-medium">{dog.stats.totalActivities || 0}</span> activities
          </div>
          <div>
            <span className="font-medium">{dog.stats.totalDistance?.toFixed(1) || 0}</span> km
          </div>
          <div>
            <span className="font-medium">{dog.stats.streak || 0}</span> day streak
          </div>
        </div>
      )}
    </div>
  );
};

export default DogCard; 