export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SURVEY: '/survey',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
