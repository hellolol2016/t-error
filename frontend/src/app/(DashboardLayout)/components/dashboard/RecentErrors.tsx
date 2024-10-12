import { ChevronRight, Search } from "lucide-react";
import "./RecentErrors.css";
import React, { useContext, useState } from "react";
import { ErrorContext } from "../../context/ErrorContext";

function formatTimestamp(timestamp: string, username: string) {
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
    return `${username ? username : "unknown user"} Today at ${formattedTime}`;
  } else if (isYesterday) {
    return `${
      username ? username : "unknown user"
    } Yesterday at ${formattedTime}`;
  } else {
    return username
      ? username
      : "unknown user" +
          " " +
          date.toLocaleDateString("en-US", { month: "long", day: "numeric" }) +
          `, ${formattedTime}`;
  }
}

const RecentErrors = () => {
  const errorData = useContext(ErrorContext) ?? [];
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<typeof errorData>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Simulated search results
    if (term) {
      setSearchResults(
        errorData.filter((error) =>
          error.username?.toLowerCase().includes(term.toLowerCase())
        )
      );
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
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users..."
          className="search-input"
        />
      </div>

      <div className="terminal-content">
        {(searchResults.length > 0 ? searchResults : errorData).map(
          (error, index) => (
            <div key={index} className="terminal-item">
              <div className="terminal-item-header">
                <ChevronRight className="chevron-icon" size={16} />
                <span className="terminal-timestamp">
                  {formatTimestamp(error.timestamp, error.username)}
                </span>
              </div>
              <div className="terminal-command">
                $ {error.errorData.command}
              </div>
              <div className="terminal-error">
                Error: {error.errorData.error}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RecentErrors;
