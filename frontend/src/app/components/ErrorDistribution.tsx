import React from 'react';

interface ErrorData {
    language: string;
    count: number;
}

interface ErrorDistributionProps {
    data: ErrorData[];
}

const ErrorDistribution: React.FC<ErrorDistributionProps> = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <div className="error-distribution">
            <h2>Error Distribution</h2>
            <div className="chart-container">
                {data.map((item, index) => (
                    <div
                        key={item.language}
                        className="bar"
                        style={{
                            height: `${(item.count / maxCount) * 100}%`,
                            left: `${(index / data.length) * 100}%`,
                        }}
                    >
                        <div className="bar-label">{item.language}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ErrorDistribution;