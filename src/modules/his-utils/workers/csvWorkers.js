import Papa from 'papaparse';

const stripHtml = (str) => {
    if (!str) return '';
    return str?.replace(/<[^>]*>/g, '')?.trim();
};

// ============ CHANGE START: Helper function to calculate totals ============
const calculateTotals = (tableData, headers) => {
    // Initialize column totals
    const columnTotals = {};
    headers.forEach(header => {
        columnTotals[header] = 0;
    });

    // Calculate row totals and column totals
    const rowsWithTotals = tableData.map(row => {
        let rowTotal = 0;
        let hasNumericValues = false;
        const newRow = { ...row };

        headers.forEach(header => {
            const value = row[header];

            // Try to convert to number if possible
            if (value !== null && value !== undefined && value !== '') {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                    rowTotal += numValue;
                    columnTotals[header] += numValue;
                    hasNumericValues = true;
                }
            }
        });

        // Add row total to the row
        newRow.TOTAL = hasNumericValues ? rowTotal : '';
        return newRow;
    });

    // Create total row at the bottom
    const totalRow = {};
    headers.forEach(header => {
        totalRow[header] = columnTotals[header] || '';
    });

    // Calculate total of all column totals
    const grandTotal = Object.values(columnTotals).reduce((sum, val) => sum + val, 0);

    // Add "Total" label in the TOTAL column
    totalRow.TOTAL = 'Total';

    // Clear the first column value
    // const firstColumn = headers[0];
    // if (firstColumn) {
    //     totalRow[firstColumn] = '';
    // }

    return {
        rows: rowsWithTotals,
        totalRow: totalRow,
        headers: [...headers, 'TOTAL']
    };
};
// ============ CHANGE END: Helper function to calculate totals ============

self.onmessage = (e) => {
    try {
        const { widgetData, multipleTables, config, visibleColumns, isH2, filters } = e.data;
        const { rptDisplayName } = widgetData;
        const { reportHeader1, reportHeader2, reportHeader3 } = config || {};
        const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

        let isTotal = false;

        let finalData = [];

        // Heading section (only once at the top)
        finalData.push([reportHeader1 || '']);
        finalData.push([reportHeader2 || '']);
        finalData.push([reportHeader3 || '']);
        finalData.push([rptDisplayName || 'Report Title']);
        finalData.push([]);
        finalData.push([`Date: ${currentDate}`]);
        finalData.push([]);

        if (filters?.length) {
            filters.forEach(filter => {
                finalData.push([`${filter.disName}: ${stripHtml(filter.val?.toString()||"")}`]);
            });
            finalData.push([]); // extra empty line after filters
        }

        multipleTables.forEach((tableObj, tableIndex) => {
            const { data, title } = tableObj;

            if (!Array.isArray(data) || data.length === 0) {
                // finalData.push([`Table ${tableIndex + 1}: ${title || ''}`]);
                finalData.push(['No Data Available']);
                finalData.push([]);
                return;
            }

            // Use columns specific to this table
            const currentColumns = Array.isArray(visibleColumns[tableIndex])
                ? visibleColumns[tableIndex]
                : visibleColumns;

            let columnNames;
            if (isH2 === 'Yes') {
                columnNames = currentColumns?.map(col =>
                    col.name?.trim() ? `${col?.mainHeader}_${col?.name}` : col?.mainHeader
                );
            } else {
                columnNames = currentColumns?.map(col => col.name);
            }

            const unwantedKeys = ['pkcolumn'];
            let tableHeaders = columnNames.filter(col => !unwantedKeys.includes(col));

            // ============ CHANGE START: Calculate totals ============
            const { rows: dataWithTotals, totalRow, headers: headersWithTotal } = calculateTotals(data, tableHeaders);
            if (isTotal) {
                tableHeaders = headersWithTotal;
            }
            // ============ CHANGE END: Calculate totals ============

            // Add headings
            finalData.push(tableHeaders);

            // Add rows
            // data.forEach(row => {
            //     const filteredRow = tableHeaders.map(header => {
            //         const content = row[header];
            //         if (content === null || content === undefined) return '';
            //         if (typeof content === 'object') return JSON.stringify(content);
            //         if (typeof content === 'string') {
            //             if (content.includes('##')) {
            //                 return stripHtml(content.split('##')[0]);
            //             }
            //             return stripHtml(content);
            //         }
            //         return content.toString();
            //     });
            //     finalData.push(filteredRow);
            // });

            (isTotal ? dataWithTotals : data)?.forEach(row => {
                const filteredRow = tableHeaders.map(header => {
                    const content = row[header];
                    if (content === null || content === undefined) return '';
                    if (typeof content === 'object') return JSON.stringify(content);
                    if (typeof content === 'string') {
                        if (content.includes('##')) {
                            return stripHtml(content.split('##')[0]);
                        }
                        return stripHtml(content);
                    }
                    return content.toString();
                });
                finalData.push(filteredRow);
            });

            const totalRowData = tableHeaders.map(header => {
                const content = totalRow[header];
                if (content === null || content === undefined) return '';
                if (typeof content === 'object') return JSON.stringify(content);
                if (typeof content === 'string') {
                    return stripHtml(content);
                }
                return content.toString();
            });
            if (isTotal) {
                finalData.push(totalRowData);
            }
            // ============ CHANGE END: Add total row ============

            finalData.push([]); // spacing
            finalData.push([]); // spacing
        });
        const csvContent = Papa.unparse(finalData, { skipEmptyLines: false });
        const filterLabels = filters?.map((f) => f.val).join("--") || "report";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        self.postMessage({
            success: true,
            blob,
            fileName: `${rptDisplayName}--${filterLabels}.csv`,
        });
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
}