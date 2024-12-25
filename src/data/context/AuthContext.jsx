import React, { createContext, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/data/db/firebase';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [IsLogOpen, SetIsLogOpen] = useState(false);
  const [IsSignOpen, SetIsSignOpen] = useState(false)
  const [IsSideBarOpen, SetIsSideBarOpen] = useState(false)

  const [IsUserLogOut, SetIsUserLogOut] = useState(false)
  const [CurrIsUserLogin, SetCurrIsUserLogin] = useState(false)

  const [OpenUploadBlog, SetOpenUploadBlog] = useState(false)

  const [IsBlogUpload, SetIsBlogUpload] = useState(false)

  const [Users, SetUsers] = useState([])
 
  const [IsDarkMode, SetIsDarkMode] = useState(true)


  async function checkBlogs() {

    try {
      
      const querySnapshot = await getDocs(collection(db, "posts"));

      const blogs = await querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return blogs

    } catch (error) {
      console.log(error)
    }

  }

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
        SetCurrIsUserLogin,
        OpenUploadBlog,
        SetOpenUploadBlog,
        IsBlogUpload,
        SetIsBlogUpload,
        SetIsDarkMode,
        IsDarkMode,
        Users,
        SetUsers,

        checkBlogs // function
      }

    }>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthContext;
