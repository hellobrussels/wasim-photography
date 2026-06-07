import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main style={{ minHeight: '100vh' }}>
                <Outlet />
            </main>
            <Footer />
            <style>{`
            .app-layout {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }
        `}</style>
        </div>
    );
};

export default Layout;
