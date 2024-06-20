import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
// import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const LoginComponent = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [setError] = useState('');
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError(''); // Clear any previous error
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate('/step-one');
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };



  const handleGoogleSignIn = async () => {
    setError(''); // Clear any previous error
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        navigate('/create-request'); // User exists, navigate to step one
      } else {
        navigate('/complete-profile'); // User does not exist, navigate to complete profile
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <section className="flex flex-col md:flex-row h-4/6 items-center">
      <div className="bg-blue-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://images.unsplash.com/photo-1605732562742-3023a888e56e?q=80&w=4470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account to access the portal for Shipping and Packaging Quotes</h1>
          {/* <form className="mt-6 w-full " onSubmit={handleLogin}>
            <div>
              <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                required
              />
            </div>
            <div className="mt-4">
              <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                minLength="6"
                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full block bg-black hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 mb-2"
            >
              Log In
            </button>
          </form>
          {error && <div className="text-red-500 mt-2">{error}</div>} */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 mt-6 border border-gray-300"
          >

            <div className='flex items-center justify-center'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-6 h-6"
                viewBox="0 0 48 48"
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use xlinkHref="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
              </svg>
              Sign in with Google

            </div>
          </button>
          {/* <div className="mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
