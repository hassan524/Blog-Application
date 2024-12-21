import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthContext from '@/data/context/AuthContext';

const Header = () => {
    const {
        IsLogOpen,
        setIsLogOpen,
        IsSignOpen,
        SetIsSignOpen,
        IsSideBarOpen,
        SetIsSideBarOpen,
    } = useContext(AuthContext);

    const [isUserLogin, setIsUserLogin] = useState(false); 
    const location = useLocation()


    const userLoginStatus = localStorage.getItem('IsUserLogin'); 

    const Handlelogin = () => {
        setIsLogOpen(true);
    };

    const HandleRegister = () => {
        SetIsSignOpen(true);
    };

    const sidebarOpen = () => {
        SetIsSideBarOpen(!IsSideBarOpen);
    };


    useEffect(() => {
     setIsUserLogin(userLoginStatus)
    },[] );

    return (
        <header className="h-[10vh] bg-slate-50 shadow-sm flex items-center fixed top-0 w-full italic">
            <div className="w-full flex justify-between items-center gap-10 sm:px-[2.5rem] px-5 py-[1rem] text-[1.50rem]">
                {/* Sidebar toggle button */}
                <div>
                    <i
                        onClick={sidebarOpen}
                        className="bi bi-list cursor-pointer text-xl p-2 rounded-full inline-flex hover:bg-slate-100 active:scale-95"
                    ></i>
                </div>

                {/* Conditional Rendering Based on User Login Status */}
                {isUserLogin ? (
                    // If user is logged in, show MyBlogs and Profile
                    <div className="sm:flex hidden items-center gap-10">
                        <span>My Blogs</span>
                        <span>Profile</span>
                    </div>
                ) : (
                    // If user is not logged in, show Login and Register links
                    <div className="sm:flex hidden items-center gap-10">
                        <span onClick={HandleRegister}>
                            <Link to="/Sign">Register</Link>
                        </span>
                        <span onClick={Handlelogin}>
                            <Link to="/log">Login</Link>
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
