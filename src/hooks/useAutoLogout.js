import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAutoLogout = (timeoutMinutes = 20) => {
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const timeout = 60000 * timeoutMinutes;

    const logout = useCallback(() => {
        localStorage.clear();
        Cookies.remove('csrfToken');
        navigate('/dvdms/session-expired');
        window.location.reload(); 
    }, [navigate]);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(logout, timeout);
    }, [logout, timeout]);

    useEffect(() => {
        // Initial timer setup
        resetTimer();

        // Events that indicate user activity
        const events = [
            'mousemove', 'mousedown', 'keypress', 'keydown', 
            'scroll', 'touchstart', 'click', 'resize',
            'load', 'focus'
        ];

        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimer]);

    return { resetTimer };
};

export default useAutoLogout;