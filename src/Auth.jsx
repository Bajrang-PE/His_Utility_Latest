import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { decryptData } from './utils/SecurityConfig';

const Auth = ({ comp: Component }) => {
    const navigate = useNavigate();
    const sessionData = localStorage.getItem('data');
    const userData = sessionData ? decryptData(sessionData) : null;

    const timerRef = useRef(null);
    const timeout = 60000 * 20; // 20 mins

    const logout = () => {
        localStorage.clear();
        Cookies.remove('csrfToken');
        // navigate('/dvdms/session-expired', { replace: true });
        //  window.location.reload(); 
        window.location.href = "/dvdms/session-expired";
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(logout, timeout);
    };

    useEffect(() => {
        if (!(userData?.isLogin === 'true' || userData?.isLogin === true)) {
            logout();
            return;
        }

        resetTimer();
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click', 'resize'];

        const handleActivity = () => resetTimer();
        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [userData]);

    if (!(userData?.isLogin === 'true' || userData?.isLogin === true)) {
        return null;
    }

    return <Component />;
};

export default React.memo(Auth);
