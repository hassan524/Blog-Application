import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [IsLogOpen, setIsLogOpen] = useState(false);
  const [IsSignOpen, SetIsSignOpen] = useState(false)
  const [IsSideBarOpen, SetIsSideBarOpen] = useState(false)

  

  return (
    <AuthContext.Provider value={
      {
        IsLogOpen,
        setIsLogOpen,
        IsSignOpen,
        SetIsSignOpen,
        IsSideBarOpen,
        SetIsSideBarOpen,
      }
    }>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
