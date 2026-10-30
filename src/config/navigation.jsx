
import {
  House,
  Clapperboard,
  Search,
  PlusSquare,
  UserRound,
  Bookmark,
  Bell,
  ShoppingBag,
  ShoppingCart,
  Package,
  LayoutDashboard,
  Users,
  FileText,
  MessageCircle,
  Tags,
  MessageSquare,
} from "lucide-react";

export const userNavigation = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/reels", label: "Reels", icon: Clapperboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/create-post", label: "Create", icon: PlusSquare },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export const userSidebarNavigation = [
  ...userNavigation,
  { to: "/saved-posts", label: "Saved Posts", icon: Bookmark },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/my-orders", label: "My Orders", icon: Package },
];

export const adminNavigation = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/reels", label: "Reels", icon: Clapperboard },
  { to: "/admin/comments", label: "Post Comments", icon: MessageCircle },
  { to: "/admin/reel-comments", label: "Reel Comments", icon: MessageSquare },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: Package },
];
