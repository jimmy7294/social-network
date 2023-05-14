import React from 'react';
import { RingLoader } from 'react-spinners';

const Spinner = () => (
    <div className="spinner">
        <RingLoader size={150} color={'#123abc'} />
    </div>
);

export default Spinner;

