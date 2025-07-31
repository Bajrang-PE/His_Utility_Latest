import React, { useContext } from 'react';
import { RingLoader } from 'react-spinners';
import { HISContext } from '../../contextApi/HISContext';

const Loader = () => {
    const { loading } = useContext(HISContext);
    return (
        loading && (
            <div className="loader-overlay">

                <RingLoader
                    color='#04a6f5'
                    loading={true}
                    size={80}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                // speedMultiplier={2}
                />
            </div>
        )
    );
};

export default Loader;
