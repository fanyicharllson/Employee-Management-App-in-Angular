export interface NavitemTypes {
  id: string;
  text: string;
  page?: boolean;
}

export const NavItem: NavitemTypes[] = [
  { text: 'Features', id: 'features' },
  { text: 'Pricing', id: 'pricing' },
  { text: 'About', id: '/about', page: true },
  { text: 'Login', id: '/login', page: true },
];

export const ProfileRoutes = [
  { text: 'Profile', route: 'profile' },
  { text: 'Settings', route: 'setting' },
  { text: 'Help', route: 'help' },
  { text: 'Sign Out', route: 'signout', btn: true },
];
