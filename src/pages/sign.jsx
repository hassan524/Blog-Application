import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import AuthContext from '@/data/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/data/db/firebase';
import { setDoc, doc } from 'firebase/firestore';

const Sign = () => {
  const { setIsLogOpen, IsSignOpen, SetIsSignOpen } = useContext(AuthContext);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [username, setUsername] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const isUserRegister = localStorage.getItem('IsUserRegister');
    if (isUserRegister === 'true') {
      // Navigate to login page if user is already registered
      navigate('/log');
      setIsLogOpen(true);
    }
  }, [navigate, setIsLogOpen]);

  const togglePasswordVisibility = () => {
    setShowPass((prev) => !prev);
    setShowConfirmPass((prev) => !prev);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (userPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      const userUid = userCredential.user.uid;

      // Set IsUserRegister to true in localStorage after successful registration
      localStorage.setItem('IsUserRegister', true);

      await setDoc(doc(db, 'Users', userUid), {
        username,
        email: userEmail,
      });

      // After registration, navigate to login route
      navigate('/log');
      setIsLogOpen(true);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        username: user.displayName,
        email: user.email,
        photo: user.photoURL
      });

      SetIsSignOpen(false)
      navigate('/');
      localStorage.setItem('IsUserLogin', true)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={IsSignOpen} onOpenChange={SetIsSignOpen} className="mx-5">
      <DialogContent className="sm:max-w-[425px] w-[90vw] p-6 rounded-lg shadow-lg bg-white flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold text-primary">Sign Up</DialogTitle>
          <p className="text-center text-sm text-gray-500 mb-4 text-primary">
            Please enter your details to Sign Up.
          </p>
          {error && <p className="bg-red-100 text-red-800 p-2 mb-4 rounded-lg text-center mt-5">{error}</p>}
        </DialogHeader>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <Input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Enter your Email"
            required
            onChange={(e) => setUserEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your Password"
              required
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <i
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${showPass ? 'bi bi-eye' : 'bi bi-eye-slash'}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          <div className="relative">
            <Input
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${showConfirmPass ? 'bi bi-eye' : 'bi bi-eye-slash'}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

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
          <p className="text-center w-full">
            Already have an account?{' '}
            <Link onClick={() => setIsLogOpen(true)} to="/log" className="text-primary font-semibold">
              Log In
            </Link>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Sign;
