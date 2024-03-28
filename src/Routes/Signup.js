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
        <div style={{ maxWidth: '300px', margin: 'auto' }}>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" />
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <div>
                Already have an account? <Link to="/">Login</Link>
            </div>
        </div>
    );
};

export default Signup;
