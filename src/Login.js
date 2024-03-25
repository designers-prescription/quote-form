import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

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
        <div style={{ maxWidth: '300px', margin: 'auto' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
                <button type="button" onClick={handleGoogleSignIn}>Sign in with Google</button>
            </form>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <div>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default Login;
