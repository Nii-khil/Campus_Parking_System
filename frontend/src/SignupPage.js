import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [ID, setID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID,
          email,
          password,
          userType,
          firstName,
          lastName,
          ...(userType === "student" && { semester, section, department }),
          ...(userType === "staff" && { department }),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage("Signup successful!");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-xl bg-gray-900 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="ID">
                ID
              </label>
              <input
                type="text"
                id="ID"
                className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your ID"
                value={ID}
                onChange={(e) => setID(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="userType">
              User Type
            </label>
            <select
              id="userType"
              className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {userType === "student" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="semester">
                  Semester
                </label>
                <input
                  type="text"
                  id="semester"
                  className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="section">
                  Section
                </label>
                <input
                  type="text"
                  id="section"
                  className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>
            </div>
          )}

          {(userType === "student" || userType === "staff") && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-1" htmlFor="department">
                Department
              </label>
              <input
                type="text"
                id="department"
                className="w-full px-3 py-2 text-sm border rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          )}

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Login
            </Link>
          </p>
          <p className="text-center text-red-500 text-sm mt-4">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

