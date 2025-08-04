import { Building, TrendingUp, BarChart3, Bell, Download, Settings, User } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "#", active: true },
    { icon: Building, label: "Pricing Analysis", href: "#" },
    { icon: TrendingUp, label: "Trends", href: "#" },
    { icon: Bell, label: "Alerts", href: "#" },
    { icon: Download, label: "Reports", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg text-white flex-shrink-0" data-testid="sidebar">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8" data-testid="sidebar-logo">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">PriceTracker</h1>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-primary/20 text-blue-300' 
                  : 'hover:bg-gray-700'
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div className="flex items-center space-x-3" data-testid="sidebar-user">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-gray-400">Business Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
