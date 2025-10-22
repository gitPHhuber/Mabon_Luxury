import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { ReviewProvider } from './context/ReviewContext';
import { DataProvider } from './context/DataContext';
import { ChatProvider } from './context/ChatContext';
import { ScrollToTop } from './utils/ScrollToTop';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { publicRoutes, adminRoutes } from './routes';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => (
    <HashRouter>
        <AuthProvider>
            <CookieConsentProvider>
                <DataProvider>
                    <WishlistProvider>
                        <CartProvider>
                            <NotificationProvider>
                                <QuickViewProvider>
                                    <ReviewProvider>
                                        <ChatProvider>
                                            <ScrollToTop />
                                            <Routes>
                                                {/* Admin Routes */}
                                                <Route path="/admin" element={
                                                    <ProtectedRoute adminOnly={true}>
                                                        <AdminLayout />
                                                    </ProtectedRoute>
                                                }>
                                                    <Route index element={<Navigate to="dashboard" replace />} />
                                                    {adminRoutes.map(({ path, Component }) => (
                                                        <Route key={path} path={path} element={<Component />} />
                                                    ))}
                                                </Route>

                                                {/* Public Routes */}
                                                <Route path="/*" element={<MainLayout />}>
                                                    {publicRoutes.map(({ path, Component, isProtected }) => (
                                                        <Route
                                                            key={path}
                                                            index={path === '/'}
                                                            path={path === '/' ? undefined : path}
                                                            element={
                                                                isProtected ? (
                                                                    <ProtectedRoute>
                                                                        <Component />
                                                                    </ProtectedRoute>
                                                                ) : (
                                                                    <Component />
                                                                )
                                                            }
                                                        />
                                                    ))}
                                                </Route>
                                            </Routes>
                                        </ChatProvider>
                                    </ReviewProvider>
                                </QuickViewProvider>
                            </NotificationProvider>
                        </CartProvider>
                    </WishlistProvider>
                </DataProvider>
            </CookieConsentProvider>
        </AuthProvider>
    </HashRouter>
);

export default App;