/**
 * Centralized routes configuration for the application
 * This ensures consistent paths for navigation throughout the app
 */

// Tab values used in the navigation
export const TAB_VALUES = {
  OVERVIEW: 'overview',
  MY_DOGS: 'mydogs',
  EVENTS: 'events',
  SETTINGS: 'settings'
};

// Route paths that map to URL paths
export const ROUTES = {
  // Auth routes
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  
  // Main app routes
  OVERVIEW: '/',
  MY_DOGS: '/dogs',
  DOG_PROFILE: (id: string) => `/dogs/${id}`,
  EVENTS: '/events',
  EVENT_DETAILS: (id: string) => `/events/${id}`,
  SETTINGS: '/settings',
  
  // Tab-specific sub-routes
  EVENTS_MY: '/events/my',
  EVENTS_NEARBY: '/events/nearby',
  
  // Settings sub-routes
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PRIVACY: '/settings/privacy'
};

/**
 * Converts a tab value to its corresponding route path
 * @param tabValue The tab value from the UI
 * @returns The corresponding route path
 */
export const getRouteFromTab = (tabValue: string): string => {
  switch (tabValue) {
    case TAB_VALUES.OVERVIEW:
      return ROUTES.OVERVIEW;
    case TAB_VALUES.MY_DOGS:
      return ROUTES.MY_DOGS;
    case TAB_VALUES.EVENTS:
      return ROUTES.EVENTS;
    case TAB_VALUES.SETTINGS:
      return ROUTES.SETTINGS;
    default:
      return ROUTES.OVERVIEW;
  }
};

/**
 * Converts a route path to its corresponding tab value
 * @param route The current route path
 * @returns The corresponding tab value for the UI
 */
export const getTabFromRoute = (route: string): string => {
  if (route === ROUTES.OVERVIEW || route === '/') {
    return TAB_VALUES.OVERVIEW;
  }
  
  if (route.startsWith('/dogs')) {
    return TAB_VALUES.MY_DOGS;
  }
  
  if (route.startsWith('/events')) {
    return TAB_VALUES.EVENTS;
  }
  
  if (route.startsWith('/settings')) {
    return TAB_VALUES.SETTINGS;
  }
  
  return TAB_VALUES.OVERVIEW;
}; 