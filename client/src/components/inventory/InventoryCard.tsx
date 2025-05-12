import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, UserPlus, Settings } from 'lucide-react';

interface InventoryCardProps {
  image: string;
  title: string;
  type: string;
  status: 'in_stock' | 'assigned' | 'maintenance' | 'retired';
  details: {
    label: string;
    value: string;
  }[];
  onEdit?: () => void;
  onAssign?: () => void;
  onConfigure?: () => void;
}

export function InventoryCard({
  image,
  title,
  type,
  status,
  details,
  onEdit,
  onAssign,
  onConfigure
}: InventoryCardProps) {
  const statusColorMap = {
    in_stock: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    maintenance: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    retired: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  };
  
  const statusTextMap = {
    in_stock: "In Stock",
    assigned: "Assigned",
    maintenance: "Maintenance",
    retired: "Retired"
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[status]}`}>
            {statusTextMap[status]}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm text-muted-foreground">{detail.label}:</span>
              <span className="text-sm font-medium">{detail.value}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex space-x-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onEdit}
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
          
          {onAssign && (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={onAssign}
            >
              <UserPlus className="mr-1 h-4 w-4" />
              Assign
            </Button>
          )}
          
          {onConfigure && (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={onConfigure}
            >
              <Settings className="mr-1 h-4 w-4" />
              Configure
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
