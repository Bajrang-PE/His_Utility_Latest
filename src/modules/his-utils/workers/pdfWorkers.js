import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import your Toast if you want to handle errors (optional)
// import { ToastAlert } from "../utils/ToastAlert"; 

self.onmessage = async (e) => {
    const { widgetData, multipleTables, config, visibleColumns, isH2, filters } = e.data;
    try {
        const {
            pdfTheme,
            printPDFIn,
            pdfTableFontSize,
            pdfTableheaderBarColor,
            pdfTableheadingFontColour,
            showFilterDetailsInPDF,
            isReportPrintDateRequired,
            isDirectDownloadRequired,
            rptDisplayName,
            isPdfHeaderReqInAllPages,
            mpFormatColumn
        } = widgetData || {};

        const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, headingAlignment, logos } = config || {};
        const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
        const pdf = new jsPDF(orientation, 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();

        let isTotal = false;

        const stripHtml = (str) => {
            if (!str) return '';
            return str?.replace(/<[^>]*>/g, '')?.trim();
        };

        const drawHeader = (doc) => {
            const logoWidth = 15, logoHeight = 18, margin = 10, textMargin = 10;
            const alignment = headingAlignment?.toLowerCase() || 'center';
            const validLogos = isLogoRequired === 'Yes' && Array.isArray(logos)
                ? logos.filter(logo => !!logo.image)
                : [];

            if (validLogos.length === 1) {
                try {
                    const logoX = pageWidth / 2 - logoWidth / 2;
                    doc.addImage(validLogos[0].image, 'JPEG', logoX, 5, logoWidth, logoHeight);
                } catch (error) { console.error('Error adding single logo:', error); }
            } else if (validLogos.length > 1) {
                validLogos.forEach(logo => {
                    if (!logo.image) return;
                    let logoX, logoY = 5;
                    switch (logo.position?.toLowerCase()) {
                        case 'left': logoX = margin; break;
                        case 'right': logoX = pageWidth - logoWidth - margin; break;
                        default: logoX = pageWidth / 2 - logoWidth / 2;
                    }
                    try { doc.addImage(logo.image, 'JPEG', logoX, logoY, logoWidth, logoHeight); }
                    catch (error) { console.error('Error adding logo:', error); }
                });
            }

            const headerYStart = validLogos.length > 0 ? logoHeight + 10 : 10;
            let headerX;
            switch (alignment) {
                case 'left': headerX = textMargin; break;
                case 'right': headerX = pageWidth - textMargin; break;
                default: headerX = pageWidth / 2;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            let currentY = headerYStart;
            if (reportHeader1) { doc.text(reportHeader1, headerX, currentY, { align: alignment }); currentY += 5; }
            if (reportHeader2) { doc.text(reportHeader2, headerX, currentY, { align: alignment }); currentY += 6; }
            if (reportHeader3) { doc.text(reportHeader3, headerX, currentY, { align: alignment }); currentY += 6; }
            currentY += 5;
            doc.setFontSize(11);
            doc.text(rptDisplayName || 'Report', headerX, currentY, { align: alignment });
            currentY += 8;
            return currentY;
        };

        const headerEndY = drawHeader(pdf);
        let yPosition = headerEndY;

        // Filters
        if (showFilterDetailsInPDF === 'Yes' && filters.length) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            // pdf.text('Filters Applied:', 14, yPosition);
            yPosition += 5;
            filters.forEach((filter) => {
                pdf.text(`${filter.disName}: ${stripHtml(filter.val?.toString() || "")}`, 14, yPosition);
                yPosition += 5;
            });
            // yPosition += 5;
        }
        const maxColsPerPage = 10;

        // ============ CHANGE START: Helper function to calculate totals ============
        const calculateTotals = (tableData, headers) => {
            // Initialize column totals
            const columnTotals = {};
            headers.forEach(header => {
                columnTotals[header.dataKey] = 0;
            });

            // Calculate row totals and column totals
            const rowsWithTotals = tableData.map(row => {
                let rowTotal = 0;
                let hasNumericValues = false;
                const newRow = { ...row };

                headers.forEach(header => {
                    const value = row[header.dataKey];

                    // Try to convert to number if possible
                    if (value !== null && value !== undefined && value !== '') {
                        const numValue = Number(value);
                        if (!isNaN(numValue)) {
                            rowTotal += numValue;
                            columnTotals[header.dataKey] += numValue;
                            hasNumericValues = true;
                        }
                    }
                });

                // Add row total to the row
                newRow.TOTAL = hasNumericValues ? rowTotal : null;
                return newRow;
            });

            // Create total row at the bottom
            const totalRow = {};
            headers.forEach(header => {
                totalRow[header.dataKey] = columnTotals[header.dataKey] || '';
            });

            const grandTotal = Object.values(columnTotals).reduce((sum, val) => sum + val, 0);

            totalRow.TOTAL = grandTotal;

            return {
                rows: rowsWithTotals,
                totalRow: totalRow,
                headers: [...headers, { header: 'TOTAL', dataKey: 'TOTAL', align: 'right' }]
            };
        };
        // ============ CHANGE END: Helper function to calculate totals ============

        // CHANGE START — Loop through each table in multipleTables
        multipleTables.forEach((data, tableIndex) => {
            if (!Array.isArray(data?.data) || data?.data.length === 0) return;

            let tableData = [];

            const columnDefinitions = Array.isArray(visibleColumns[tableIndex])
                ? visibleColumns[tableIndex]
                : visibleColumns;

            if (isH2 === 'Yes') {
                // 🔹 For H2 headers
                const columnNames = columnDefinitions?.map(col =>
                    col.name?.trim() ? `${col?.mainHeader}_${col?.name}` : col?.mainHeader
                );
                tableData = data?.data?.map(row => {
                    const filteredRow = {};
                    columnNames.forEach(key => {
                        if (row.hasOwnProperty(key)) filteredRow[key] = row[key];
                    });
                    return filteredRow;
                });
            } else {
                // 🔹 Normal headers
                const columnNames = columnDefinitions?.map(col => col.name);
                tableData = data?.data?.map(row => {
                    const filteredRow = {};
                    columnNames.forEach(key => {
                        if (row.hasOwnProperty(key)) filteredRow[key] = row[key];
                    });
                    return filteredRow;
                });
            }

            const unwantedKeys = ['pkcolumn'];
            let headers = Object.keys(tableData[0] || {})
                .filter(key => !unwantedKeys.includes(key))
                .map(key => ({ header: key.toString().toUpperCase(), dataKey: key }));



            // ============ CHANGE START: Calculate totals ============
            const { rows: dataWithTotals, totalRow, headers: headersWithTotal } = calculateTotals(tableData, headers);
            if (isTotal) {
                headers = headersWithTotal;
            }
            // ============ CHANGE END: Calculate totals ============


            const columnCount = headers.length;
            const availableWidth = pdf.internal.pageSize.getWidth() - 10;
            // const avgColumnWidth = availableWidth / columnCount;

            const formatSettings = mpFormatColumn?.[tableIndex]?.lstFormatColumn || [];

            // If user defined widths, sum them to calculate proportionate widths
            const totalDefinedWidth = formatSettings.reduce((sum, f) => sum + (parseInt(f.columnWidth) || 0), 0);

            const avgColumnWidth = totalDefinedWidth > 0
                ? availableWidth / totalDefinedWidth
                : availableWidth / columnCount;


            //FOR NOT PAGE BREAK
            headers.forEach(header => { header.width = Math.min(avgColumnWidth); });

            headers.forEach((header, idx) => {
                const format = formatSettings.find(f => parseInt(f.columnNo) === idx + 1);

                //  Calculate actual width from % (if defined)
                const userWidth = parseInt(format?.columnWidth) || (100 / columnCount);
                header.width = (userWidth / 100) * availableWidth;

                //  Apply alignment from format
                header.align = format?.columnAlignment?.toLowerCase() || 'left';
            });





            // const chunkData = tableData.map(row =>
            //     headers.map(header => {
            //         const content = row[header.dataKey];
            //         if (content === null || content === undefined) return '';
            //         if (typeof content === 'object') return JSON.stringify(content);
            //         if (typeof content === 'string' && content.includes('##')) {
            //             const sst = content.split('##')[0];
            //             return stripHtml(sst);
            //         }
            //         //  Strip HTML if string contains tags
            //         if (typeof content === 'string') {
            //             return stripHtml(content);
            //         }
            //         return content.toString();
            //     })
            // );


            // FOR TOTAL COLUMN
            let chunkData = (isTotal ? dataWithTotals : tableData)?.map(row =>
                headers.map(header => {
                    const content = row[header.dataKey];
                    if (content === null || content === undefined || content === '') return '';
                    if (typeof content === 'object') return JSON.stringify(content);
                    if (typeof content === 'string' && content.includes('##')) {
                        const sst = content.split('##')[0];
                        return stripHtml(sst);
                    }
                    if (typeof content === 'string') {
                        return stripHtml(content);
                    }
                    return content.toString();
                })
            );

            // Add total row at the bottom
            const totalRowData = headers.map(header => {
                if (header.dataKey === 'TOTAL') {
                    return 'Total';
                }
                const content = totalRow[header.dataKey];
                if (content === null || content === undefined || content === '') return '';
                if (typeof content === 'object') return JSON.stringify(content);
                if (typeof content === 'string') {
                    return stripHtml(content);
                }
                return content.toString();
            });

            // Add the total row to the data
            if (isTotal) {
                chunkData.push(totalRowData);
            }
            // ============ CHANGE END: Prepare data including totals ============



            pdf.autoTable({
                startY: yPosition,
                // head: [chunkHeaders.map(h => h.header)],//FOR PAGE BREAK
                head: [headers.map(h => h.header)],
                body: chunkData,
                theme: ['grid', 'striped', 'plain'].includes(pdfTheme) ? pdfTheme : 'striped',
                headStyles: {
                    fillColor: pdfTableheaderBarColor || "#000000",
                    textColor: pdfTableheadingFontColour || '#ffffff',
                    fontSize: parseInt(pdfTableFontSize) || 10,
                    fontStyle: 'bold',
                    halign: headingAlignment?.toLowerCase() || 'center',
                    lineWidth: 0.1,
                    lineColor: '#8c8f92',
                },
                bodyStyles: {
                    fontSize: parseInt(pdfTableFontSize) || 10,
                    overflow: 'linebreak',
                    cellPadding: 2,
                    minCellHeight: 8,
                    valign: 'top',
                    textColor: '#000000'
                },
                columnStyles: headers.reduce((styles, header, idx) => {
                    styles[idx] = {
                        cellWidth: header.width,
                        halign: header.align,
                        overflow: 'linebreak',
                        // ============ CHANGE START: Style for total row ============
                        ...(idx === headers.length - 1 && isTotal && {
                            fontStyle: 'bold',
                            fillColor: [240, 240, 240]
                        })
                        // ============ CHANGE END: Style for total row ============
                    };
                    return styles;
                }, {}),
                // ============ CHANGE START: Style for total row ============
                didParseCell: (data) => {
                    // Style the last row (total row) and last column (TOTAL column)
                    if (data.row.index === data.table.body.length - 1 && isTotal) {
                        data.cell.styles.fillColor = [240, 240, 240];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.textColor = [0, 0, 0];
                    }
                    // Style the TOTAL column header
                    if (data.row.index === -1 && data.column.dataKey === 'TOTAL') {
                        data.cell.styles.fillColor = pdfTableheaderBarColor || "#000000";
                        data.cell.styles.textColor = pdfTableheadingFontColour || '#ffffff';
                    }
                },
                // ============ CHANGE END: Style for total row ============
                styles: { overflow: 'linebreak', fontSize: parseInt(pdfTableFontSize), cellPadding: 2 },
                tableWidth: 'auto',
                showHead: isPdfHeaderReqInAllPages === 'Yes' ? 'everyPage' : 'firstPage',
                pageBreak: 'auto',
                margin: { top: isPdfHeaderReqInAllPages === 'Yes' ? 10 : 10, left: 5, right: 10 },
                didDrawPage: (data) => {
                    const pageNumber = data.pageNumber;
                    if (pageNumber === 1 && tableIndex === 0) { //FOR PAGE BREAK   && start === 0
                        drawHeader(pdf);
                    }
                    if (isReportPrintDateRequired === 'Yes') {
                        pdf.setFontSize(9);
                        const reportDate = `Print Date: ${new Date().toLocaleDateString()}`;
                        const textWidth = pdf.getTextWidth(reportDate);
                        pdf.text(reportDate, pageWidth - textWidth - 10, pdf.internal.pageSize.getHeight() - 10);
                    }
                }
            });

            yPosition = pdf.lastAutoTable.finalY + 10; // spacing between tables

        });

        const filterLabels = filters?.map((f) => f.val).join("--") || "report";
        const blob = pdf.output("blob");
        const fileName = `${rptDisplayName}--${filterLabels}.pdf`;

        // Send file back to main thread
        self.postMessage({ success: true, blob, fileName });

    } catch (err) {
        self.postMessage({ success: false, error: err.message });
    }
}