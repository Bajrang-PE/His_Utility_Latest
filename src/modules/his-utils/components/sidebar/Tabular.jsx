import React, { useRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const Tabular = ({
    columns,
    data = [],
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
    mainHeaders = [],
    sortConfig = [],
    onSortConfigChange,
    isRecordsLimitedLineRequired, allData, limit, isFirstRowHeading
}) => {
    const tableRef = useRef();
    const headerRef = useRef();
    const scrollContainerRef = useRef();
    const [tableWidth, setTableWidth] = useState('100%');

    const [sortedData, setSortedData] = useState([]);

    // Helper: Detect date strings like "23-Jul-2025"
    const isDateString = (value) => {
        if (typeof value !== 'string') return false;
        // Match formats like: 23-Jul-2025, 2023-07-23, 07/23/2023, etc.
        return /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value.trim()) ||
            /^\d{4}-\d{1,2}-\d{1,2}$/.test(value.trim()) ||
            /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value.trim());
    };

    // Parse date string to Date object
    const parseDate = (dateStr) => {
        if (dateStr.includes('-') && dateStr.length === 11) { // 23-Jul-2025 format
            const [day, month, year] = dateStr.split('-');
            const monthIndex = new Date(`${month} 1, 2000`).getMonth();
            return new Date(year, monthIndex, day);
        }
        return new Date(dateStr);
    };

    // Handle sort clicks
    const handleSort = (column, sortDirection) => {
        if (typeof column.selector !== 'function') return;

        onSortConfigChange(prev => {
            // Check if this column is already being sorted
            const existingIndex = prev.findIndex(s => s.selector === column.selector);

            if (existingIndex > -1) {
                // If same column clicked again, toggle direction
                if (prev.length === 1) {
                    return [{
                        selector: column.selector,
                        direction: sortDirection
                    }];
                }
                // Remove from sort if already sorted and not the only sort
                return prev.filter(s => s.selector !== column.selector);
            }

            // Add new sort (single sort - replace existing)
            return [{
                selector: column.selector,
                direction: sortDirection
            }];
        });
    };


    useEffect(() => {
        if (!sortConfig || sortConfig.length === 0) {
            setSortedData([...data]);
            return;
        }

        const sorted = [...data].sort((a, b) => {
            for (const config of sortConfig) {
                let col, direction, valA, valB;

                if (isFirstRowHeading === 'Yes' && config.name) {
                    direction = config.direction;
                    col = columns.find(c => c.mainHeader === config.name);
                } else if (config.selector) {
                    direction = config.direction;
                    col = columns.find(c => c.selector === config.selector);
                }

                if (!col) continue;

                valA = col.selector(a);
                valB = col.selector(b);

                // Handle date sorting
                if (isDateString(valA)) {
                    valA = parseDate(valA);
                    valB = isDateString(valB) ? parseDate(valB) : valB;
                }

                // Handle numeric sorting
                if (typeof valA === 'string' && !isNaN(valA)) {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                }

                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(sorted);
    }, [data, sortConfig, columns]);




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
                {mainHeaders?.length > 0 &&
                    <div
                        className='first-head'


                    >
                        <div
                            ref={headerRef}
                            className='second-head'

                        >
                            <CustomTableHeading
                                mainHeaders={mainHeaders}
                                headingBgColor={headingBgColor}
                                headingFontColor={headingFontColor}
                                tableWidth={tableWidth}
                                columns={columns}
                            />
                        </div>
                    </div>}

                <DataTable
                    ref={tableRef}
                    persistTableHead={true}
                    dense
                    // columns={columns}
                    columns={columns?.map(col => ({
                        ...col,
                        name: col.title || col.name
                    }))}
                    // data={data}
                    data={sortedData}
                    sortServer
                    onSort={handleSort}
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
                    noDataComponent={columns?.length > 0 && sortedData?.length === 0 ?

                        <div className="text-center">
                                 <p className="text-center">{'Prepairing data...'}</p>
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        : noDataComponent}
                />
            </div>

            {!pagination && (
                <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                    {`Showing 1 to ${data?.length} of ${data?.length} entries`}<br />
                </div>
            )}
            {(allData?.length > data?.length) && (
                <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                    {`*Records limited to ${limit} out of ${allData?.length}`}<br />
                </div>
            )}
        </div>
    );
};

const CustomTableHeading = ({ mainHeaders, headingBgColor, headingFontColor, tableWidth, columns }) => {
    if (!mainHeaders || mainHeaders.length === 0) return null;

    return (
        <>
            {mainHeaders.map((header, index) => (
                <div
                    key={index}
                    className='third-head'
                    style={{
                        minWidth: `${150 * header?.subHeaders}px`,
                        width: `${(100 / columns?.length) * header?.subHeaders}%`,
                        borderBottom: header?.isSingle ? 'none' : '1px solid #474646',
                    }}
                >

                    <div title={header?.name}>{header?.name}</div>
                </div >
            ))}
        </>
    );
};

export default Tabular;