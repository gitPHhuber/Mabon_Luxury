import React from 'react';
import { useLocation, useOutlet, matchPath } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ChatWidget } from '../ui/ChatWidget';
import { publicRoutes } from '../../routes';

export const MainLayout = () => {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const { nodeRef } = publicRoutes.find(route => {
        const pattern = route.path === '/' ? '/' : `/${route.path}`;
        return matchPath(pattern, location.pathname);
    }) ?? {};
    
    return (
        <>
            <Header />
            <main>
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={location.pathname}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="page-transition"
                        unmountOnExit
                    >
                        {(state) => (
                            <div ref={nodeRef} className="page-transition-wrapper">
                                {currentOutlet}
                            </div>
                        )}
                    </CSSTransition>
                </TransitionGroup>
            </main>
            <Footer />
            <CartDrawer />
            <ChatWidget />
        </>
    );
};
