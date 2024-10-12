"use client";
import React, { useState } from 'react';

interface Error {
    id: string;
    terminal: string;
    message: string;
    details: string;
}

interface RecentErrorsProps {
    errors: Error[];
}

const RecentErrors: React.FC<RecentErrorsProps> = ({ errors }) => {
    const [selectedError, setSelectedError] = useState<Error | null>(null);

    return (
        <div className="recent-errors">
            <h2>Recent Errors</h2>
            <ul className="error-list">
                {errors.map(error => (
                    <li key={error.id} className="error-item" onClick={() => setSelectedError(error)}>
                        <strong>{error.terminal}:</strong> {error.message}
                    </li>
                ))}
            </ul>
            {selectedError && (
                <div className="error-modal">
                    <h3>Error Details</h3>
                    <p><strong>Terminal:</strong> {selectedError.terminal}</p>
                    <p><strong>Message:</strong> {selectedError.message}</p>
                    <pre>{selectedError.details}</pre>
                    <button onClick={() => setSelectedError(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default RecentErrors;