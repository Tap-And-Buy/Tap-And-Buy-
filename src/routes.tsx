import type { ReactNode } from 'react';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailConfirmation from './pages/EmailConfirmation';
import AdminLogin from './pages/admin/AdminLogin';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Account from './pages/Account';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';
import Support from './pages/Support';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminReturns from './pages/admin/Returns';
import AdminPromotions from './pages/admin/Promotions';
import NotFound from './pages/NotFound';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Welcome',
    path: '/welcome',
    element: <Welcome />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
    visible: false,
  },
  {
    name: 'Email Confirmation',
    path: '/email-confirmation',
    element: <EmailConfirmation />,
    visible: false,
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLogin />,
    visible: false,
  },
  {
    name: 'Home',
    path: '/',
    element: <Home />,
  },
  {
    name: 'Categories',
    path: '/categories',
    element: <Categories />,
    visible: false,
  },
  {
    name: 'Category Products',
    path: '/category-products',
    element: <CategoryProducts />,
    visible: false,
  },
  {
    name: 'Product Detail',
    path: '/product/:id',
    element: <ProductDetail />,
    visible: false,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <Cart />,
    visible: false,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <Checkout />,
    visible: false,
  },
  {
    name: 'Payment',
    path: '/payment',
    element: <Payment />,
    visible: false,
  },
  {
    name: 'Account',
    path: '/account',
    element: <Account />,
    visible: false,
  },
  {
    name: 'Orders',
    path: '/orders',
    element: <Orders />,
    visible: false,
  },
  {
    name: 'Order Detail',
    path: '/order/:id',
    element: <OrderDetail />,
    visible: false,
  },
  {
    name: 'Addresses',
    path: '/addresses',
    element: <Addresses />,
    visible: false,
  },
  {
    name: 'Wishlist',
    path: '/wishlist',
    element: <Wishlist />,
    visible: false,
  },
  {
    name: 'Support',
    path: '/support',
    element: <Support />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    visible: false,
  },
  {
    name: 'Admin Products',
    path: '/admin/products',
    element: <AdminProducts />,
    visible: false,
  },
  {
    name: 'Admin Categories',
    path: '/admin/categories',
    element: <AdminCategories />,
    visible: false,
  },
  {
    name: 'Admin Orders',
    path: '/admin/orders',
    element: <AdminOrders />,
    visible: false,
  },
  {
    name: 'Admin Returns',
    path: '/admin/returns',
    element: <AdminReturns />,
    visible: false,
  },
  {
    name: 'Admin Promotions',
    path: '/admin/promotions',
    element: <AdminPromotions />,
    visible: false,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
    visible: false,
  },
];

export default routes;