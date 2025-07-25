export type Route = {
  label: string;
  href: string;
};

export const MainRoutes: Route[] = [
  { label: "Home", href: "/" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
];
