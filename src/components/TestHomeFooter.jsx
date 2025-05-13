import React from 'react';
import { Heart } from 'lucide-react';

const TestHomeFooter = () => {
  return (
    <footer className="mt-0">
      {/* Wave Top */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="w-full h-[80px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32V120H0Z"
            fill="#101828"
          />
        </svg>
      </div>

      {/* Footer Body */}
      <div className="bg-gray-900 text-white py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="mb-2">
            <span className="font-bold text-purple-300">Test Creator</span> &copy; {new Date().getFullYear()}
          </div>
          <div className="text-gray-400 text-sm flex flex-row justify-center items-center">
            Made with
            <span className="text-pink-400 flex justify-end mx-1">
              <Heart size={11} fill="currentColor" stroke="none" />
            </span>
            for learning and sharing.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TestHomeFooter;
