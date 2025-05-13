import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface InventoryCardProps {
  title: string;
  value: number;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "warning";
}

export function InventoryCard({ title, value, change, isPositive, icon, color }: InventoryCardProps) {
  const borderColorClass = {
    primary: "border-primary",
    secondary: "border-secondary",
    success: "border-green-500",
    warning: "border-amber-500",
  }[color];

  const bgColorClass = {
    primary: "bg-primary bg-opacity-20",
    secondary: "bg-secondary bg-opacity-20",
    success: "bg-green-500 bg-opacity-20",
    warning: "bg-amber-500 bg-opacity-20",
  }[color];

  const textColorClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-green-500",
    warning: "text-amber-500",
  }[color];

  const changeTextColorClass = isPositive ? "text-green-500" : "text-red-500";

  return (
    <Card className={cn("p-4 border-l-4", borderColorClass)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
          {change > 0 ? (
            <p className={cn("text-xs flex items-center mt-1", changeTextColorClass)}>
              {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              <span>{change}% from last month</span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <span>No change</span>
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-full", bgColorClass)}>
          <div className={textColorClass}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}
