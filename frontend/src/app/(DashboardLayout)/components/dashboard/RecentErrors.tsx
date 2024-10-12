import { errorData } from "../../page";
import { ChevronRight, Search } from 'lucide-react';
import './RecentErrors.css';
import React, { useState } from 'react';

function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let formattedTime = date
        .toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        })
        .toLowerCase();

    if (isToday) {
        return `Today at ${formattedTime}`;
    } else if (isYesterday) {
        return `Yesterday at ${formattedTime}`;
    } else {
        return (
            date.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
            `, ${formattedTime}`
        );
    }
}

interface User {
    id: number;
    name: string;
}

const RecentErrors = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);

        // Simulated search results
        if (term) {
            setSearchResults([
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' },
                { id: 3, name: 'Bob Johnson' },
            ].filter(user => user.name.toLowerCase().includes(term.toLowerCase())));
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="terminal-container">
            <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <span className="terminal-title">Terminal - Error Logs</span>
            </div>

            <div className="search-container">
                <div className="terminal-item-header">
                    <Search size={16} className="chevron-icon" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search users..."
                        className="search-input"
                    />
                </div>
                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map(user => (
                            <div key={user.id} className="search-result">
                                {user.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="terminal-content">
                {errorData.map((error, index) => (
                    <div key={index} className="terminal-item">
                        <div className="terminal-item-header">
                            <ChevronRight className="chevron-icon" size={16} />
                            <span className="terminal-timestamp">{formatTimestamp(error.timestamp)}</span>
                        </div>
                        <div className="terminal-command">
                            $ {error.errorData.command}
                        </div>
                        <div className="terminal-error">
                            Error: {error.errorData.error}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
    export default RecentErrors;