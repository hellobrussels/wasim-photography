import React from 'react';
import Hero from '../components/Hero';
import QuickIntro from '../components/QuickIntro';

const Home = () => {
    return (
        <>
            <Hero />
            <QuickIntro />
            <div className="container section-padding">
                {/* Other sections will go here */}
            </div>
        </>
    );
};

export default Home;
