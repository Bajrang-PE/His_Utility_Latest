import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function formatTime(ms) {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
}

export default function SessionClock() {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            setTimeLeft(-1);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const expirationTime = decoded.exp * 1000; 
            const now = Date.now();

            // check if already expired
            if (expirationTime <= now) {
                setTimeLeft(-1);
                return;
            }

            const updateClock = () => {
                const remaining = expirationTime - Date.now();
                setTimeLeft(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                    setTimeLeft(-1);
                }
            };

            updateClock(); // initial
            const interval = setInterval(updateClock, 1000);

            return () => clearInterval(interval);
        } catch (err) {
            console.error("Invalid JWT token:", err);
            setTimeLeft(-1);
        }
    }, []);

    const expired = timeLeft <= 0;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                background: expired ? "#ffe5e5" : "#e7f6e7",
                borderRadius: "20px",
                padding: "1px 15px",
                fontSize: "0.8rem",
                color: expired ? "#d9534f" : "#198754",
                fontWeight: 600,
                fontFamily: "monospace",
                boxShadow: "0 0 2px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                gap: "4px",
            }}
            title="Session Expiration Timer"
        >
            <span style={{ fontSize: "0.9rem" }}>⏱</span>
            {expired ? "Expired" : formatTime(timeLeft)}
        </div>
    )
}
