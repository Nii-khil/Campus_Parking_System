import React, { createContext, useContext, useState } from "react";

// Create the context
const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);
  window.setUserID = setUserID;  // This exposes the setUserID function to the global window object
  window.userID = userID;  // This exposes the current userID to the global window object

  return (
    <UserContext.Provider value={{ userID, setUserID }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing user data
export const useUser = () => useContext(UserContext);
