import React from 'react';
import { Link } from 'react-router-dom';

const Notification = ({url}) => {
    return (
        <div id="dropdown-cta" className="w-full p-4 mt-6 rounded-lg bg-red-50" role="alert">
            <div className="flex items-center mb-3">
                <span className="bg-red-100 text-red-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded">Announcement!</span>
            </div>
            <p className="mb-3 text-sm text-red-800">
               The Project ID, Sales Rep Name and Quantity Multiplications are now auto generated.
            </p>
            <Link className="text-sm text-gray-600 underline font-medium hover:text-red-900" to={url}>Send Feedback here</Link>
        </div>
    );
};

export default Notification;
