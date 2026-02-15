import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, Crown, MessageSquare, RefreshCw,
} from "lucide-react";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/products", icon: Package, label: "Products" },
  { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { path: "/admin/customers", icon: Users, label: "Customers" },
  { path: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { path: "/admin/subscriptions", icon: RefreshCw, label: "Subscriptions" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 glass-card border-r border-border/30 transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border/30 flex items-center gap-2">
        <Crown className="w-6 h-6 text-primary flex-shrink-0" />
        {!collapsed && (
          <span className="font-heading text-sm font-bold gold-gradient-text tracking-widest truncate">
            MEDIEVAL ADMIN
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                active
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-border/30 space-y-1">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground/40 hover:text-foreground transition-all w-full"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
