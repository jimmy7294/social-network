
import React from 'react';
import Spinner from '../../components/Spinner';
const loading = () => {
    return (
        <div className="loading">
            <h1>Loading...</h1>
        <div className="loading__spinner">
            <Spinner />
        </div>
        </div>
    );
    }

export default loading;