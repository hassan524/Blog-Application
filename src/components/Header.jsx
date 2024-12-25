import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthContext from '@/data/context/AuthContext';

const Header = () => {
    const {
        SetIsLogOpen,
        SetIsSignOpen,
        IsSideBarOpen,
        SetIsSideBarOpen,
        IsUserLogOut,
        CurrIsUserLogin,
        IsDarkMode,
        SetIsDarkMode
    } = useContext(AuthContext);

    if (IsDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const navLinkStyles = ({ isActive }) => {
        return {
            textDecoration: isActive ? "underline" : "none",
        };
    };

    const [isUserLogin, setIsUserLogin] = useState(false);

    const userLoginStatus = localStorage.getItem('IsUserLogin');

    const Handlelogin = async () => {
        await SetIsLogOpen(true);
    };

    const HandleRegister = () => {
        SetIsSignOpen(true);
    };

    const sidebarOpen = () => {
        SetIsSideBarOpen(!IsSideBarOpen);
    };


    useEffect(() => {
        setIsUserLogin(userLoginStatus)
    }, [IsUserLogOut, CurrIsUserLogin]);

    const handledarkMode = () => {
        SetIsDarkMode(!IsDarkMode)
        console.log(IsDarkMode)
    }

    return (
        <header className="h-[10vh] dark:bg-gray-800 italicc z-50 bg-slate-50 shadow-sm dark:shadow-gray-700 flex items-center fixed top-0 w-full italic">
            <div className="w-full text-gray-800 dark:text-gray-500 flex justify-between items-center gap-10 sm:px-[2.5rem] px-5 py-[1rem] text-[1.50rem]">
                {/* Sidebar toggle button */}
                <div>
                    <i
                        onClick={sidebarOpen}
                        className="bi bi-list cursor-pointer text-xl p-2 rounded-full inline-flex hover:bg-slate-100 dark:hover:bg-gray-700 active:scale-95"
                    ></i>
                </div>

                {isUserLogin ? (
                    <div className="sm:flex hidden items-center gap-10">
                        <NavLink to="/" style={navLinkStyles}>
                           <span>Blogs</span>
                        </NavLink>
                        <NavLink to="/MyBlogs" style={navLinkStyles}>
                           <span>My Blogs</span>
                        </NavLink>
                        <Link>
                            <span>Profile</span>
                        </Link>

                    </div>
                ) : (
                    <div className="sm:flex hidden items-center gap-10">
                        <span onClick={HandleRegister}>
                            <Link to="/Sign">Register</Link>
                        </span>
                        <span onClick={Handlelogin}>
                            <Link to="/log">Login</Link>
                        </span>
                    </div>
                )}

                <div className="sm:hidden block">
                    <i onClick={handledarkMode} class="bi dark:hidden bi-moon-stars-fill text-gray-800 dark:text-gray-500 cursor-pointer"></i>
                    <i onClick={handledarkMode} class="bi bi-brightness-low-fill text-3xl hidden dark:text-gray-500 dark:block  cursor-pointer"></i>
                </div>
            </div>
        </header>
    );
};

export default Header;
