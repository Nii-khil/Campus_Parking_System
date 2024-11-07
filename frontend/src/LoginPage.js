//import React, { useState } from "react";
//import { Link, useNavigate } from "react-router-dom";
//import { useUser } from "./UserContext";
//
//const LoginPage = ({ setIsAuthenticated }) => {
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const [message, setMessage] = useState('');
//  const navigate = useNavigate();
//  const { setUserID, userID } = useUser(); // Also get userID to verify it's being set
//
//  // Log initial state
//  console.log('LoginPage rendered, current userID:', userID);
//
//  const handleLogin = async (e) => {
//    e.preventDefault();
//    console.log('Login attempt with email:', email);
//
//    try {
//      const response = await fetch('http://localhost:3001/login', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({ email, password })
//      });
//
//      const data = await response.json();
//      console.log('Server response:', data);
//
//      if (response.status === 200) {
//        // Log the user data received
//        console.log('Login successful, user data:', data.user);
//
//        // Set the userID in context
//        setUserID(data.user.id);
//
//        // Verify context update
//        console.log('UserID set in context:', data.user.id);
//
//        setMessage('Login successful!');
//        localStorage.setItem('isAuthenticated', 'true');
//        setIsAuthenticated(true);
//
//        // Log navigation
//        console.log('User role:', data.user.role);
//        if (data.user.role === 'admin') {
//          console.log('Navigating to admin dashboard');
//          navigate('/adminDashboard');
//        } else {
//          console.log('Navigating to home page');
//          navigate('/');
//        }
//      } else {
//        console.log('Login failed:', data.message);
//        setMessage(data.message);
//      }
//    } catch (error) {
//      console.error('Login error:', error);
//      setMessage('An error occurred.');
//    }
//  };
//
//  return (
//    <div className="flex justify-center items-center min-h-screen bg-gray-100">
//      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
//        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
//        <form onSubmit={handleLogin}>
//          <div className="mb-4">
//            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//              Email Address
//            </label>
//            <input
//              type="email"
//              id="email"
//              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//              placeholder="Enter your email"
//              value={email}
//              onChange={(e) => setEmail(e.target.value)}
//            />
//          </div>
//          <div className="mb-6">
//            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//              Password
//            </label>
//            <input
//              type="password"
//              id="password"
//              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//              placeholder="Enter your password"
//              value={password}
//              onChange={(e) => setPassword(e.target.value)}
//            />
//          </div>
//          <div className="flex items-center justify-between">
//            <button
//              type="submit"
//              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
//            >
//              Login
//            </button>
//          </div>
//          <p className="text-center text-gray-500 text-sm mt-4">
//            Don't have an account?{" "}
//            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
//              Sign Up
//            </Link>
//          </p>
//          <p className="text-center text-red-500 text-sm mt-4">{message}</p>
//        </form>
//      </div>
//    </div>
//  );
//};
//
//export default LoginPage;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const LoginPage = ({ setIsAuthenticated }) => {
  const [userID, setUserIDState] = useState(''); // Change from email to userID
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUserID: setUserIDContext } = useUser(); // Update context setter

  // Log initial state
  console.log('LoginPage rendered, current userID:', userID);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt with userID:', userID);

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, password }) // Send userID instead of email
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.status === 200) {
        // Log the user data received
        console.log('Login successful, user data:', data.user);

        // Set the userID in context
        setUserIDContext(data.user.id);

        // Verify context update
        console.log('UserID set in context:', data.user.id);

        setMessage('Login successful!');
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);

        // Log navigation
        console.log('User role:', data.user.role);
        if (data.user.role === 'admin') {
          console.log('Navigating to admin dashboard');
          navigate('/adminDashboard');
        } else {
          console.log('Navigating to home page');
          navigate('/');
        }
      } else {
        console.log('Login failed:', data.message);
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userID">
              User ID
            </label>
            <input
              type="text"
              id="userID"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your user ID"
              value={userID}
              onChange={(e) => setUserIDState(e.target.value)} // Update state for user ID
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Sign Up
            </Link>
          </p>
          <p className="text-center text-red-500 text-sm mt-4">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
