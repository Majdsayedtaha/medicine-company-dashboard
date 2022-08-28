import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Users Management',
    url: 'users-management/all-users',
    iconComponent: { name: 'people-outline' },
  },
  {
    name: 'Medicines',
    url: 'medicines',
    iconComponent: { name: 'archive-outline' },
  },
  {
    name: 'Offers',
    url: 'medicines',
    iconComponent: { name: 'shopping-bag-outline' },
  },
  {
    name: 'Events',
    url: 'medicines',
    iconComponent: { name: 'calendar-outline' },
  },
  {
    name: 'Ads',
    url: 'medicines',
    iconComponent: { name: 'list-outline' },
  },
  {
    name: 'Articles',
    url: 'medicines',
    iconComponent: { name: 'file-text-outline' },
  },
  {
    name: 'Company Details',
    url: 'medicines',
    iconComponent: { name: 'credit-card-outline' },
  },
  // {
  //   name: 'Typography',
  //   url: '/theme/typography',
  //   linkProps: { fragment: 'someAnchor' },
  //   iconComponentComponent: { name: 'cil-pencil' }
  // },
];
