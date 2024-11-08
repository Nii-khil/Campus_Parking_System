import React from 'react';

function WelcomePage() {
  return (
    <div>
      {/* Navbar */}
      <header className="bg-white shadow-lg">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between">
          <h1 className="text-3xl font-bold text-indigo-600">PEScape</h1>
          <div className="flex space-x-4">
            <a href="/login" className="text-indigo-600 hover:text-indigo-800">Login</a>
            <a href="/signup" className="text-green-600 hover:text-green-800">Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-indigo-600 text-white text-center py-20">
        <h2 className="text-5xl font-bold mb-4">Welcome to YourSite</h2>
        <p className="text-lg mb-6">Explore our platform and join a community of passionate individuals.</p>
        <a href="/signup" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200">
          Get Started
        </a>
      </section>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h3 className="text-3xl font-semibold text-center mb-8">About Us</h3>
        <p className="text-lg text-gray-600 text-center">
          Our mission is to connect people through shared experiences and enable them to achieve their goals.
          Join us and be part of a thriving community.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-semibold text-center mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-xl font-semibold mb-4">Feature One</h4>
              <p className="text-gray-600">Explore new connections and opportunities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-xl font-semibold mb-4">Feature Two</h4>
              <p className="text-gray-600">Customize your profile and showcase your skills.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-xl font-semibold mb-4">Feature Three</h4>
              <p className="text-gray-600">Access exclusive content and resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left">© 2024 YourSite. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/about" className="hover:underline">About Us</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
