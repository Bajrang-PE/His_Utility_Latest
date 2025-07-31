import React, { useContext, useState } from 'react'
import { HISContext } from '../../contextApi/HISContext';

const FooterText = (props) => {
    const { footerText } = props;
    const [isShowLegend, setIsShowLegend] = useState(false);
     const {dt } = useContext(HISContext)
    return (
        <>
            {footerText &&
                <div className="tab-footer-box pt-2" >
                    <div className="col-sm-12 pre-nxt-btn">
                        <button className="btn btn-sm" value="Hide Legend" onClick={() => setIsShowLegend(!isShowLegend)} style={{ padding: "2px 5px", borderRadius: "8px" }}>{`${isShowLegend ? dt("Hide Legends") : dt("Show Legends")}`}</button>
                    </div>
                    {isShowLegend &&
                        <div className="col-sm-12 rounded-2 p-2" style={{ border: "1px solid #021623" }}>
                            <div className="footertext">
                                {footerText.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default FooterText
