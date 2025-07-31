import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarth, faEye, faFile, faFolderOpen, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { HISContext } from '../../contextApi/HISContext';
import { useContext } from 'react';

const GlobalButtonGroup = (props) => {

    const { isSave, isOpen, isReset, isParams, isWeb, onSave, onOpen, onReset, onParams, onWeb } = props;
    const { dt } = useContext(HISContext);

    return (
        <div className='text-start py-1 global-button-group  border-0'>
            {isSave &&
                <button className='btn btn-sm' onClick={() => onSave()}><FontAwesomeIcon icon={faFile}
                    className="dropdown-gear-icon me-1" />{dt('Save')}</button>}
            {isOpen &&
                <button className='btn btn-sm ms-1' onClick={() => onOpen()}><FontAwesomeIcon icon={faFolderOpen} className="dropdown-gear-icon me-1" />{dt('Open')}</button>
            }
            {isReset &&
                <button className='btn btn-sm ms-1' onClick={() => onReset()}><FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-1" />{dt('Reset')}</button>}
            {isParams &&
                <button className='btn btn-sm ms-1' onClick={() => onParams()}><FontAwesomeIcon icon={faEye} className="dropdown-gear-icon me-1" />{dt('Parameters')}</button>}
            {isWeb &&
                <button className='btn btn-sm ms-1' onClick={() => onWeb()}><FontAwesomeIcon icon={faEarth} className="dropdown-gear-icon me-1" />{dt('Web Services')}</button>}
        </div>
    )
}

export default GlobalButtonGroup
