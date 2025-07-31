import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { decryptData } from './utils/SecurityConfig';



const Auth = (props) => {

    const { comp } = props;

    const navigate = useNavigate();
    const sessionData = localStorage.getItem('data');
    const userData = sessionData ? decryptData(sessionData) : '';

    const Component = comp;

    useEffect(() => {
        if (userData?.isLogin === 'true' || userData?.isLogin === true) {
            console.log('Login Success')
        } else {
            navigate('/')
            localStorage.clear();

        }
    }, [])

    useEffect(() => {
        if (userData?.isLogin === 'true' || userData?.isLogin === true) {
            console.log("Login Sucess")
        } else {
            navigate('/');
            localStorage.clear();

        }
    }, [userData])

    // to sign out if user is not active from a long time
    const timerRef = useRef(null);
    const timeout = 60000 * 30;

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(logout, timeout);
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/'
        localStorage.clear();
        Cookies.remove('csrfToken');
        navigate('/');

    };

    useEffect(() => {
        resetTimer();
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'load', 'click', 'resize'];
        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, []);


    return (
        <>
            {
                userData?.isLogin === 'true' || userData?.isLogin === true ? <Component /> : navigate('/')
            }
        </>
    )
}

export default React.memo(Auth)
