import React from 'react';
import ErrorOverview from './ErrorOverview';
import RecentErrors from './RecentErrors';
import ErrorDistribution from './ErrorDistribution';
import ConnectedTerminals from './ConnectedTerminals';

const Dashboard: React.FC = () => {
    // Mock data (in a real application, this would come from an API or state management)
    const overviewData = {
        totalErrors: 198,
        activeTerminals: 15,
        errorFreePercentage: 85
    };

    const recentErrors = [
        { id: '1', terminal: 'Server1', message: 'ImportError: No module named requests', details: 'Full stack trace...' },
        { id: '2', terminal: 'DevMachine3', message: 'TypeError: Cannot read property of undefined', details: 'Full stack trace...' },
        { id: '3', terminal: 'BuildServer', message: 'NullPointerException in Thread.java:748', details: 'Full stack trace...' }
    ];

    const errorDistributionData = [
        { language: 'Python', count: 65 },
        { language: 'JavaScript', count: 45 },
        { language: 'Java', count: 38 },
        { language: 'C++', count: 28 },
        { language: 'Ruby', count: 22 }
    ];

    const connectedTerminals = [
        { id: '1', name: 'Server1', status: 'Active' as const },
        { id: '2', name: 'DevMachine3', status: 'Active' as const },
        { id: '3', name: 'BuildServer', status: 'Inactive' as const }
    ];

    return (
        <div className="dashboard">
            <h1>Error Monitoring Dashboard</h1>
            <div className="dashboard-grid">
                <ErrorOverview
                    totalErrors={overviewData.totalErrors}
                    activeTerminals={overviewData.activeTerminals}
                    errorFreePercentage={overviewData.errorFreePercentage}
                />
                <RecentErrors errors={recentErrors} />
                <ErrorDistribution data={errorDistributionData} />
            </div>
            <ConnectedTerminals terminals={connectedTerminals} />
        </div>
    );
};

export default Dashboard;