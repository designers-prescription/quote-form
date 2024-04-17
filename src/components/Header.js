import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Notification from './Notification';
import {  doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming db is correctly initialized in firebase.js

const Header = () => {
    const [user] = useAuthState(auth);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                const userData = docSnap.data();
                setUserRole(userData.role);
            }
        };
        fetchUserRole();
    });

    
    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 " aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-blue-100 flex flex-col justify-between space-y-3">
                <ul className="space-y-2 min-h-50 h-full font-medium flex flex-col  ">
                    <div className='mb-2'>
                        {/* <img src="logo.png" alt="Logo" style={{ width: '50px' }} /> */}
                        <h1 className='text-xl text-blue-700'> Labels Lab x Ship and Transfer</h1>
                    </div>



                    <div className='space-y-3'>
                        <li>
                            <Link to="/create-request" className="flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--iconoir" width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3m3 0h-3m0 0V9m0 3v3m9-11.4v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6"></path>
                                </svg>

                                <span className="ms-3">Start Quote</span>
                            </Link>
                        </li>

                        {userRole === 'PackagingAdmin' &&
                            <li>
                                <Link to="/update-quote" className="flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--iconoir" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <g fill="none" strokeWidth="1.5">
                                            <path fill="currentColor" d="m2.695 7.185l9 4l.61-1.37l-9-4zM12.75 21.5v-11h-1.5v11zm-.445-10.315l9-4l-.61-1.37l-9 4z"></path>
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3 17.11V6.89a.6.6 0 0 1 .356-.548l8.4-3.734a.6.6 0 0 1 .488 0l8.4 3.734A.6.6 0 0 1 21 6.89v10.22a.6.6 0 0 1-.356.548l-8.4 3.734a.6.6 0 0 1-.488 0l-8.4-3.734A.6.6 0 0 1 3 17.11"></path>
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m7.5 4.5l8.644 3.842a.6.6 0 0 1 .356.548v3.61"></path>
                                        </g>
                                    </svg>

                                    <span className="ms-3">Packaging Pricing</span>
                                </Link>
                            </li>
                        }

                        {userRole === 'ShippingAdmin' &&
                            <li>
                                <Link to="/shipping-requirements" className="flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--tabler" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                            <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path>
                                            <path d="M5 17H3v-4M2 5h11v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5M3 9h4"></path>
                                        </g>
                                    </svg>

                                    <span className="ms-3">Shipping Details</span>
                                </Link>
                            </li>
                        }
                        {userRole === 'ShippingAdmin' &&
                            <li>
                                <Link to="/shipping-quote" className="flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--tabler" width="16" height="16" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                            <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path>
                                            <path d="M5 17H3v-4M2 5h11v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5M3 9h4"></path>
                                        </g>
                                    </svg>

                                    <span className="ms-3">Shipping Pricing</span>
                                </Link>
                            </li>
                        }
                    </div>
                </ul>

                <Notification url={"mailto:vaibhav@designersprescription.com"}/>

                <div>
                    {user ? (
                        <button className='flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group w-full' onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--ic" width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"></path>
                            </svg>

                            <span className="ms-3">Logout</span> </button>
                    ) : (
                        <Link to="/">Login</Link>
                    )}
                </div>

            </div>
        </aside>
    );
};

export default Header;
