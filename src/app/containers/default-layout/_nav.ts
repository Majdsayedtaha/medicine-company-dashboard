import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Users Management',
    url: 'users-management/all-users',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Medicines',
    url: 'medicines',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Offers',
    url: 'medicines',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Events',
    url: 'medicines',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Ads',
    url: 'medicines',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Articles',
    url: 'medicines',
    iconComponent: { name: 'cil-User' },
  },
  {
    name: 'Company Details',
    url: 'medicines',
    iconComponent: { name: 'cil-User' },
  },
  // {
  //   name: 'Typography',
  //   url: '/theme/typography',
  //   linkProps: { fragment: 'someAnchor' },
  //   iconComponentComponent: { name: 'cil-pencil' }
  // },
];
