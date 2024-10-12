import React from 'react';

interface ErrorOverviewProps {
    totalErrors: number;
    activeTerminals: number;
    errorFreePercentage: number;
}

const ErrorOverview: React.FC<ErrorOverviewProps> = ({ totalErrors, activeTerminals, errorFreePercentage }) => {
    return (
        <div className="error-overview">
            <h2>Error Overview</h2>
            <div>Total Errors: {totalErrors}</div>
            <div>Active Terminals: {activeTerminals}</div>
            <div>Error-Free Percentage: {errorFreePercentage}%</div>
        </div>
    );
};

export default ErrorOverview;