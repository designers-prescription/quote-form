import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Header = () => {
    const [user] = useAuthState(auth);

    const handleLogout = () => {
        auth.signOut();
    };

    return (
<<<<<<< HEAD:src/components/Header.js
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
=======
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            <div>
                <Link to="/step-one">Create Order</Link>
            </div>
>>>>>>> parent of 0b6f8fd (so much added,):src/Header.js
            <div>
                {/* <img src="logo.png" alt="Logo" style={{ width: '50px' }} /> */}
                <p>Labels Lab x Ship and Transfer</p>
            </div>
<<<<<<< HEAD:src/components/Header.js

            <div>
                {user && (
                    <>
                        <Link to="/step-one">Create Order</Link>
                        <Link to="/step-two">Update Quote</Link>
                    </>
                )}
            </div>

=======
>>>>>>> parent of 0b6f8fd (so much added,):src/Header.js
            <div>
                {user ? (
                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/">Login</Link>
                )}
            </div>
        </header>
    );
};

export default Header;
