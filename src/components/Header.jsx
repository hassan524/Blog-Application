import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthContext from '@/data/context/AuthContext';

const Header = () => {
    const {
        SetIsLogOpen,
        SetIsSignOpen,
        IsSideBarOpen,
        SetIsSideBarOpen,
        IsUserLogOut,
        CurrIsUserLogin
    } = useContext(AuthContext);

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

    return (
        <header className="h-[10vh] italicc z-50 bg-slate-50 shadow-sm flex items-center fixed top-0 w-full italic">
            <div className="w-full flex justify-between items-center gap-10 sm:px-[2.5rem] px-5 py-[1rem] text-[1.50rem]">
                {/* Sidebar toggle button */}
                <div>
                    <i
                        onClick={sidebarOpen}
                        className="bi bi-list cursor-pointer text-xl p-2 rounded-full inline-flex hover:bg-slate-100 active:scale-95"
                    ></i>
                </div>

                {isUserLogin ? (
                    <div className="sm:flex hidden items-center gap-10">
                        <span>My Blogs</span>
                        <span>Profile</span>
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
            </div>
        </header>
    );
};

export default Header;
