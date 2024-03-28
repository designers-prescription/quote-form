import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, Text } from '@nextui-org/react';

const Header = () => {
    const [user] = useAuthState(auth);

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <Card css={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <Text css={{ margin: '20px' }}>Labels Lab x Ship and Transfer</Text>
                {user && (
                    <div css={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px' }}>
                        <Link to="/step-one">Create Order</Link>
                        <Link to="/step-two">Update Quote</Link>
                    </div>
                )}
            </div>
            <div css={{ margin: '20px' }}>
                {user ? (
                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/">Login</Link>
                )}
            </div>
        </Card>
    );
};

export default Header;
