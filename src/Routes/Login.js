import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Input, Button, Card, Spacer } from '@nextui-org/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/step-one');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(''); // Clear any previous error
        try {
            await signInWithPopup(auth, googleProvider);
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));

            if (userDoc.exists()) {
                navigate('/step-one');
            } else {
                navigate('/complete-profile');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Card style={{ maxWidth: '300px', margin: 'auto' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <Button type="submit">Login</Button>
                <Button type="button" onClick={handleGoogleSignIn}>Sign in with Google</Button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <Spacer />
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </Card>
    );
};

export default Login;
