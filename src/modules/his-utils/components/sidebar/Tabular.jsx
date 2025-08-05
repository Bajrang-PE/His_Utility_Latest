import React from 'react'
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

    const customStyles = {
        head: {
            style: {
                zIndex: 2
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
            },
        },
        table: {
            style: {
                borderBottom: '1px solid #ccc',
                // overflowX: 'auto',
            },
        },
    };

    return (
        <div>
            {mainHeaders && <CustomTableHeading mainHeaders={mainHeaders} />}
            <DataTable
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
                responsive
                noTableHead={isTableHeadingRequired}
                theme={theme === 'Dark' ? 'dark' : 'default'}
                noDataComponent={noDataComponent}

            />

            {!pagination && (
                <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                    {`Showing 1 to ${data.length} of ${data.length} entries`}<br />
                    {/* {`*Showing 1 to ${data.length} of ${data.length}`} */}
                </div>
            )}
        </div>
    )
}

export default Tabular


const CustomTableHeading = ({ mainHeaders }) => {
    if (!mainHeaders || mainHeaders.length === 0) return null;

    return (
        <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'your_header_bg_color' }}>
            <div style={{ display: 'flex' }}>
                {mainHeaders?.length > 0 && mainHeaders.map((header, index) => (
                    <div
                        key={index}
                        style={{
                            flex: header.subHeaders,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            borderRight: '1px solid #474646',
                            padding: '10px',
                            color: 'your_heading_font_color',
                            backgroundColor: 'your_heading_bg_color',
                        }}
                    >
                        {header.name}
                    </div>
                ))}
            </div>
        </div>
    );
};
