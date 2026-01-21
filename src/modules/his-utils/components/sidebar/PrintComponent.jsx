import React, { useEffect, useRef } from "react";
import Tabular from "./Tabular";
import './print.css';


const PrintComponent = ({
    filterColumns,
    visibleColumns,
    widgetData = {},
    multipleTables = [],
    config = {},
    filters = [],
    onReady
}) => {
    const {
        rptDisplayName = "",
        showFilterDetailsInPDF,
        isReportPrintDateRequired = "Yes",
        isFirstRowColumnName,
        headingBackgroundColour,
        headingFontColour
    } = widgetData || {};

    const reportRef = useRef()

    const {
        reportHeader1 = "",
        reportHeader2 = "",
        reportHeader3 = "",
        isLogoRequired = "Yes",
        headingAlignment = "center",
        logos = [],
    } = config || {};


    const leftLogos = Array.isArray(logos) && logos?.filter(l => l.position === "left" && l?.image);
    const rightLogos = Array.isArray(logos) && logos?.filter(l => l.position === "right" && l?.image);
    const centerLogos = Array.isArray(logos) && logos?.filter(l => l.position === "center" && l?.image);

    useEffect(() => {
        // when data rendered completely → notify parent tab
        if (filterColumns(multipleTables[0]?.columns, visibleColumns, isFirstRowColumnName)?.length > 0 && multipleTables[0]?.data?.length > 0) {
            const loader = document.getElementById("print-loader");
            if (loader) {
                loader?.remove();
            }
            onReady && onReady();
        } else if (multipleTables[0]?.columns?.length === 0) {
            onReady && onReady();
        }
    }, [multipleTables]);


    return (
        <div style={styles.container} ref={reportRef}>


            {/* <div className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={printReport}>
                <FontAwesomeIcon icon={faPrint} className="dropdown-gear-icon me-2" /></div> */}

            {/* <div ref={reportRef}> */}
            <div style={styles.headerWrapper}>
                {isLogoRequired === "Yes" &&
                    <div style={styles.logoContainer}>
                        <div style={styles.leftGroup}>
                            {leftLogos?.map((l, i) => <img key={i} src={l.image} style={styles.logo} />)}
                        </div>

                        <div style={styles.centerGroup}>
                            {centerLogos?.map((l, i) => <img key={i} src={l.image} style={styles.logo} />)}
                        </div>

                        <div style={styles.rightGroup}>
                            {rightLogos?.map((l, i) => <img key={i} src={l.image} style={styles.logo} />)}
                        </div>
                    </div>
                }

                {/* HEADERS */}
                <div style={{ textAlign: headingAlignment?.toLowerCase() || "center" }}>
                    {reportHeader1 && <div style={styles.headerLine}>{reportHeader1}</div>}
                    {reportHeader2 && <div style={styles.headerLine}>{reportHeader2}</div>}
                    {reportHeader3 && <div style={styles.headerLine}>{reportHeader3}</div>}
                    <h6 style={{ marginTop: 10 }}>
                        <b> {rptDisplayName || "Report"}</b>
                    </h6>
                </div>
            </div>

            {/* ================= FILTERS SECTION ================= */}
            {showFilterDetailsInPDF === "Yes" && filters?.length > 0 && (
                <div style={styles.filterSection}>
                    <ul>
                        {filters?.map((f, i) => (
                            <li key={i} className="fs-13" style={{ listStyle: "none" }}>
                                <span>{f?.disName}:</span> {f?.val}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* REPORT DATE */}
            {isReportPrintDateRequired === "Yes" && (
                <div className="text-end m-2" style={styles.printDate}>
                    <b> Print Date:  {new Date().toLocaleDateString()}</b>
                </div>
            )}

            {/* ================= TABLES SECTION ================= */}
            <div>
                {multipleTables?.map((table, index) => {

                    return (
                        <>
                            <Tabular
                                key={index}
                                columns={filterColumns(table?.columns, visibleColumns, isFirstRowColumnName)}
                                data={table?.data || []}
                                pagination={false}
                                headingFontColor={headingFontColour || "#ffffff"}
                                headingBgColor={headingBackgroundColour || "#000000"}
                                theme={'dark'}
                                isFirstRowHeading={isFirstRowColumnName}
                                fixedHeader={false}
                            />

                        </>
                    )
                })
                }
            </div>
        </div>
        // </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial",
        padding: 20,
    },
    headerWrapper: {
        marginBottom: 20,
    },
    headerLine: {
        fontSize: 16,
        fontWeight: 600,
    },
    logoRow: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginBottom: 10,
    },
    filterSection: {
        marginBottom: 10,
    },
    printDate: {
        marginBottom: 10,
        fontWeight: 400,
        fontSize: "13px"
    },
    tableWrapper: {
        marginBottom: 20,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    logoContainer: {
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        marginBottom: 15
    },
    leftGroup: {
        display: "flex",
        gap: 10
    },
    rightGroup: {
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
    },
    centerGroup: {
        display: "flex",
        justifyContent: "center",
        gap: 10
    },
    logo: {
        width: 50,
        height: 50,
        objectFit: "contain"
    }
};

export default PrintComponent;
