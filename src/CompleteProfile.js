import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const CompleteProfile = () => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [companyName, setCompanyName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                name,
                position,
                companyName,
            });

            navigate('/step-one');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (

            <div style={{ maxWidth: '300px', margin: 'auto' }}>
            <h2 style={{textAlign:'center'}}>Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" />
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CompleteProfile;
