import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import your Toast if you want to handle errors (optional)
// import { ToastAlert } from "../utils/ToastAlert"; 

self.onmessage = async (e) => {
    const { widgetData, tableData, config, visibleColumns, sortConfig, filters = [] } = e?.data;
    
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
            xAxisLabel,
            yAxisLabel
        } = widgetData || {};
        const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment, logos, logoCounts } = config || {};

        const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
        const pdf = new jsPDF(orientation, 'mm', 'a4');
        const margin = 10;////////
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const drawHeader = (doc) => {
            const logoWidth = 15;
            const logoHeight = 18;
            const margin = 10;
            const textMargin = 10;
            const alignment = headingAlignment?.toLowerCase() || 'center';

            // Filter valid logos
            const validLogos = isLogoRequired === 'Yes' && Array.isArray(logos)
                ? logos.filter(logo => !!logo.image)
                : [];

            // Handle logos
            if (validLogos.length === 1) {
                // Single logo - center
                try {
                    const logoX = pageWidth / 2 - logoWidth / 2;
                    doc.addImage(validLogos[0].image, 'JPEG', logoX, 5, logoWidth, logoHeight);
                } catch (error) {
                    console.error('Error adding single logo:', error);
                }
            } else if (validLogos.length > 1) {
                validLogos.forEach(logo => {
                    if (!logo.image) return;

                    let logoX, logoY = 5;

                    switch (logo.position?.toLowerCase()) {
                        case 'left':
                            logoX = margin;
                            break;
                        case 'right':
                            logoX = pageWidth - logoWidth - margin;
                            break;
                        case 'top':
                        default:
                            logoX = pageWidth / 2 - logoWidth / 2;
                    }

                    try {
                        doc.addImage(logo.image, 'JPEG', logoX, logoY, logoWidth, logoHeight);
                    } catch (error) {
                        console.error('Error adding logo:', error);
                    }
                });
            }

            // Adjust Y position if logos exist
            const headerYStart = validLogos.length > 0 ? logoHeight + 10 : 10;

            // Determine x-position based on alignment
            let headerX;
            switch (alignment) {
                case 'left':
                    headerX = textMargin;
                    break;
                case 'right':
                    headerX = pageWidth - textMargin;
                    break;
                case 'center':
                default:
                    headerX = pageWidth / 2;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');

            // Draw dynamic headers
            let currentY = headerYStart;
            if (reportHeader1) {
                doc.text(reportHeader1, headerX, currentY, { align: alignment });
                currentY += 5;
            }
            if (reportHeader2) {
                doc.text(reportHeader2, headerX, currentY, { align: alignment });
                currentY += 5;
            }
            if (reportHeader3) {
                doc.text(reportHeader3, headerX, currentY, { align: alignment });
                currentY += 5;
            }

            // Draw report display name
            doc.setFontSize(11);
            doc.text(rptDisplayName || 'Report', headerX, currentY + 1, { align: alignment });
            currentY += 5;

            return currentY;
        };
        const headerEndY = drawHeader(pdf);
        let yPosition = headerEndY + 5;

        // Filters Section
        if (showFilterDetailsInPDF === 'Yes' && filters.length) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            // pdf.text('Filters Applied:', 14, yPosition);
            yPosition += 5;
            filters.forEach((filter) => {
                pdf.text(`${filter.disName}: ${filter.val}`, 14, yPosition);
                yPosition += 5;
            });
            yPosition += 5;
        }

        const tabData = [];

        //  Pick only visible columns, in same order
        const firstClmName = tableData[0]?.seriesData[0]?.lebel || xAxisLabel;
        const selectedHeaders = (visibleColumns?.length > 0
            ? visibleColumns.map(c => c.name)
            : [firstClmName, ...tableData[0].seriesData.map(s => s.name)]
        );

        //  Build row objects first (so we can sort easily)
        let rows = tableData[0].categories.map((category, index) => {
            const rowObj = {};
            selectedHeaders.forEach(h => {
                if (h === firstClmName) {
                    rowObj[h] = category;
                } else {
                    const series = tableData[0].seriesData.find(s => s.name === h);
                    rowObj[h] = series ? (series.data[index]?.y || 0) : '';
                }
            });
            return rowObj;
        });

        //  Apply sorting if sortConfig exists
        if (sortConfig?.length > 0) {
            sortConfig.forEach(sortRule => {
                rows.sort((a, b) => {
                    if (a[sortRule.name] < b[sortRule.name]) return sortRule.direction === 'asc' ? -1 : 1;
                    if (a[sortRule.name] > b[sortRule.name]) return sortRule.direction === 'asc' ? 1 : -1;
                    return 0;
                });
            });
        }

        //  Convert sorted row objects to tabData array format
        rows.forEach(rowObj => {
            const rowArray = selectedHeaders.map(h => rowObj[h]);
            tabData.push(rowArray);
        });

        const headers = selectedHeaders;


        pdf.autoTable({
            startY: yPosition,
            head: [headers],
            body: tabData,
            theme: ['grid', 'striped', 'plain'].includes(pdfTheme) ? pdfTheme : 'striped',
            headStyles: {
                fillColor: pdfTableheaderBarColor || "#000000",
                textColor: pdfTableheadingFontColour || '#ffffff',
                fontSize: parseInt(pdfTableFontSize) || 10
            },
            bodyStyles: {
                fontSize: parseInt(pdfTableFontSize) || 10
            },
            styles: {
                overflow: 'linebreak',
            },
            margin: { top: isPdfHeaderReqInAllPages === 'Yes' ? 50 : 10, left: 5, right: 5 },
            didDrawPage: (data) => {
                const pageNumber = data.pageNumber;

                // if (pageNumber === 1 || isPdfHeaderReqInAllPages === 'Yes') {
                //   drawHeader(pdf);
                // }
                if (isPdfHeaderReqInAllPages === 'Yes') {
                    drawHeader(pdf);
                } else if (pageNumber === 1) {
                    drawHeader(pdf);
                }

                // Print Date in Bottom Right Corner (on every page if required)
                if (isReportPrintDateRequired === 'Yes') {
                    pdf.setFontSize(10);
                    const reportDate = `Print Date: ${new Date().toLocaleDateString()}`;
                    const textWidth = pdf.getTextWidth(reportDate);
                    pdf.text(reportDate, pageWidth - textWidth - 10, pdf.internal.pageSize.getHeight() - 10);
                }

            }
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