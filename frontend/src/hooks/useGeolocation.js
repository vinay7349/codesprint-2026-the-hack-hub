import { useState, useEffect } from 'react';

/**
 * Custom hook to track user geolocation
 * @returns {Object} { location, error, accuracy }
 */
export const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [accuracy, setAccuracy] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            setAccuracy(accuracy);
        };

        const handleError = (error) => {
            setError(error.message);
        };

        // Initial position
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

        // Watch for updates
        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            ...options
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, [options]);

    return { location, error, accuracy };
};
