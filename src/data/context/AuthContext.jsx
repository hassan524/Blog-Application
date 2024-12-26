import React, { createContext, useState } from 'react';
import { collection, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/data/db/firebase';
import { useSelector } from 'react-redux';

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

  const data = useSelector((state) => state.data.data);



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

  async function follow(followId) {
    try {
      console.log("Follow ID:", followId);
  
      const followUserDoc = doc(db, 'Users', followId);
      const currentUserDoc = doc(db, 'Users', data.id);
  
      // Ensure the documents exist before updating
      const followUserSnap = await getDoc(followUserDoc);
      const currentUserSnap = await getDoc(currentUserDoc);
  
      if (!followUserSnap.exists()) {
        console.error(`User with ID ${followId} does not exist.`);
        return;
      }
      if (!currentUserSnap.exists()) {
        console.error(`Current user with ID ${data.id} does not exist.`);
        return;
      }
  
      await updateDoc(followUserDoc, {
        followers: arrayUnion(data.id),
      });
  
      await updateDoc(currentUserDoc, {
        following: arrayUnion(followId),
      });
  
      console.log("Follow action completed successfully");
    } catch (error) {
      console.error("Error updating followers: ", error);
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
        follow,
        checkBlogs // function
      }

    }>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthContext;
