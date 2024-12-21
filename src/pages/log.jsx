import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import AuthContext from '@/data/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/data/db/firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/data/db/firebase';

const Log = () => {
    const navigate = useNavigate();
    const { IsLogOpen, setIsLogOpen, SetIsSignOpen } = useContext(AuthContext);

    const [UserEmail, setUserEmail] = useState('');
    const [UserPassword, setUserPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages

    useEffect(() => {
        const isUserLogin = localStorage.getItem('IsUserLogin');
        if (isUserLogin === 'true') {
            navigate('/')
            setIsLogOpen(false)
        }
    }, [])

    const HandleRegister = () => {
        SetIsSignOpen(true);
    };

    const HandleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signInWithEmailAndPassword(auth, UserEmail, UserPassword);
            localStorage.clear()
            setIsLogOpen(false)
            navigate('/')
            localStorage.setItem('IsUserLogin', true)
            localStorage.setItem('CurrentUserUid', res.user.uid);


        } catch (error) {
            setError(error.message); // Set the error message
            console.error('Login failed:', error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            localStorage.clear();
            localStorage.setItem('CurrentUserEmail', result.user.uid);

            await setDoc(doc(db, 'Users', result.user.uid), {
                username: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            });

            setIsLogOpen(false);
            navigate('/');
            localStorage.setItem('IsUserLogin', true)
        } catch (err) {
            setError(err.message);
            console.error('Google Sign-In error:', err.message);
        }
    };

    return (
        <Dialog open={IsLogOpen} onOpenChange={setIsLogOpen} className="mx-5">
            <DialogContent className="sm:max-w-[425px] w-[90vw] p-6 rounded-lg shadow-lg bg-white flex flex-col gap-5">
                {/* Dialog Header */}
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-semibold text-primary">
                        Log In
                    </DialogTitle>
                    <p className="text-center text-sm text-gray-500 mb-4 text-primary">
                        Please enter your details to log in.
                    </p>
                </DialogHeader>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-800 p-2 mb-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={HandleLoginSubmit} className="flex flex-col gap-8">
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={UserEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={UserPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                        />
                    </div>

                    {/* Login Button */}
                    <div>
                        <Button type="submit" className="w-full">
                            Log In
                        </Button>
                    </div>
                </form>

                {/* Or Divider */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Sign In With Google */}
                <div className="flex justify-center">
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="flex justify-center gap-2 bg-transparent rounded-lg border border-slate-300 w-full px-2 py-[8px]"
                    >
                        <img src="/google-icon.png" alt="Google Icon" className="w-6 h-6" />
                        <span className="font-semibold text-primary">Sign in with Google</span>
                    </button>
                </div>

                <DialogFooter>
                    <div className="flex justify-center w-full">
                        <p>
                            Don’t have an account?
                            <Link
                                onClick={HandleRegister}
                                to="/sign"
                                className="ms-2 text-primary font-semibold cursor-pointer"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Log;
