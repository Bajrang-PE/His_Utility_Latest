import React from 'react';

export const rightCaret = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>`;

export const leftCaret = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/></svg>`;

export const ExcelBtnSvg = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={props?.viewBox || "0 0 24 20"} width={props?.width || "25"} height={props?.height || "25"}>
        <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#E2F0D9" />
        <path d="M15 2v5h5z" fill="#A9D08E" />
        <path d="M4 4v16h2V4z" fill="#107C41" />
        <rect x="8" y="9" width="3" height="2" fill="#107C41" opacity="0.8" />
        <rect x="12" y="9" width="5" height="2" fill="#107C41" opacity="0.6" />
        <rect x="8" y="13" width="3" height="2" fill="#107C41" opacity="0.8" />
        <rect x="12" y="13" width="5" height="2" fill="#107C41" opacity="0.6" />
        <rect x="8" y="17" width="3" height="2" fill="#107C41" opacity="0.8" />
        <rect x="12" y="17" width="5" height="2" fill="#107C41" opacity="0.6" />
    </svg>

);

export const CsvBtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox={props?.viewBox || "0 0 24 20"} width={props?.width || "25"} height={props?.height || "25"}>
        <path d="M10 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#cef5f3" />
        <path d="M15 2v5h5z" fill="#B2DFDB" />
        <path d="M4 20h14a2 2 0 0 0 2-2V10H4z" fill="#00695C" />
        <text x="6" y="17" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontSize="5.5" fontWeight="bold" letterSpacing="0.5">CSV</text>
        <line x1="7" y1="6" x2="13" y2="6" stroke="#00897B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="8" x2="11" y2="8" stroke="#00897B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const PdfbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox={props?.viewBox || "0 0 24 20"} width={props?.width || "25"} height={props?.height || "25"}>
        <path d="M8 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#f37272" />
        <path d="M15 2v5h5z" fill="#F8BBD0" />
        <rect x="3" y="11" width="14" height="8" rx="1.5" fill="#D32F2F" />
        <text x="4" y="17" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontSize="5" fontWeight="700">PDF</text>
        <circle cx="10" cy="6" r="1.5" fill="#D32F2F" opacity="0.7" />
        <line x1="13" y1="6" x2="17" y2="6" stroke="#D32F2F" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
);

export const SettingbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="25" height="25">
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z" fill="#3F51B5" />
        <circle cx="12" cy="12" r="5" fill="#E8EAF6" />
        <circle cx="12" cy="12" r="3" fill="#1A237E" />
    </svg>
);

export const RefreshbtnSvg = (props) => (
    <svg className={props?.className || "me-1"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="22" height="22">
        <defs>
            <linearGradient id="refreshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00BEC4" />
                <stop offset="100%" stopColor="#007A87" />
            </linearGradient>
        </defs>
        <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="url(#refreshGrad)" />
    </svg>
);

export const AdvancedbtnSvg = (props) => (
    <svg className={props?.className || "me-1"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="23" height="23">
        <defs>
            <linearGradient id="advancedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A148C" />
                <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
        </defs>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="url(#advancedGrad)" opacity="0.15" />
        <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" fill="url(#advancedGrad)" opacity="0.1" />
        <line x1="4" y1="9" x2="20" y2="9" stroke="url(#advancedGrad)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="9" r="3" fill="#FFFFFF" stroke="url(#advancedGrad)" strokeWidth="2" />
        <line x1="4" y1="16" x2="20" y2="16" stroke="url(#advancedGrad)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3" fill="#FFFFFF" stroke="url(#advancedGrad)" strokeWidth="2" />
    </svg>
);

export const PrintbtnSvg = (props) => (
    <svg className={props?.className || "me-1"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="22" height="22">
        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3z" fill="#455A64" />
        <path d="M6 2h12v6H6z" fill="#FF9800" />
        <rect x="8" y="15" width="8" height="7" rx="1" fill="#FFFFFF" />
        <line x1="10" y1="18" x2="14" y2="18" stroke="#CFD8DC" strokeWidth="1" strokeLinecap="round" />
        <line x1="10" y1="20" x2="13" y2="20" stroke="#CFD8DC" strokeWidth="1" strokeLinecap="round" />
        <circle cx="18" cy="11" r="1" fill="#00E676" />
    </svg>
);

export const SearchbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="22" height="22">
        <path d="M21 21l-5.2-5.2" stroke="#1976D2" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="10" r="7" stroke="#1976D2" strokeWidth="2.5" fill="none" />
        <path d="M10 5a5 5 0 0 1 5 5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
);

export const ResetbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="25" height="25">
        <defs>
            <linearGradient id="resetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F44336" />
                <stop offset="100%" stopColor="#B71C1C" />
            </linearGradient>
        </defs>
        <path d="M12.5 4.5A7.5 7.5 0 1 0 20 12h-2a5.5 5.5 0 1 1-5.5-5.5v2L13 5.5v3h-2" fill="url(#resetGrad)" stroke="#B71C1C" strokeWidth="0.5" />
        <path d="M11 9.5l3.5-3.5L11 2.5v7z" fill="#FFFFFF" />
    </svg>
);

export const ShowbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="23" height="23">
        <defs>
            <linearGradient id="showGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#2E7D32" />
            </linearGradient>
        </defs>
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="url(#showGrad)" />
        <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
);

export const HidebtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="22" height="22">
        <defs>
            <linearGradient id="hideBgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="hideEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#90A4AE" />
                <stop offset="100%" stopColor="#37474F" />
            </linearGradient>
            <linearGradient id="hideSlashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF5252" />
                <stop offset="100%" stopColor="#C2185B" />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#hideBgGlow)" />
        <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.35 3.43 4.4 5.92 8.1 7l1.74-1.74A6.98 6.98 0 0 1 5 12c0-3.86 3.14-7 7-7 1.63 0 3.13.56 4.32 1.5l1.5-1.5A10.9 10.9 0 0 0 12 4.5z"
            fill="url(#hideEyeGrad)"
        />
        <path
            d="M12 9c1.66 0 3 1.34 3 3 0 .46-.11.89-.3 1.28l-3.98-3.98c.39-.19.82-.3 1.28-.3zm5.66-2.08l1.45-1.45A10.91 10.91 0 0 1 23 12c-1.73 4.39-6 7.5-11 7.5-.94 0-1.87-.11-2.77-.32l1.62-1.62c.37.07.76.11 1.15.11 3.86 0 7-3.14 7-7 0-1.57-.52-3.02-1.39-4.19z"
            fill="url(#hideEyeGrad)"
            opacity="0.85"
        />
        <rect
            x="2"
            y="11"
            width="22"
            height="2.5"
            rx="1.25"
            transform="rotate(-45 12 12)"
            fill="url(#hideSlashGrad)"
            stroke="#FFFFFF"
            strokeWidth="1"
        />
    </svg>
);

export const ReplybtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
        <defs>
            <linearGradient id="replyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#2979FF" />
            </linearGradient>
        </defs>

        <path
            d="M10 18h4c3.86 0 7-3.14 7-7s-3.14-7-7-7"
            fill="none"
            stroke="url(#replyGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
        />

        <path
            d="M11 5.44V3.5a1 1 0 0 0-1.62-.78l-7.2 6a1 1 0 0 0 0 1.56l7.2 6A1 1 0 0 0 11 15.5v-1.93c5.31-.08 9.17 2.3 10.74 6.2a1 1 0 0 0 1.9-.42C23.08 12.3 18.23 5.56 11 5.44z"
            fill="url(#replyGrad)"
        />
    </svg>
);

export const ArrowCircleLeftbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox={props?.viewBox || "0 0 24 20"} width={props?.width || "25"} height={props?.height || "25"}>
        <defs>
            <linearGradient id="circleArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E676" />
                <stop offset="100%" stopColor="#004D40" />
            </linearGradient>
        </defs>

        {/* Outer Glowing Circle Badge */}
        <circle cx="12" cy="12" r="10" fill="url(#circleArrowGrad)" />

        {/* Inner White Action Arrow */}
        <path
            d="M14.71 7.71a1 1 0 0 0-1.42 0L9.59 11H16a1 1 0 0 0 0-2H9.59l3.7-3.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-5.5 5.5a1 1 0 0 0 0 1.42l5.5 5.5a1 1 0 0 0 1.42-1.42L9.59 13H16a1 1 0 0 0 0-2H9.59l3.7-3.29z"
            fill="#FFFFFF"
            transform="rotate(0 12 12)"
        />
    </svg>
);

export const TableCellsbtnSvg = (props) => (
    <svg className={props?.className} xmlns="http://www.w3.org/2000/svg" viewBox={props?.viewBox || "0 0 24 20"} width={props?.width || "25"} height={props?.height || "25"}>
        <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B1FA2" />
                <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
        </defs>
        {/* Top Left Cell */}
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="url(#gridGrad)" />
        {/* Top Right Cell */}
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="url(#gridGrad)" opacity="0.9" />
        {/* Bottom Left Cell */}
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="url(#gridGrad)" opacity="0.8" />
        {/* Bottom Right Cell */}
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="url(#gridGrad)" opacity="0.7" />
    </svg>
);