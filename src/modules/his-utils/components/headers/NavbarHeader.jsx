import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import './NavbarHeader.css';
import { Link } from 'react-router-dom';
import { HISContext } from '../../contextApi/HISContext';
import TranslateModal from './TranslateModal';
import axios from 'axios';
import { extractAllPageText, ToastAlert } from '../../utils/commonFunction';
import SessionClock from '../commons/SessionClock';

const NavbarHeader = () => {
    const { setActionMode, setSelectedOption, language, changeLanguage, showTranslateModal, setShowTranslateModal, fetchTranslations, setLanguage, extractedTexts, setExtractedTexts, setLoading, dt } = useContext(HISContext)

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'english';
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
        fetchTranslations();
    }, []);

    const handleExtractClick = async () => {
        if (language === "english") {
            setLoading(true);
            try {
                const extracted = extractAllPageText();
                // setExtractedTexts(extracted);
                const val = { "keys": extracted }
                const res = await axios.post("/usm/translations/getTranslatedData", val);
                const response = res?.data;

                if (response?.status === 1) {
                    const fdt = extracted?.length > 0 && extracted?.map((dt, index) => {

                        const newItem = response?.data?.length > 0 && response?.data?.filter(dtc => dtc?.keyName === dt);

                        if (newItem?.length > 0) {
                            return {
                                "keyName": dt,
                                "english": newItem[0]?.english,
                                "hindi": newItem[0]?.hindi,
                                "marathi": newItem[0]?.marathi,
                                "gujarati": newItem[0]?.gujarati,
                                "sanskrit": newItem[0]?.sanskrit,
                                "entryBy": 1
                            }
                        } else {
                            return {
                                "keyName": dt,
                                "english": "",
                                "hindi": "",
                                "marathi": "",
                                "gujarati": "",
                                "sanskrit": "",
                                "entryBy": 1
                            }
                        }

                    }
                    )

                    setExtractedTexts(fdt);
                    setShowTranslateModal(true);
                } else {
                    console.error('Error while fetching data');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                setLoading(false);
            }
        } else {
            ToastAlert("Please select english language first", 'warning')
        }
    };


    const dashboardMasterDt = [
        { label: 'Widget Master', link: "/HIS_dashboard/widget-master" },
        { label: 'Tab Master', link: "/HIS_dashboard/tab-master" },
        { label: 'Dashboard Master', link: "/HIS_dashboard/dashboard-master" },
        { label: 'Parameter Master', link: "/HIS_dashboard/parameter-master" },
        { label: 'Dashboard Configuration Master', link: "/HIS_dashboard/dashboard-configuration-master" }
    ]
    const webServiceMaster = [
        { label: 'Data Service Master', link: "/HIS_dashboard/data-service-master" },
        { label: 'Service User Master', link: "/HIS_dashboard/service-user-master" },
        { label: 'Dashboard SubMenu Master', link: "/HIS_dashboard/dashboard-submenu-master" }
    ]

    const languageOptions = [
        { code: 'english', label: 'English' },
        { code: 'hindi', label: 'हिन्दी' },
        { code: 'marathi', label: 'मराठी' },
        { code: 'gujarati', label: 'ગુજરાતી' },
        { code: 'sanskrit', label: 'संस्कृतम्' }
    ]

    const reset = () => {
        localStorage.removeItem('values');
        localStorage.removeItem('radio');
        setSelectedOption([]);
        setActionMode('home')
    }

    const closeModal = () => {
        setShowTranslateModal(false);
        setExtractedTexts([]);
    }
    
    return (
        <>
            {/* <DashHeader/> */}
            <nav className="navbar navbar-expand-lg navbar-dark navbar-header-his">
                <div className="container-fluid his-brand">
                    {/* <div className="navbar-brand logo">{dt("HIS Utility")}</div> */}
                    {/* <SessionClock /> */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto">
                            {/* <button
                                className='btn btn-sm me-1 py-0 header-image-his'
                                onClick={handleExtractClick}
                                // disabled={language !== 'english'}
                            // data-tooltip="Select english then translate data from here"
                            // data-trigger="hover"
                            >
                                <i className="fa fa-language me-1 translate"></i> {dt("Translate")}</button> */}

                            {/* <li className="nav-item">
                                <div className="vr h-100 mx-2 text-white text-opacity-100" />
                            </li> */}

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle dropdownAnchor"
                                    href="#"
                                    id="dropdownMenu1"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {dt("Dashboard Masters")}
                                </a>
                                <ul className="dropdown-menu drpb-menu" aria-labelledby="dropdownMenu1">
                                    {dashboardMasterDt.map((item, index) => (
                                        <li key={index} className="dropdown-list">
                                            <Link className="dropdown-item" to={item?.link} onClick={() => reset()}>
                                                <FontAwesomeIcon icon={faGear} className="me-2 dropdown-gear-icon" />
                                                {dt(item?.label)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="nav-item">
                                <div className="vr h-100 mx-2 text-white text-opacity-100" />
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle dropdownAnchor"
                                    href="#"
                                    id="dropdownMenu2"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >

                                    {dt("Web Service Masters")}
                                </a>
                                <ul className="dropdown-menu drpb-menu" aria-labelledby="dropdownMenu2" style={{ right: 0, left: "auto" }}>
                                    {webServiceMaster.map((item, index) => (
                                        <li key={index} className="dropdown-list">
                                            <Link className="dropdown-item" to={item?.link} onClick={() => reset()}>
                                                <FontAwesomeIcon icon={faGear} className="me-2 dropdown-gear-icon" />
                                                {dt(item?.label)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Language Selector
                            <li className="nav-item">
                                <div className="vr h-100 mx-2 text-white text-opacity-100" />
                            </li>

                            <select
                                className="form-select form-select-sm py-0 "
                                style={{ width: 'auto', cursor: 'pointer' }}
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                            // data-tooltip-tour={isDashboard ? "Select your preferred language" : null}
                            // data-tooltip-step={isDashboard ? "3" : null}
                            >
                                {languageOptions.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select> */}
                        </ul>
                    </div>
                </div>
            </nav>

            {showTranslateModal &&
                <TranslateModal data={extractedTexts} onClose={closeModal} title={"Add translated data to database"} fetchTranslations={fetchTranslations} />
            }
        </>
    );
};

export default NavbarHeader;
