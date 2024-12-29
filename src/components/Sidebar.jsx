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
import { Link, NavLink } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/data/db/firebase';
import { setDataOfCurrentUser } from '@/data/redux/CurrentUserInfo';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Sidebar = () => {
  const {
    IsSideBarOpen,
    SetIsSideBarOpen,
    SetIsLogOpen,
    SetIsSignOpen,
    SetCurrIsUserLogin,
    SetIsUserLogOut,
    Users,
    follow,
  } = useContext(AuthContext);

  const [CurrentUser, setCurrentUser] = useState(null);
  const [LogAlertOpen, SetLogAlertOpen] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  const userLoginStatus = localStorage.getItem('IsUserLogin') === 'true';

  const HandleLogAlert = () => {
    SetLogAlertOpen(!LogAlertOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(
            setDataOfCurrentUser({
              ...docSnap.data(),
              id: user.uid,
            })
          );
        }
      } else {
        setCurrentUser(null);
        SetCurrIsUserLogin(false);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=adaba9947bd01d4aabea6879dd7e3970', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        return result.data.url;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImageToImgBB(file);
      if (imageUrl) {
        const userRef = doc(db, 'Users', CurrentUser.uid);
        try {
          await updateDoc(userRef, {
            photo: imageUrl,
          });
          dispatch(setDataOfCurrentUser({ ...data, photo: imageUrl }));
        } catch {}
      }
    }
  };

  const SidebarCloseHandler = () => {
    SetIsSideBarOpen(!IsSideBarOpen);
  };

  const Handlelogin = () => {
    SetIsLogOpen(true);
  };

  const HandleRegister = () => {
    SetIsSignOpen(true);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        dispatch(setDataOfCurrentUser(null));
        SetIsUserLogOut(true);
        SetCurrIsUserLogin(false);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  const navLinkStyles = ({ isActive }) => {
    return {
      textDecoration: isActive ? 'underline' : 'none',
    };
  };

  const handleFollow = (id) => {
    if (!userLoginStatus) {
      alert('Please Login First');
      return;
    }
    if (!followedUsers.includes(id)) {
      setFollowedUsers((prev) => [...prev, id]);
      follow(id);
    }
  };

  return (
    <div
      className={`bg-slate-50 dark:bg-gray-800 z-50 sm:w-[20rem] w-[85vw] py-4 px-5 h-full fixed flex flex-col top-0 justify-between left-0 shadow-md dark:shadow-sm dark:shadow-slate-50 ${
        IsSideBarOpen ? 'translate-x-[-100%]' : 'translate-x-0'
      } transition-all ease-out`}
    >
      <div className="w-full flex justify-end flex-col gap-8">
        <div className="flex justify-end">
          <i
            onClick={SidebarCloseHandler}
            className="bi bi-list cursor-pointer rounded-full inline-flex"
          ></i>
        </div>
        <div className="flex flex-col gap-4">
          {userLoginStatus ? (
            <div className="flex flex-col gap-8">
              <div className="w-full flex flex-col items-center justify-center">
                <div
                  className="relative w-32 h-32 bg-white rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleImageClick}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={data?.photo || '/NoUser.png'}
                    alt="User Profile"
                  />
                  <div className="absolute top-2 right-2 hidden group-hover:flex justify-center items-center w-8 h-8 bg-blue-500 text-white rounded-full">
                    <i className="bi bi-pencil-fill"></i>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <input
                  className="italic mt-4 text-3xl text-primary bg-transparent text-center underline"
                  type="text"
                  value={data?.username || ' '}
                  disabled
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="mt-5 flex gap-5 flex-col sm:hidden">
                <Link to="/Sign">
                  <div
                    className="w-full flex items-center justify-between p-1 rounded-md cursor-pointer dark:hover:bg-gray-800 hover:bg-slate-100"
                    onClick={HandleRegister}
                  >
                    <span className="text-lg">Sign up</span>
                    <i className="bi bi-people text-xl"></i>
                  </div>
                </Link>
                <Link to="/log">
                  <div
                    className="w-full flex items-center justify-between p-1 rounded-md cursor-pointer dark:hover:bg-gray-800 hover:bg-slate-100"
                    onClick={Handlelogin}
                  >
                    <span className="text-lg">Log in</span>
                    <i className="bi bi-box-arrow-right text-xl"></i>
                  </div>
                </Link>
              </div>
              <div className="xl:flex hidden mt-4 justify-center items-center">
                <img className="w-36" src="NoUser.png" alt="" />
              </div>
            </div>
          )}
          <div className="w-full mt-5 h-[40vh] xl:hidden">
            <div className="h-full flex flex-col bg-slate-100 dark:bg-gray-800 rounded-md shadow-md">
              <div className="h-12 w-full bg-slate-200 dark:bg-gray-900 text-white flex justify-center items-center rounded-t-md">
                <h3 className="text-md font-semibold">Users</h3>
              </div>
              <div className="flex-1 overflow-y-auto py-8">
                {Users?.filter((user) => user.username !== data?.username).map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center rounded-lg cursor-pointer p-3 mb-3 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 overflow-hidden rounded-full">
                        <img
                          src={user.photo || 'NoUser.png'}
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                        {user.username}
                      </span>
                    </div>
                    <button
                      className={`hover:scale-105 ${
                        followedUsers.includes(user.id)
                          ? 'text-slate-300'
                          : 'text-blue-400'
                      } hover:shadow-lg transition-all ease dark:text-slate-50 sm:px-5 py-[6px] px-4 sm:text-xs text-[10px] rounded-xl`}
                      onClick={() => handleFollow(user.id)}
                    >
                      {followedUsers.includes(user.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" variant="outline">
              <span>Setting</span>
              <i className="bi bi-gear"></i>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-700 shadow-md w-full min-w-[150px]">
            <DropdownMenuLabel className="cursor-pointer">
              <span>Settings</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userLoginStatus && (
              <>
                <DropdownMenuItem onClick={HandleLogAlert}>
                  <span>Logout</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer sm:hidden">
                  <NavLink style={navLinkStyles} to="/">
                    <span className="font-semibold">Blogs</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer sm:hidden">
                  <NavLink style={navLinkStyles} to="/MyBlogs">
                    <span className="font-semibold">My Blogs</span>
                  </NavLink>

                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer sm:hidden">
                  <NavLink style={navLinkStyles} to="/Profile">
                    <span className="font-semibold">My Profile</span>
                  </NavLink>

                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog onOpenChange={SetLogAlertOpen} open={LogAlertOpen}>
          <AlertDialogContent className="sm:w-[80vw] w-[90vw]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will Logout your acount.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Sidebar;
