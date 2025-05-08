import React from 'react';

const TestHomeHeader = () => {
    return (
        <header className="relative flex flex-col items-center justify-start gap-4 pb-20 pt-16 bg-purple-900 text-white">
            <h1 className="text-4xl font-bold tracking-tight z-20">Test Creator</h1>
            <p className="text-lg text-purple-100 max-w-xl text-center z-20">
                Create, share, and discover interactive tests.
            </p>
            <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none overflow-hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 120"
                    className="w-full h-[60px] md:h-[80px]"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#ffffff"
                        fillOpacity="1"
                        d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32V120H0Z"
                    ></path>
                </svg>
            </div>
        </header>
    );
};

export default TestHomeHeader;
