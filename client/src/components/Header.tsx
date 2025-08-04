import { Clock } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3" data-testid="header">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2 text-sm text-gray-500" data-testid="last-updated">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>
    </header>
  );
}
