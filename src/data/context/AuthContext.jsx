import React, { createContext, useState } from 'react';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [IsLogOpen, SetIsLogOpen] = useState(false);
  const [IsSignOpen, SetIsSignOpen] = useState(false)
  const [IsSideBarOpen, SetIsSideBarOpen] = useState(false)
  
  const [IsUserLogOut, SetIsUserLogOut] = useState(false)
  const [CurrIsUserLogin, SetCurrIsUserLogin] = useState(false)


  return (

    <AuthContext.Provider value={

      {
        IsLogOpen,
        SetIsLogOpen,
        IsSignOpen,
        SetIsSignOpen,
        IsSideBarOpen,
        SetIsSideBarOpen,
        IsUserLogOut,
        SetIsUserLogOut,
        CurrIsUserLogin,
        SetCurrIsUserLogin
      }

    }>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthContext;
