import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import AuthContext from '@/data/context/AuthContext';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/data/db/firebase';
import { setDataOfCurrentUser } from '@/data/redux/CurrentUserInfo';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {
  const { IsSideBarOpen, SetIsSideBarOpen, setIsLogOpen, SetIsSignOpen, isUserLogin, SetIsUserLogin } = useContext(AuthContext);
  const [CurrentUser, setCurrentUser] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input element
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  console.log(data)

  const userLoginStatus = localStorage.getItem('IsUserLogin') === 'true';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        dispatch(setDataOfCurrentUser(docSnap.data()));
        // SetIsUserLogin(true); // Set user as logged in
      } else {
        setCurrentUser(null);
        SetIsUserLogin(false); // Set user as logged out
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  // Upload image to imgBB
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=adaba9947bd01d4aabea6879dd7e3970', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    }
    return null;
  };

  // Handle image click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle image change
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImageToImgBB(file); // Upload and get image URL

      if (imageUrl) {
        const userRef = doc(db, 'Users', CurrentUser.uid); // Reference to user's Firestore doc

        // Update Firestore with new photo URL
        try {
          await updateDoc(userRef, {
            photo: imageUrl,
          });
          dispatch(setDataOfCurrentUser({ ...data, photo: imageUrl }));
        } catch (error) {
          console.error('Error updating Firestore document:', error);
        }
      } else {
        console.error('Image upload failed');
      }
    }
  };

  // Close sidebar
  const SidebarCloseHandler = () => {
    SetIsSideBarOpen(!IsSideBarOpen); // Toggle sidebar visibility
  };

  // Handle login
  const Handlelogin = () => {
    setIsLogOpen(true); // Open login modal
  };

  // Handle register
  const HandleRegister = () => {
    SetIsSignOpen(true);
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        dispatch(setDataOfCurrentUser(null));
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };
  return (
    <div
      className={`bg-slate-50 sm:w-[20rem] w-[70vw] py-4 px-5 h-full fixed flex flex-col justify-between left-0 shadow-md ${IsSideBarOpen ? 'translate-x-[-100%]' : 'translate-x-0'
        } transition-all ease-out`}
    >
      {/* Top Section */}
      <div className="w-full flex justify-end flex-col gap-5">
        <div className="flex justify-end">
          <i
            onClick={SidebarCloseHandler}
            className="bi bi-list cursor-pointer rounded-full inline-flex"
          ></i>
        </div>

        {/* Conditional Rendering for User */}
        <div className="flex flex-col gap-4">
          {userLoginStatus ? (
            // If user exists, show profile and "My Blogs" links
            <div className="flex flex-col gap-8">
              <div className="w-full flex flex-col items-center justify-center">
                <div
                  className="w-32 h-32 bg-white rounded-full overflow-hidden cursor-pointer"
                  onClick={handleImageClick} // Trigger file input on click
                >
                  <img
                    className="w-full h-full object-cover"
                    src={data?.photo || '/NoUser.png'} // Use user's photo or fallback image
                    alt="User Profile"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange} // Handle file change
                />
                <input
                  className="italicc mt-3 text-xl bg-transparent text-center underline"
                  type="text"
                  value={data?.username || ' '}
                  disabled
                />
              </div>
            </div>
          ) : (
            // If no user, show "Sign up" and "Log in" links
            <div className='sm:hidden'>
              <Link to="/Sign">
                <div
                  className="w-full flex items-center justify-between p-1 rounded-md cursor-pointer hover:bg-slate-100"
                  onClick={HandleRegister}
                >
                  <span>Sign up</span>
                </div>
              </Link>
              <Link to="/log">
                <div
                  className="w-full flex items-center justify-between p-1 rounded-md cursor-pointer hover:bg-slate-100"
                  onClick={Handlelogin}
                >
                  <span>Log in</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" variant="outline">
              Setting
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-md w-full min-w-[150px]">
            <DropdownMenuLabel className="cursor-pointer">
              <span>Settings</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userLoginStatus ? (
              <>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <span className="font-semibold">Logout</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer sm:hidden">
                  <span className="font-semibold">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer sm:hidden">
                  <span className="font-semibold">My Blogs</span>
                </DropdownMenuItem>
              </>
            ) : null}

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
