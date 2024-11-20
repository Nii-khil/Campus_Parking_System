import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const LoginPage = ({ setIsAuthenticated }) => {
  const [userID, setUserIDState] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUserID: setUserIDContext } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, password })
      });

      const data = await response.json();

      if (response.status === 200) {
        setUserIDContext(data.user.id);
        setMessage('Login successful!');
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);

        if (data.user.role === 'admin') {
          navigate('/adminDashboard');
        } else {
          navigate('/');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="userID">
              User ID
            </label>
            <input
              type="text"
              id="userID"
              className="w-full px-3 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your user ID"
              value={userID}
              onChange={(e) => setUserIDState(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <p className="text-center text-gray-400 text-sm mt-4">
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
