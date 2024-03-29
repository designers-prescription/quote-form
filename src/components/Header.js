import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Notification from './Notification';

const Sidebar = () => {
    const [user] = useAuthState(auth);

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
                        <Link to="/step-one" className="flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--iconoir" width="16" height="16" viewBox="0 0 24 24">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3m3 0h-3m0 0V9m0 3v3m9-11.4v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V3.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6"></path>
</svg>

                            <span className="ms-3">Start Quote</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/step-two" className="flex items-center p-2 py-4 bg-blue-900 text-sm  text-white rounded-lg hover:bg-blue-500 group">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--ic" width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 13V9c0-.55-.45-1-1-1H7V6h5V4H9.5V3h-2v1H6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h4v2H5v2h2.5v1h2v-1H11c.55 0 1-.45 1-1m7.59-.48l-5.66 5.65l-2.83-2.83l-1.41 1.42L13.93 21L21 13.93z"></path>
</svg>

                           <span className="ms-3">Update Packaging Pricing</span>
                        </Link>
                    </li>
                    </div>
                </ul>
                
                    <Notification />

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

export default Sidebar;
