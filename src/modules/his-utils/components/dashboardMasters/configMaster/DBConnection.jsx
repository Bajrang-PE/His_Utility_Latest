import React, { useState, useEffect } from 'react';
import InputField from '../../commons/InputField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faDatabase, faCheckCircle, faPlus, faTimes, faPlay, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import './DBConnection.css';

const DBConnection = (props) => {
    const { dt, values, handleValueChange, errors } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [showDatabaseFields, setShowDatabaseFields] = useState(false);
    const [selectedDbType, setSelectedDbType] = useState(values?.dbType || '');
    const [animationClass, setAnimationClass] = useState('');
    const [connectionCards, setConnectionCards] = useState([{ id: 1, isTesting: false, testStatus: null, hostname: '', port: '', serviceName: '', softDbUserName: '', softDbPassword: '', errors: { "hostnameErr": '', "portErr": '', "serviceNameErr": '', "softDbUserNameErr": '', "softDbPasswordErr": '' } }]);

    const databaseTypes = [
        {
            id: 'postgres',
            name: 'PostgreSQL',
            color: '#336791',
            gradient: 'linear-gradient(135deg, #336791 0%, #2b5f8a 100%)',
            iconPath: '/public/postgresql-icon.svg'
        },
        {
            id: 'oracle',
            name: 'Oracle',
            color: '#F80000',
            gradient: 'linear-gradient(135deg, #F80000 0%, #CC0000 100%)',
            iconPath: "/oracle-svgrepo-com.svg"
        },
        {
            id: 'mysql',
            name: 'MySQL',
            color: '#00758F',
            gradient: 'linear-gradient(135deg, #00758F 0%, #005C73 100%)',
            iconPath: "/mysql-logo-svgrepo-com.svg"
        },
        {
            id: 'sqlserver',
            name: 'SQL Server',
            color: '#CC2927',
            gradient: 'linear-gradient(135deg, #CC2927 0%, #A31F1D 100%)',
            iconPath: "/microsoft-sql-server-logo-svgrepo-com.svg"
        },
        {
            id: 'edbdb',
            name: 'EDB',
            color: '#47A248',
            gradient: 'linear-gradient(135deg, #47A248 0%, #3D8B3D 100%)',
            iconPath: "/EDB EnterpriseDB.svg"
        }
    ];


    useEffect(() => {
        if (selectedDbType) {
            setShowDatabaseFields(true);
        }
    }, []);

    const handleDbTypeSelect = (dbType) => {
        setSelectedDbType(dbType);
        setAnimationClass('pulse-animation');

        setTimeout(() => {
            setShowDatabaseFields(true);
            setAnimationClass('');
        }, 300);

        handleValueChange({
            target: {
                name: 'dbType',
                value: dbType
            }
        });
    };

    const handleBackToSelection = () => {
        setAnimationClass('slide-out-animation');
        setTimeout(() => {
            setShowDatabaseFields(false);
            setSelectedDbType('');
            setAnimationClass('');

            handleValueChange({
                target: {
                    name: 'dbType',
                    value: ''
                }
            });
        }, 300);
    };

    const DatabaseIcon = ({ db, isSelected, onClick }) => (
        <div
            className={`database-icon-card ${isSelected ? 'selected' : ''} ${animationClass}`}
            onClick={() => onClick(db.id)}
            style={{
                '--db-color': db.color,
                '--db-gradient': db.gradient
            }}
        >
            <div className="database-icon-wrapper">
                <div className="database-icon">
                    {/* <FontAwesomeIcon icon={faDatabase} /> */}
                    <img src={`/db${db?.iconPath}`} className="db-svg-image" alt={'image'} />
                </div>
                {isSelected && (
                    <div className="selected-indicator">
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                )}
            </div>
            <span className="database-name">{db.name}</span>
        </div>
    );

    const DatabaseIconsGrid = () => (
        <div className="database-selection-container">
            <div className="database-selection-header">
                <h5 style={{ color: "#2c3e50" }}>Select Database Type</h5>
            </div>
            <div className="database-icons-grid">
                {databaseTypes.map((db) => (
                    <DatabaseIcon
                        key={db.id}
                        db={db}
                        isSelected={selectedDbType === db.id}
                        onClick={handleDbTypeSelect}
                    />
                ))}
            </div>
        </div>
    );

    const addConnectionCard = () => {
        const newId = Math.max(...connectionCards.map(card => card.id), 0) + 1;
        const newCard = {
            id: newId,
            isTesting: false,
            testStatus: null,
            animationClass: 'card-enter',
            hostname: '',
            port: '',
            serviceName: '',
            softDbUserName: '',
            softDbPassword: ''
        };

        setConnectionCards(prev => [...prev, newCard]);

        setTimeout(() => {
            setConnectionCards(prev =>
                prev.map(card =>
                    card.id === newId
                        ? { ...card, animationClass: '' }
                        : card
                )
            );
        }, 500);
    };

    const removeConnectionCard = (id) => {
        if (connectionCards.length === 1) return;

        setConnectionCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, animationClass: 'card-exit' }
                    : card
            )
        );

        setTimeout(() => {
            setConnectionCards(prev => prev.filter(card => card.id !== id));
        }, 300);
    };

    const testConnection = async (cardId) => {
        setConnectionCards(prev =>
            prev.map(card =>
                card.id === cardId
                    ? { ...card, isTesting: true, testStatus: null }
                    : card
            )
        );

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const isSuccess = Math.random() > 0.3;
            setConnectionCards(prev =>
                prev.map(card =>
                    card.id === cardId
                        ? { ...card, isTesting: false, testStatus: isSuccess ? 'success' : 'error' }
                        : card
                )
            );
        } catch (error) {
            setConnectionCards(prev =>
                prev.map(card =>
                    card.id === cardId
                        ? { ...card, isTesting: false, testStatus: 'error' }
                        : card
                )
            );
        }
    };

    const handleTestValidation = (cardId) => {
        let isValid = true;
        const cardData = connectionCards.find(c => c.id === cardId);
        const newErrors = {};

        if (!cardData?.hostname?.trim()) {
            newErrors.hostnameErr = "Hostname is required";
            isValid = false;
        }
        if (!cardData?.port?.trim()) {
            newErrors.portErr = "Port is required";
            isValid = false;
        }
        if (!cardData?.serviceName?.trim()) {
            newErrors.serviceNameErr = "Service name is required";
            isValid = false;
        }
        if (!cardData?.softDbUserName?.trim()) {
            newErrors.softDbUserNameErr = "Username is required";
            isValid = false;
        }
        if (!cardData?.softDbPassword?.trim()) {
            newErrors.softDbPasswordErr = "Password is required";
            isValid = false;
        }

        setConnectionCards(prev =>
            prev.map(card =>
                card.id === cardId
                    ? { ...card, errors: newErrors }
                    : card
            )
        );

        if (isValid) {
            testConnection(cardId);
        }
    };


    const handleDBValueChange = (cardId, e) => {

        const { name, value } = e?.target;
        const errName = name + 'Err';

        if (cardId && name) {
            setConnectionCards(prev =>
                prev.map(card =>
                    card.id === cardId
                        ? { ...card, [name]: value, errors: { ...card?.errors, [errName]: "" } }
                        : card
                )
            );

        }
    }

    return (
        <>
            <b><h6 className='header-devider mb-1 ps-1'>{dt("Database Connectivity")}</h6></b>

            <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                <div className='col-sm-12'>
                    <div className="form-group row">
                        <div className="col-sm-12 px-2 align-content-center pb-1">
                            {!showDatabaseFields ? (
                                <DatabaseIconsGrid />
                            ) : (
                                <div className="selected-database-display">
                                    <div className="selected-db-header">
                                        <button
                                            type="button"
                                            className="back-button"
                                            onClick={handleBackToSelection}
                                        >
                                            Change Database Type
                                        </button>
                                        <div className="current-selection">
                                            <div
                                                className="current-db-icon"
                                                style={{
                                                    border: `1px solid ${databaseTypes.find(db => db.id === selectedDbType)?.color}`
                                                }}
                                            >
                                                {/* <FontAwesomeIcon icon={faDatabase} /> */}
                                                <img src={`/db${databaseTypes.find(db => db.id === selectedDbType)?.iconPath}`} className="current-svg-image" alt={'image'} />
                                            </div>
                                            <span>
                                                {databaseTypes.find(db => db.id === selectedDbType)?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {errors?.dbTypeErr && (
                                <div className="required-input mt-2">
                                    {errors?.dbTypeErr}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDatabaseFields && (
                <div className="connection-cards-container">
                    <div className="cards-header mb-2">
                        <button
                            type="button"
                            className="btn-add-card"
                            onClick={addConnectionCard}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Add Connection
                        </button>
                    </div>

                    <div className="cards-grid">
                        {connectionCards.map(card => (
                            <div className={`connection-card ${card.animationClass || ''}`} key={card?.id}>

                                <div className="card-header" style={{ background: `${card.testStatus === 'success' ? '#ecfff0' : card.testStatus === 'error' ? '#ffecec' : ''}` }}>
                                    <div className="card-header-content">
                                        <button
                                            type="button"
                                            className="btn-test-connection"
                                            onClick={() => handleTestValidation(card.id)}
                                            disabled={card.isTesting}
                                        >
                                            {card.isTesting ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    Testing...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faPlay} />
                                                    Test Connection
                                                </>
                                            )}
                                        </button>
                                        {card.testStatus && (
                                            <div className={`status-indicator ${card.testStatus}`}>
                                                {card.testStatus === 'success' ? <p className='text-success m-0 p-0 fw-medium'>Connection Success!!!</p> : <p className='text-danger m-0 p-0 fw-medium'>Connection failed!!!</p>}
                                            </div>
                                        )}
                                        {connectionCards.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-close-card"
                                                onClick={() => removeConnectionCard(card.id)}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="card-content">
                                    <div className="role-theme user-form db-connection-grid">
                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Hostname")} : </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <InputField
                                                    type="text"
                                                    className="backcolorinput"
                                                    placeholder={dt("Enter hostname")}
                                                    name='hostname'
                                                    id={`hostname${card?.id}`}
                                                    value={card?.hostname}
                                                    onChange={(e) => handleDBValueChange(card?.id, e)}
                                                    errorMessage={card?.errors?.hostnameErr}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label pe-0 required-label">{dt("Port")}  : </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <InputField
                                                    type="text"
                                                    className="backcolorinput"
                                                    placeholder={dt("Enter port")}
                                                    name='port'
                                                    id={`port${card?.id}`}
                                                    value={card?.port}
                                                    // onChange={handleValueChange}
                                                    onChange={(e) => handleDBValueChange(card?.id, e)}
                                                    errorMessage={card?.errors?.portErr}
                                                    acceptType="number"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Service Name")} : </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <InputField
                                                    type="text"
                                                    className="backcolorinput"
                                                    placeholder={dt("Enter service name")}
                                                    name='serviceName'
                                                    id={`serviceName${card?.id}`}
                                                    value={card?.serviceName}
                                                    // onChange={handleValueChange}
                                                    onChange={(e) => handleDBValueChange(card?.id, e)}
                                                    errorMessage={card?.errors?.serviceNameErr}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("User Name")} : </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <InputField
                                                    type="text"
                                                    className="backcolorinput"
                                                    placeholder={dt("Enter username")}
                                                    name='softDbUserName'
                                                    id={`softDbUserName${card?.id}`}
                                                    value={card?.softDbUserName}
                                                    // onChange={handleValueChange}
                                                    onChange={(e) => handleDBValueChange(card?.id, e)}
                                                    errorMessage={card?.errors?.softDbUserNameErr}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-5 col-form-label fix-label pe-0 required-label">{dt("Password")} : </label>
                                            <div className="col-sm-7 ps-0 align-content-center">
                                                <div className='d-flex'>
                                                    <span className="input-group-text backcolorinput-icon pointer" id="addon-wrapping" onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ?
                                                            <FontAwesomeIcon icon={faEye} /> :
                                                            <FontAwesomeIcon icon={faEyeSlash} />
                                                        }
                                                    </span>
                                                    <InputField
                                                        type={showPassword ? "text" : "password"}
                                                        className="backcolorinput-icons"
                                                        placeholder={dt("Enter password")}
                                                        name='softDbPassword'
                                                        id={`softDbPassword${card?.id}`}
                                                        value={card?.softDbPassword}
                                                        // onChange={handleValueChange}
                                                        onChange={(e) => handleDBValueChange(card?.id, e)}
                                                        isSpecialChrs={true}
                                                    />
                                                </div>
                                                {card?.errors?.softDbPasswordErr &&
                                                    <div className="required-input">
                                                        {card?.errors?.softDbPasswordErr}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <b><h6 className='header-devider my-2 ps-1'></h6></b>
        </>
    );
};

export default DBConnection;