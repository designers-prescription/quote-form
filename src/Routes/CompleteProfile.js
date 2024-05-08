import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
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

            navigate('/create-request');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="bg-gray-100 mx-auto max-w-6xl bg-white py-20 px-12 lg:px-24 shadow-xl mb-24 mt-10">
            <h2 className="text-center text-2xl font-bold mb-6">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                        <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="name">
                            Name*
                        </label>
                        <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                    </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                        <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="position">
                            Position*
                        </label>
                        <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3" id="position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" required />
                    </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                        <label className="uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="companyName">
                            Company Name*
                        </label>
                        <input className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3" id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" required />
                    </div>
                </div>
                <div className="-mx-3 md:flex">
                    <div className="md:w-full px-3">
                        <button className="w-full block bg-black hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-2 mb-2">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompleteProfile;
