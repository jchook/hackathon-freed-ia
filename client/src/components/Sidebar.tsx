import { BarChart3, MessageSquare, TrendingUp, Rss, Search } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Sidebar() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: BarChart3, label: "Dashboard", href: "/", active: location === "/" },
    { icon: MessageSquare, label: "Reviews", href: "/reviews", active: location === "/reviews" },
    { icon: Rss, label: "Feed", href: "/feed", active: location === "/feed" },
    { icon: Search, label: "SEO", href: "/seo", active: location === "/seo" },
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
            item.href.startsWith("/") ? (
              <Link
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
              </Link>
            ) : (
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
            )
          ))}
        </nav>
      </div>
    </aside>
  );
}
