import React from 'react';
import * as routesUrl from './routesUrl';

const Tables = React.lazy(() => import('./components/tables/Tables'));
const Buttons = React.lazy(() => import('./components/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./components/charts/Charts'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const ListUsers = React.lazy(() => import('./components/users/ListUsers'));
const UserUpdate = React.lazy(() => import('./components/users/UserUpdate'));
const NewUser = React.lazy(() => import('./components/users/NewUser'));
const NewRestaurants = React.lazy(() => import('./components/sellers/restaurants/NewRestaurants'));
const EditRestaurants = React.lazy(() => import('./components/sellers/restaurants/EditRestaurants'));
const NewMarketer = React.lazy(() => import('./components/sellers/marketers/NewMarketer'));
const EditMarketer = React.lazy(() => import('./components/sellers/marketers/EditMarketer'));
const ListMarketer = React.lazy(()=>  import('./components/sellers/marketers/ListMarketers'));
const ListRestaurant = React.lazy(()=>  import('./components/sellers/restaurants/ListRestaurants'))
const routes = [
  { path: routesUrl.HOME, exact: true, name: 'Home' },
  { path: routesUrl.DASHBOARD, name: 'Dashboard', component: Dashboard },
  { path: routesUrl.TABLES, name: 'Tables', component: Tables },
  { path: routesUrl.BUTTONS, name: 'Buttons', component: Buttons, exact: true },
  { path: routesUrl.BUTTONS_CHILD, name: 'Buttons', component: Buttons },
  { path: routesUrl.CHARTS, name: 'Charts', component: Charts },
  { path: routesUrl.LIST_USERS, exact: true,  name: 'Users', component: ListUsers },
  { path: routesUrl.USER_ADD, exact: true, name: 'User', component: NewUser },
  { path: routesUrl.USER_UPDATE, exact: true, name: '', component: UserUpdate },
  { path: routesUrl.NEW_RESTAURANTS, exact: true, name: 'Restaurants', component: NewRestaurants },
  { path: routesUrl.EDIT_RESTAURANTS, exact: true, name: '', component: EditRestaurants },
  { path: routesUrl.NEW_MARKETER, exact: true, name: 'Marketer', component: NewMarketer },
  { path: routesUrl.EDIT_MARKETER, exact: true, name: 'Edit Marketer', component: EditMarketer },
  { path: routesUrl.LIST_MARKETER, exact: true, name: 'List Marketers', component: ListMarketer },
  { path: routesUrl.LIST_RESTAURANT, exact: true, name: 'List Restaurants', component: ListRestaurant }
];

export default routes;
