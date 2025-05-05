import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { BookOpen, CheckCircle, FileQuestion, PlusCircle, User } from 'lucide-react';

// Particle Background Component
const ParticleBg = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-[#282C35] opacity-90"></div>
      {Array.from({ length: 40 }).map((_, i) => {
        const size = Math.floor(Math.random() * 4) + 1;
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 30 + 10}s`;
        
        return (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-60"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top,
              left,
              animation: `float ${animationDuration} infinite ease-in-out`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, 20px); }
          50% { transform: translate(-20px, 40px); }
          75% { transform: translate(-40px, -20px); }
        }
      `}</style>
    </div>
  );
};

// Feature Item Component
const FeatureItem = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="bg-indigo-100 p-4 rounded-full mb-4">
        <Icon size={24} className="text-indigo-600" />
      </div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Main Home Component
const Home = () => {
  const features = [
    {
      icon: FileQuestion,
      title: "Create Custom Tests",
      description: "Design personalized tests with various question types to suit your specific needs."
    },
    {
      icon: CheckCircle,
      title: "Instant Grading",
      description: "Get immediate feedback and results as soon as tests are completed."
    },
    {
      icon: User,
      title: "User Profiles",
      description: "Track progress and performance history with detailed user profiles."
    },
    {
      icon: BookOpen,
      title: "Collaboration Tools",
      description: "Share tests with team members and collaborate on test creation and review."
    }
  ];

  return (
    <main className="font-sans">
      {/* Hero Section */}
      <header className="bg-indigo-900 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
        <ParticleBg />
        <div className="container mx-auto px-4 py-24 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Test Creator</h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto mb-10">
                Create, share, and complete interactive tests with ease. Perfect for educators, trainers, and learners.
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center" to="/register">
              Create Test <PlusCircle className="ml-2" size={18} />
            </Link>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Join thousands of educators and learners already using our platform.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
              <Link className="bg-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors" to="/auth">
                Log In
              </Link>
              <Link className="bg-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors" to="/register">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Test Creator.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;