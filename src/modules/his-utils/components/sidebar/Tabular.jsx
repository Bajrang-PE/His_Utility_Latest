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
    theme, noDataComponent
}) => {

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: headingBgColor,
                color: headingFontColor,
                textAlign: headingAlignment,
                fontWeight: "bold",
                padding: "10px",
            },
        },
        table: {
            style: {
                borderBottom: '1px solid #ccc',
                overflowX: 'auto',
            },
        },
    };

    return (
        <div>
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
                // customStyles={{
                //     ...customStyles,
                //     table: {
                //         style: {
                //             borderBottom: '1px solid #ccc',
                //         }
                //     }
                // }}
                 customStyles={customStyles}
                responsive
                noTableHead={isTableHeadingRequired}
                theme={theme === 'Dark' ? 'dark' : 'default'}
                noDataComponent={noDataComponent}

            />

            {!pagination && (
                <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                    {`Showing 1 to ${data.length} of ${data.length} entries`}
                </div>
            )}
        </div>
    )
}

export default Tabular
