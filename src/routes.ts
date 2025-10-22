import React from 'react';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactsPage } from './pages/ContactsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ManageProductsPage } from './pages/admin/ManageProductsPage';
import { ProductFormPage } from './pages/admin/ProductFormPage';
import { ManageAuthorsPage } from './pages/admin/ManageAuthorsPage';
import { AuthorFormPage } from './pages/admin/AuthorFormPage';
import { ManageReviewsPage } from './pages/admin/ManageReviewsPage';

interface RouteConfig {
    path: string;
    Component: React.ComponentType;
    nodeRef: React.RefObject<HTMLDivElement>;
    isProtected?: boolean;
    isAdmin?: boolean;
}

const allRoutes: RouteConfig[] = [
    { path: '/', Component: HomePage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'collections', Component: CollectionsPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'authors', Component: AuthorsPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'authors/:id', Component: AuthorDetailPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'products/:id', Component: ProductDetailPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'about', Component: AboutPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'contacts', Component: ContactsPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'checkout', Component: CheckoutPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true },
    { path: 'order-success', Component: OrderSuccessPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'search', Component: SearchPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'wishlist', Component: WishlistPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'login', Component: LoginPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'signup', Component: SignupPage, nodeRef: React.createRef<HTMLDivElement>() },
    { path: 'profile', Component: ProfilePage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true },
    
    // Admin Routes
    { path: 'admin/dashboard', Component: AdminDashboardPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/products', Component: ManageProductsPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/products/new', Component: ProductFormPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/products/edit/:id', Component: ProductFormPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/authors', Component: ManageAuthorsPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/authors/new', Component: AuthorFormPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/authors/edit/:id', Component: AuthorFormPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
    { path: 'admin/reviews', Component: ManageReviewsPage, nodeRef: React.createRef<HTMLDivElement>(), isProtected: true, isAdmin: true },
];

export const publicRoutes: RouteConfig[] = allRoutes.filter(r => !r.path.startsWith('admin'));

export const adminRoutes: Omit<RouteConfig, 'isAdmin'>[] = allRoutes
    .filter(r => r.path.startsWith('admin'))
    .map(({ path, ...rest }) => ({
        ...rest,
        path: path.replace('admin/', ''),
    }));