import React, { useRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const Tabular = ({
    columns,
    data,
    pagination,
    recordsPerPage,
    fixedHeader,
    scrollHeight,
    headingFontColor,
    headingBgColor,
    headingAlignment,
    recordsPerPageOptions,
    isTableHeadingRequired,
    theme,
    noDataComponent,
    mainHeaders = []
}) => {
    const tableRef = useRef();
    const headerRef = useRef();
    const scrollContainerRef = useRef();
    const [tableWidth, setTableWidth] = useState('100%');

    useEffect(() => {
        if (mainHeaders && mainHeaders.length > 0) {
            const totalWidth = mainHeaders.reduce((sum, header) => sum + (header.subHeaders * 150), 0);
            setTableWidth(`${totalWidth}px`);
        }
    }, [mainHeaders]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const header = headerRef.current;

        if (!scrollContainer || !header) return;

        const handleScroll = (e) => {
            header.scrollLeft = e.target.scrollLeft;
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    const customStyles = {
        head: {
            style: {
                zIndex: 2,
                padding: 0,
                minHeight: '0px',
            },
        },
        headCells: {
            style: {
                backgroundColor: headingBgColor,
                color: headingFontColor,
                textAlign: headingAlignment,
                fontWeight: "bold",
                padding: "10px",
                borderRight: '1px solid #474646',
                borderBottom: '1px solid #474646',
                minWidth: '150px',
            },
        },
        table: {
            style: {
                borderBottom: '1px solid #ccc',
                minWidth: tableWidth,
            },
        },
    };

    console.log(columns, 'columns')

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden'
        }}>
            <div
                ref={scrollContainerRef}
                style={{
                    overflowX: 'auto',
                    width: '100%',
                    position: 'relative'
                }}
            >
                <div
                    // style={{
                    //     position: 'sticky',
                    //     top: 0,
                    //     zIndex: 3,
                    //     width: tableWidth,
                    // }}
                    className='first-head'


                >
                    <div
                        ref={headerRef}
                        // style={{
                        //     overflow: 'hidden',
                        //     width: '100%',
                        //     backgroundColor: headingBgColor
                        // }}
                        className='second-head'

                    >
                        {mainHeaders && <CustomTableHeading
                            mainHeaders={mainHeaders}
                            headingBgColor={headingBgColor}
                            headingFontColor={headingFontColor}
                            tableWidth={tableWidth}
                            columns={columns}
                        />}
                    </div>
                </div>

                <DataTable
                    ref={tableRef}
                    persistTableHead={true}
                    dense
                    columns={columns}
                    data={data}
                    pagination={pagination}
                    fixedHeader={fixedHeader}
                    fixedHeaderScrollHeight={scrollHeight + 'px'}
                    paginationPerPage={recordsPerPage}
                    paginationRowsPerPageOptions={recordsPerPageOptions}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    responsive={false}
                    noTableHead={isTableHeadingRequired}
                    theme={theme === 'Dark' ? 'dark' : 'default'}
                    noDataComponent={noDataComponent}
                />
            </div>

            {!pagination && (
                <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                    {`Showing 1 to ${data.length} of ${data.length} entries`}<br />
                </div>
            )}
        </div>
    );
};

const CustomTableHeading = ({ mainHeaders, headingBgColor, headingFontColor, tableWidth, columns }) => {
    if (!mainHeaders || mainHeaders.length === 0) return null;

    return (
        // <div className='' style={{
        //     display: 'flex',
        //     width: tableWidth,
        //     backgroundColor: headingBgColor
        // }}>
        <>
            {mainHeaders.map((header, index) => (
                // <div
                //     style={{
                //         width: `${(100 / columns.length) * header.subHeaders}%`
                //     }}
                // >
                <div
                    key={index}
                    className='third-head'
                    style={{
                        // flex: `${header.subHeaders} 0 auto`,
                        minWidth: `${150 * header.subHeaders}px`,
                        width: `${(100 / columns.length) * header.subHeaders}%`
                        // fontWeight: 'bold',
                        // textAlign: 'center',
                        // borderRight: '1px solid #474646',
                        // padding: '10px',
                        // color: headingFontColor,
                        // borderBottom: header.isSingle ? 'none' : '1px solid #474646',
                        // boxSizing: 'border-box',
                    }}
                >

                    {header.name}
                </div >
                // </div>
            ))}
        </>
        // </div>
    );
};

export default Tabular;