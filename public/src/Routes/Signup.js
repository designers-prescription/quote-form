import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user details in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                position,
                companyName,
            });

            // Redirect to Step One
            navigate('/step-one');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section className="flex flex-col md:flex-row h-4/6 items-center">
            <div className="bg-blue-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                <img
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=4470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="bg-white w-full md:max-w-md lg:max-w-full md:w-1/2 xl:w-1/3 h-4/6 px-6 lg:px-16 xl:px-12 flex items-center justify-center">
                <div className="w-full">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Create your account</h1>
                    <form className="mt-6 w-full" onSubmit={handleSignup}>
                        <div>
                            <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Position</label>
                            <input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Position"
                                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Company Name</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Company Name"
                                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-2"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full block bg-black hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 mb-2"
                        >
                            Sign Up
                        </button>
                    </form>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                    <div className="mt-8">
                        Already have an account?{' '}
                        <Link to="/" className="text-blue-500 hover:text-blue-700 font-semibold">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
