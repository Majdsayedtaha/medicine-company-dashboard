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
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    name: 'Pages',
    title: true,
  },
  {
    name: 'users-management',
    url: '/users-management',
    iconComponent: { name: 'cilUser' },
  },
  {
    name: 'ads',
    url: '/ads',
    iconComponent: { name: 'cilSun' },
  },
  {
    name: 'medicines',
    url: '/medicines',
    iconComponent: { name: 'cilBookmark' },
  },
  {
    name: 'offers',
    url: '/offers',
    iconComponent: { name: 'cilStar' },
  },
  {
    name: 'events',
    url: '/events',
    iconComponent: { name: 'cilMediaPlay' },
  },
  {
    name: 'articles',
    url: '/articles',

    iconComponent: { name: 'cilFile' },
  },
  {
    name: 'company-details',
    url: '/company-details',
    iconComponent: { name: 'cilAlignCenter' },
  },

  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Auth',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
      },
      {
        name: 'Register',
        url: '/register',
      },
      {
        name: 'Error 404',
        url: '/404',
      },
    ],
  },
];
