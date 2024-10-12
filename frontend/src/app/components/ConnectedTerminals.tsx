import React from 'react';

interface Terminal {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

interface ConnectedTerminalsProps {
  terminals: Terminal[];
}

const ConnectedTerminals: React.FC<ConnectedTerminalsProps> = ({ terminals }) => {
  return (
    <div className="connected-terminals">
      <h2>Connected Terminals</h2>
      <div className="terminal-list">
        {terminals.map(terminal => (
          <div key={terminal.id} className="terminal-item">
            <strong>{terminal.name}</strong>: {terminal.status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedTerminals;