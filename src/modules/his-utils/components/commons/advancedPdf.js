import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { ToastAlert } from '../../utils/commonFunction';

export const generatePDF1 = async (widgetData, tableData, config, filters = []) => {
  if (!widgetData) return;

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
    isPdfHeaderReqInAllPages
  } = widgetData;

  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment, logos, logoCounts } = config;

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();

  // Function to draw the header
  const drawHeader = (doc, title) => {

    if (isLogoRequired) {
      const logoWidth = 15;
      const logoHeight = 18;
      const logoX = 40;
      const logoY = 10;

      doc.addImage(logoImage, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    }

    doc.setFontSize(12);
    doc.setFont('bold');


    doc.text(reportHeader1, pageWidth / 2, 15, { align: headingAlignment.toLowerCase() });
    doc.text(reportHeader2, pageWidth / 2, 20, { align: headingAlignment.toLowerCase() });
    doc.text(reportHeader3, pageWidth / 2, 25, { align: headingAlignment.toLowerCase() });

    // rptDisplayName (Dynamic Title Below Static Header)
    doc.setFontSize(11);
    doc.setFont('bold');
    doc.text(rptDisplayName || 'Report', pageWidth / 2, 35, { align: 'center' });
  };

  // Initial Header Drawing for First Page
  drawHeader(pdf);

  let yPosition = 45;

  // Filters Section
  if (showFilterDetailsInPDF === 'Yes' && filters.length) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Filters Applied:', 14, yPosition);
    yPosition += 5;
    filters.forEach((filter) => {
      pdf.text(`${filter.label}: ${filter.value}`, 14, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // Prepare headers for autoTable
  const headers = Object.keys(tableData[0] || {}).map((key) => ({
    header: key.toUpperCase(),
    dataKey: key
  }));

  pdf.autoTable({
    startY: yPosition,
    head: [headers.map((h) => h.header)],
    body: tableData.map((row) => headers.map((h) => row[h.dataKey])),
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

      if (pageNumber === 1 || isPdfHeaderReqInAllPages === 'Yes') {
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

  if (isDirectDownloadRequired === 'Yes') {
    pdf.save(`${rptDisplayName || 'report'}.pdf`);
  } else {
    pdf.output('dataurlnewwindow');
  }
};

export const generatePDFff = async (widgetData, data, config, visibleColumns, isH2, filters = []) => {
  if (!widgetData) return;
  if (!Array.isArray(data) || data.length === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }

  let tableData = [];


  if (isH2 === 'Yes') {
    // Extract column definitions and names from visibleColumns
    const columnDefinitions = visibleColumns;
    const columnNames = columnDefinitions?.map(col => col.name?.trim() ? `${col?.mainHeader}_${col?.name}` : col?.mainHeader);

    // Filter the data to only include visible columns
    tableData = data?.map(row => {
      const filteredRow = {};
      columnNames.forEach(key => {
        if (row.hasOwnProperty(key)) {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });

  } else {
    // Extract column definitions and names from visibleColumns
    const columnDefinitions = visibleColumns;
    const columnNames = columnDefinitions?.map(col => col.name);

    // Filter the data to only include visible columns
    tableData = data?.map(row => {
      const filteredRow = {};
      columnNames.forEach(key => {
        if (row.hasOwnProperty(key)) {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });
  }

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
    isPdfHeaderReqInAllPages
  } = widgetData || {};


  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, headingAlignment, logos } = config || {};

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');
  const margin = 10;////////
  const pageWidth = pdf.internal.pageSize.getWidth();

  const drawHeader = (doc) => {
    const logoWidth = 15;
    const logoHeight = 18;
    const margin = 10;
    const textMargin = 10;
    const alignment = headingAlignment?.toLowerCase();

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
  let yPosition = headerEndY;

  // Filters Section
  if (showFilterDetailsInPDF === 'Yes' && filters.length) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Filters Applied:', 14, yPosition);
    yPosition += 5;
    filters.forEach((filter) => {
      pdf.text(`${filter.label}: ${filter.value}`, 14, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }
  const unwantedKeys = ['pkcolumn'];
  // Prepare headers for autoTable
  // const headers = Object.keys(tableData[0] || {}).map(key => ({
  //   header: key.toString().toUpperCase(),
  //   dataKey: key
  // }));

  const headers = Object.keys(tableData[0] || {})
    .filter(key => !unwantedKeys.includes(key))
    .map(key => ({
      header: key.toString().toUpperCase(),
      dataKey: key
    }));

  const columnCount = headers.length;
  // Calculate total width needed
  // const totalWidth = headers.reduce((sum, h) => sum + h.width, 0);
  // const scaleFactor = Math.min(1, (pageWidth - 2 * margin) / totalWidth);
  // const avgColumnWidth = pdf.internal.pageSize.getWidth() / columnCount;
  const availableWidth = pdf.internal.pageSize.getWidth() - 10; // 10 left + 15 right margin
  const avgColumnWidth = availableWidth / columnCount;
  // Apply scaling if needed
  headers.forEach(header => {
    // header.width *= scaleFactor;
    header.width = Math.min(avgColumnWidth);
  });

  pdf.autoTable({
    startY: yPosition,
    head: [headers.map((h) => h.header)],
    body: tableData.map(row =>
      headers.map(header => {
        // Format cell content
        const content = row[header.dataKey];
        if (content === null || content === undefined) return '';
        if (typeof content === 'object') return JSON.stringify(content);
        if (typeof content === 'string' && content.includes('##')) {
          const parts = content.split('##');
          return parts[0];
        }
        return content.toString();
      })
    ),
    theme: ['grid', 'striped', 'plain'].includes(pdfTheme) ? pdfTheme : 'striped',
    headStyles: {
      fillColor: pdfTableheaderBarColor || "#000000",
      textColor: pdfTableheadingFontColour || '#ffffff',
      fontSize: parseInt(pdfTableFontSize) || 10,
      fontStyle: 'bold',
      halign: 'center',
      lineWidth: 0.1,        // Border thickness
      lineColor: '#8c8f92',  // Border color (white in this case)
    },
    bodyStyles: {
      fontSize: parseInt(pdfTableFontSize) || 10,
      overflow: 'linebreak',
      cellPadding: 2,    // Better cell padding
      minCellHeight: 8,  // Minimum row height
      valign: 'top'   // Vertical alignment
    },
    columnStyles: headers.reduce((styles, header, idx) => {
      styles[idx] = {
        cellWidth: header.width,
        halign: 'left'
      };
      return styles;
    }, {}),
    styles: {
      overflow: 'linebreak',     // Ensures text wraps
      fontSize: parseInt(pdfTableFontSize),
      cellPadding: 2             // Better spacing
    },
    tableWidth: 'auto',
    showHead: 'everyPage',
    pageBreak: 'auto',
    margin: { top: isPdfHeaderReqInAllPages === 'Yes' ? 50 : 10, left: 5, right: 10 },
    didDrawPage: (data) => {
      const pageNumber = data.pageNumber;

      if (pageNumber === 1 || isPdfHeaderReqInAllPages === 'Yes') {
        drawHeader(pdf);
      }

      // Print Date in Bottom Right Corner (on every page if required)
      if (isReportPrintDateRequired === 'Yes') {
        pdf.setFontSize(9);
        const reportDate = `Print Date: ${new Date().toLocaleDateString()}`;
        const textWidth = pdf.getTextWidth(reportDate);
        pdf.text(reportDate, pageWidth - textWidth - 10, pdf.internal.pageSize.getHeight() - 10);
      }

    }
  });

  if (isDirectDownloadRequired === 'Yes') {
    pdf.save(`${rptDisplayName || 'report'}.pdf`);
  } else {
    // pdf.output('dataurlnewwindow');

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    // Clean up after 10 seconds
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);

  }
};

export const generatePDF = async (widgetData, multipleTables, config, visibleColumns, isH2, filters = []) => {
  if (!widgetData) return;
  if (!Array.isArray(multipleTables) || multipleTables.length === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }


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
      pdf.text(`${filter.disName}: ${filter.val}`, 14, yPosition);
      yPosition += 5;
    });
    // yPosition += 5;
  }
  const maxColsPerPage = 10;
  // CHANGE START — Loop through each table in multipleTables
  multipleTables.forEach((data, tableIndex) => {
    if (!Array.isArray(data?.data) || data?.data.length === 0) return;

    let tableData = [];

    const columnDefinitions = Array.isArray(visibleColumns[tableIndex])
      ? visibleColumns[tableIndex]
      : visibleColumns;

    // if (isH2 === 'Yes') {
    //   const columnDefinitions = visibleColumns;
    //   const columnNames = columnDefinitions?.map(col => col.name?.trim() ? `${col?.mainHeader}_${col?.name}` : col?.mainHeader);
    //   tableData = data?.data?.map(row => {
    //     const filteredRow = {};
    //     columnNames.forEach(key => { if (row.hasOwnProperty(key)) filteredRow[key] = row[key]; });
    //     return filteredRow;
    //   });
    // } else {
    //   const columnDefinitions = visibleColumns;
    //   const columnNames = columnDefinitions?.map(col => col.name);
    //   tableData = data?.data?.map(row => {
    //     const filteredRow = {};
    //     columnNames.forEach(key => { if (row.hasOwnProperty(key)) filteredRow[key] = row[key]; });
    //     return filteredRow;
    //   });
    // }

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
    const headers = Object.keys(tableData[0] || {})
      .filter(key => !unwantedKeys.includes(key))
      .map(key => ({ header: key.toString().toUpperCase(), dataKey: key }));


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


    const stripHtml = (str) => {
      if (!str) return '';
      return str.replace(/<[^>]*>/g, '').trim();
    };


    const chunkData = tableData.map(row =>
      headers.map(header => {
        const content = row[header.dataKey];
        if (content === null || content === undefined) return '';
        if (typeof content === 'object') return JSON.stringify(content);
        if (typeof content === 'string' && content.includes('##')) {
          const sst = content.split('##')[0];
          return stripHtml(sst);
        }
        //  Strip HTML if string contains tags
        if (typeof content === 'string') {
          return stripHtml(content);
        }
        return content.toString();
      })
    );



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
        styles[idx] = { cellWidth: header.width, halign: header.align, overflow: 'linebreak', };
        return styles;
      }, {}),
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
        // if (isPdfHeaderReqInAllPages === 'Yes') {
        //   drawHeader(pdf);
        // } else if (pageNumber === 1 && tableIndex === 0) {
        //   drawHeader(pdf);
        // }
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
  // CHANGE END


  // if (isDirectDownloadRequired === 'Yes') {
  const filterLabels = filters?.map(f => f.val).join("--") || "report";
  pdf.save(`${rptDisplayName}--${filterLabels}.pdf`);
  ToastAlert('Report Downloaded', 'success');

};

export const generatePDFbg = async (widgetData, tableData, config, filters = []) => {
  if (!widgetData) return;

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
    isPdfHeaderReqInAllPages
  } = widgetData;

  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment, logos, logoCounts } = config;

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const drawHeader = (doc) => {
    const logoWidth = 15;
    const logoHeight = 18;
    const margin = 10;
    const textMargin = 10;
    const logoSpacing = 5; // Added spacing between logos

    // Always reserve space for logos even if they're not present
    const hasLeftLogo = isLogoRequired === 'Yes' && logos?.some(logo =>
      logo.position.toLowerCase() === 'left' && logo.image
    );
    const hasRightLogo = isLogoRequired === 'Yes' && logos?.some(logo =>
      logo.position.toLowerCase() === 'right' && logo.image
    );
    const hasTopLogo = isLogoRequired === 'Yes' && logos?.some(logo =>
      logo.position.toLowerCase() === 'top' && logo.image
    );

    // Draw logos if present
    if (isLogoRequired === 'Yes' && logos?.length) {
      logos.forEach(logo => {
        if (!logo.image) return;

        let logoX, logoY;

        switch (logo.position.toLowerCase()) {
          case 'top':
            logoX = pageWidth / 2 - logoWidth / 2;
            logoY = 5;
            break;
          case 'left':
            logoX = margin;
            logoY = 5;
            break;
          case 'right':
            logoX = pageWidth - logoWidth - margin;
            logoY = 5;
            break;
          default:
            logoX = pageWidth / 2 - logoWidth / 2;
            logoY = margin;
        }

        try {
          doc.addImage(logo.image, 'JPEG', logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error adding logo:', error);
        }
      });
    }

    // Calculate starting Y position - always reserve space if logo positions are configured
    const headerYStart = (isLogoRequired === 'Yes' && hasTopLogo) ?
      logoHeight + 10 :
      (isLogoRequired === 'Yes' && (hasLeftLogo || hasRightLogo)) ?
        25 : // Reserve space for side logos even if not present
        15;

    const alignment = headingAlignment.toLowerCase();

    // Adjust header position based on logo presence
    let headerX;
    switch (alignment) {
      case 'left':
        headerX = hasLeftLogo ? margin + logoWidth + logoSpacing : textMargin;
        break;
      case 'right':
        headerX = hasRightLogo ? pageWidth - logoWidth - margin - logoSpacing : pageWidth - textMargin;
        break;
      case 'center':
      default:
        headerX = pageWidth / 2;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    doc.text(reportHeader1, headerX, headerYStart, { align: alignment });
    doc.text(reportHeader2, headerX, headerYStart + 5, { align: alignment });
    doc.text(reportHeader3, headerX, headerYStart + 10, { align: alignment });

    doc.setFontSize(11);
    doc.text(rptDisplayName || 'Report', headerX, headerYStart + 17, { align: alignment });

    return headerYStart + 25; // Added extra space to ensure consistent layout
  };

  const headerEndY = drawHeader(pdf);
  let yPosition = headerEndY + 5;

  // Rest of the function remains the same...
  // Filters Section
  if (showFilterDetailsInPDF === 'Yes' && filters.length) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Filters Applied:', 14, yPosition);
    yPosition += 5;
    filters.forEach((filter) => {
      pdf.text(`${filter.label}: ${filter.value}`, 14, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // Prepare headers for autoTable
  const headers = Object.keys(tableData[0] || {}).map((key) => ({
    header: key.toUpperCase(),
    dataKey: key
  }));

  pdf.autoTable({
    startY: yPosition,
    head: [headers.map((h) => h.header)],
    body: tableData.map((row) => headers.map((h) => row[h.dataKey])),
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

      if (pageNumber === 1 || isPdfHeaderReqInAllPages === 'Yes') {
        drawHeader(pdf);
      }

      if (isReportPrintDateRequired === 'Yes') {
        pdf.setFontSize(10);
        const reportDate = `Print Date: ${new Date().toLocaleDateString()}`;
        const textWidth = pdf.getTextWidth(reportDate);
        pdf.text(reportDate, pageWidth - textWidth - 10, pdf.internal.pageSize.getHeight() - 10);
      }
    }
  });

  if (isDirectDownloadRequired === 'Yes') {
    pdf.save(`${rptDisplayName || 'report'}.pdf`);
  } else {
    pdf.output('dataurlnewwindow');
  }
};

export const generateGraphPDF = async (widgetData, tableData, config, visibleColumns, sortConfig, filters = []) => {
  if (!widgetData) return;

  if (!Array.isArray(tableData[0]?.seriesData) || tableData[0].seriesData === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }

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
    pdf.text('Filters Applied:', 14, yPosition);
    yPosition += 5;
    filters.forEach((filter) => {
      pdf.text(`${filter.disName}: ${filter.val}`, 14, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  const tabData = [];

  //  Pick only visible columns, in same order
  const selectedHeaders = (visibleColumns?.length > 0
    ? visibleColumns.map(c => c.name)
    : [xAxisLabel, ...tableData[0].seriesData.map(s => s.name)]
  );

  //  Build row objects first (so we can sort easily)
  let rows = tableData[0].categories.map((category, index) => {
    const rowObj = {};
    selectedHeaders.forEach(h => {
      if (h === xAxisLabel) {
        rowObj[h] = category;
      } else {
        const series = tableData[0].seriesData.find(s => s.name === h);
        rowObj[h] = series ? (series.data[index] || 0) : '';
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

  // if (isDirectDownloadRequired === 'Yes') {
  const filterLabels = filters?.map(f => f.val).join("--") || "report";
  pdf.save(`${rptDisplayName}--${filterLabels}.pdf`);
  // pdf.save(`${rptDisplayName || 'report'}.pdf`);
  // } else {
  //   pdf.output('dataurlnewwindow');
  // }
};

export const generateCSVfff = (widgetData, multipleTables, config, visibleColumns, isH2) => {
  if (!Array.isArray(multipleTables) || multipleTables.length === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }

  if (!widgetData) return;

  let tableData = [];

  if (isH2 === 'Yes') {
    // Extract column definitions and names from visibleColumns
    const columnDefinitions = visibleColumns;
    const columnNames = columnDefinitions?.map(col => col.name?.trim() ? `${col?.mainHeader}_${col?.name}` : col?.mainHeader);

    // Filter the data to only include visible columns
    tableData = data?.map(row => {
      const filteredRow = {};
      columnNames.forEach(key => {
        if (row.hasOwnProperty(key)) {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });

  } else {
    // Extract column definitions and names from visibleColumns
    const columnDefinitions = visibleColumns;
    const columnNames = columnDefinitions?.map(col => col.name);

    // Filter the data to only include visible columns
    tableData = data?.map(row => {
      const filteredRow = {};
      columnNames.forEach(key => {
        if (row.hasOwnProperty(key)) {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });
  }

  const { rptDisplayName } = widgetData || {};
  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment } = config || {};
  const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

  const heading = [
    [reportHeader1],
    [reportHeader2],
    [reportHeader3],
    [rptDisplayName || 'Report Title'],
    [],
    [],
    [`Date: ${currentDate}`],
    []
  ];

  const unwantedKeys = ['pkcolumn'];

  const tableHeaders = Object.keys(tableData[0] || {}).filter(key => !unwantedKeys.includes(key));

  const tableRows = tableData.map(row =>
    tableHeaders.map(header => {
      const content = row[header];
      if (content === null || content === undefined) return '';
      if (typeof content === 'object') return JSON.stringify(content);
      if (typeof content === 'string' && content.includes('##')) {
        return content.split('##')[0];
      }
      return content.toString();
    })
  );

  const finalData = [
    ...heading,
    tableHeaders,
    ...tableRows
  ];

  const csvContent = Papa.unparse(finalData, { skipEmptyLines: false });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${rptDisplayName || 'report'}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateCSV11 = (widgetData, multipleTables, config, visibleColumns, isH2, filters) => {
  if (!Array.isArray(multipleTables) || multipleTables.length === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }

  const stripHtml = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
  };

  if (!widgetData) return;

  const { rptDisplayName } = widgetData;
  const { reportHeader1, reportHeader2, reportHeader3 } = config || {};
  const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

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
    // finalData.push(['Filters Applied:']);
    filters.forEach(filter => {
      finalData.push([`${filter.disName}: ${filter.val}`]);
    });
    finalData.push([]); // extra empty line after filters
  }

  // Loop through each table
  // multipleTables.forEach((tableObj, tableIndex) => {
  //   const { data, title } = tableObj;

  //   if (!Array.isArray(data) || data.length === 0) {
  //     finalData.push([`Table ${tableIndex + 1}: ${title || ''}`]);
  //     finalData.push(['No Data Available']);
  //     finalData.push([]);
  //     return;
  //   }

  //   // Get columns
  //   let columnNames;
  //   if (isH2 === 'Yes') {
  //     columnNames = visibleColumns?.map(col =>
  //       col.name?.trim() ? `${col?.mainHeader}_${col?.name}` : col?.mainHeader
  //     );
  //   } else {
  //     columnNames = visibleColumns?.map(col => col.name);
  //   }

  //   const unwantedKeys = ['pkcolumn'];
  //   const tableHeaders = columnNames.filter(col => !unwantedKeys.includes(col));

  //   // Add column headings
  //   finalData.push(tableHeaders);

  //   const stripHtml = (str) => {
  //     if (!str) return '';
  //     return str.replace(/<[^>]*>/g, '').trim();
  //   };


  //   // Add rows
  //   data.forEach(row => {
  //     // const filteredRow = tableHeaders.map(header => {
  //     //   const content = row[header];
  //     //   if (content === null || content === undefined) return '';
  //     //   if (typeof content === 'object') return JSON.stringify(content);
  //     //   if (typeof content === 'string' && content.includes('##')) {
  //     //     return content.split('##')[0];
  //     //   }
  //     //   return content.toString();
  //     // });
  //     const filteredRow = tableHeaders.map(header => {
  //       const content = row[header];
  //       if (content === null || content === undefined) return '';
  //       if (typeof content === 'object') return JSON.stringify(content);
  //       if (typeof content === 'string') {
  //         if (content.includes('##')) {
  //           return stripHtml(content.split('##')[0]);
  //         }
  //         return stripHtml(content);
  //       }
  //       return content.toString();
  //     });


  //     finalData.push(filteredRow);
  //   });

  //   // Add an empty line after each table
  //   finalData.push([]);
  // });

  multipleTables.forEach((tableObj, tableIndex) => {
    const { data, title } = tableObj;

    if (!Array.isArray(data) || data.length === 0) {
      // finalData.push([`Table ${tableIndex + 1}: ${title || ''}`]);
      finalData.push(['No Data Available']);
      finalData.push([]);
      return;
    }

    // 🔹 Use columns specific to this table
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
    const tableHeaders = columnNames.filter(col => !unwantedKeys.includes(col));

    // Add headings
    // finalData.push([`Table ${tableIndex + 1}: ${title || ''}`]);
    finalData.push(tableHeaders);

    // Add rows
    data.forEach(row => {
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

    finalData.push([]); // spacing
    finalData.push([]); // spacing
  });


  // Convert to CSV
  const csvContent = Papa.unparse(finalData, { skipEmptyLines: false });
  const filterLabels = filters?.map(f => f.val).join("--");

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${rptDisplayName}--${filterLabels}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateGraphCSV11 = (widgetData, data, config, visibleColumns, sortConfig, filters) => {
  if (!widgetData) return;

  const { rptDisplayName, xAxisLabel, yAxisLabel } = widgetData || {};
  const { reportHeader1, reportHeader2, reportHeader3, headingAlignment } = config || {};
  const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');


  // Prepare heading
  const heading = [
    [reportHeader1],
    [reportHeader2],
    [reportHeader3],
    [rptDisplayName || 'Report Title'],
    [''],
    [''],
    [`Date: ${currentDate}`],
    ['']
  ];

  if (filters?.length) {
    heading.push(['Filters Applied:']);
    filters.forEach(filter => {
      heading.push([`${filter.disName}: ${filter.val}`]);
    });
    heading.push([]); // extra empty line after filters
  }

  let csvContent;

  // Handle graph data (state-wise facilities)
  if (!data[0].categories || data[0].categories.length === 0 ||
    !data[0].seriesData || data[0].seriesData.length === 0 ||
    !data[0].seriesData[0].data) {
    ToastAlert('No graph data available to download.', 'warning');
    return;
  }

  const selectedHeaders =
    visibleColumns?.length > 0
      ? visibleColumns.map((c) => c.name)
      : [xAxisLabel, ...data[0].seriesData.map((s) => s.name)];

  let rows = data[0].categories.map((category, index) => {
    const rowObj = {};
    selectedHeaders.forEach((h) => {
      if (h === xAxisLabel) {
        rowObj[h] = category;
      } else {
        const series = data[0].seriesData.find((s) => s.name === h);
        rowObj[h] = series ? series.data[index] || 0 : "";
      }
    });
    return rowObj;
  });

  if (sortConfig?.length > 0) {
    sortConfig.forEach((sortRule) => {
      rows.sort((a, b) => {
        if (a[sortRule.name] < b[sortRule.name])
          return sortRule.direction === "asc" ? -1 : 1;
        if (a[sortRule.name] > b[sortRule.name])
          return sortRule.direction === "asc" ? 1 : -1;
        return 0;
      });
    });
  }

  const rowsArray = rows.map((rowObj) =>
    selectedHeaders.map((h) => rowObj[h])
  );

  const finalData = [...heading, selectedHeaders, ...rowsArray];

  csvContent = Papa.unparse(finalData, {
    skipEmptyLines: false,
    quotes: true
  });

  const filterLabels = filters?.map(f => f.val).join("--") || "report";

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  // link.setAttribute('download', `${rptDisplayName || 'report'}.csv`);
  link.setAttribute('download', `${rptDisplayName}--${filterLabels}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ------------------------------------------------------XLSX----------------------------

export const generateCSV = async (
  widgetData,
  multipleTables,
  config,
  visibleColumns,
  isH2,
  filters
) => {
  if (!Array.isArray(multipleTables) || multipleTables.length === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }

  if (!widgetData) return;

  const stripHtml = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
  };

  const { rptDisplayName, mpFormatColumn } = widgetData;

  const {
    reportHeader1,
    reportHeader2,
    reportHeader3,
    headingAlignment
  } = config || {};

  const safeAlignment = headingAlignment?.toLowerCase() || 'left';

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  const maxColumnCount = Math.max(
    ...multipleTables.map((_, tableIndex) => {
      const cols = Array.isArray(visibleColumns?.[tableIndex])
        ? visibleColumns[tableIndex]
        : visibleColumns || [];
      return cols.filter(c => c?.name !== 'pkcolumn').length;
    })
  );

  let currentRow = 1;
  let fixedLeftEndRow = 0;
  const headerRowStart = currentRow;
  [
    reportHeader1,
    reportHeader2,
    reportHeader3,
    rptDisplayName
  ].filter(Boolean).forEach(text => {
    const rowNumber = currentRow++;
    worksheet.mergeCells(rowNumber, 1, rowNumber, maxColumnCount);
    const cell = worksheet.getCell(rowNumber, 1);
    cell.value = text;
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };

    fixedLeftEndRow = rowNumber;
  });
  const headerRowEnd = fixedLeftEndRow;

  // Date
  const dateRow = worksheet.getRow(currentRow++);
  dateRow.getCell(1).value =
    `Date: ${new Date().toLocaleDateString('en-GB')} ` +
    `${new Date().toLocaleTimeString('en-GB')}`;
  dateRow.getCell(1).alignment = { horizontal: 'left' };
  dateRow.getCell(1).font = { bold: true };
  fixedLeftEndRow = dateRow.number;

  // currentRow++; 

  // FILTERS

  if (filters?.length) {
    filters.forEach(filter => {
      if (filter?.disName && filter?.val) {
        const row = worksheet.getRow(currentRow++);
        row.getCell(1).value = `${filter.disName}: ${filter.val}`;
        row.getCell(1).alignment = { horizontal: 'left' };
        row.getCell(1).font = { bold: true };
        fixedLeftEndRow = row.number;
      }
    });
    // currentRow++;
  }

  currentRow++;

  // TABLES
  multipleTables.forEach((tableObj, tableIndex) => {
    const { data } = tableObj;

    if (!Array.isArray(data) || data.length === 0) {
      worksheet.getRow(currentRow++).getCell(1).value = 'No Data Available';
      currentRow += 2;
      return;
    }

    const currentColumns = Array.isArray(visibleColumns[tableIndex])
      ? visibleColumns[tableIndex]
      : visibleColumns;

    let columnNames;
    if (isH2 === 'Yes') {
      columnNames = currentColumns.map(col =>
        col.name?.trim()
          ? `${col.mainHeader}_${col.name}`
          : col.mainHeader
      );
    } else {
      columnNames = currentColumns.map(col => col.name);
    }

    const tableHeaders = columnNames.filter(col => col !== 'pkcolumn');

    const formatSettings =
      mpFormatColumn?.[tableIndex]?.lstFormatColumn || [];

    // APPLY COLUMN FORMAT
    tableHeaders.forEach((_, idx) => {
      const format = formatSettings.find(
        f => parseInt(f.columnNo) === idx + 1
      );

      worksheet.getColumn(idx + 1).width =
        parseInt(format?.columnWidth) || 15;

      worksheet.getColumn(idx + 1).alignment = {
        horizontal: format?.columnAlignment?.toLowerCase() || safeAlignment
      };
    });

    // HEADER ROW
    const headerRow = worksheet.getRow(currentRow++);
    tableHeaders.forEach((header, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = header;
      cell.font = { bold: true };
    });

    // DATA ROWS
    data.forEach(rowData => {
      const row = worksheet.getRow(currentRow++);
      tableHeaders.forEach((header, i) => {
        let value = rowData[header];

        if (value === null || value === undefined) value = '';
        else if (typeof value === 'object') value = JSON.stringify(value);
        else if (typeof value === 'string') {
          value = value.includes('##')
            ? stripHtml(value.split('##')[0])
            : stripHtml(value);
        }

        row.getCell(i + 1).value = value;
      });
    });

    for (let r = headerRowStart; r <= headerRowEnd; r++) {
      worksheet.getRow(r).getCell(1).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
    }

    // Left-align Date & Filters ONLY
    for (let r = headerRowEnd + 1; r <= fixedLeftEndRow; r++) {
      worksheet.getRow(r).getCell(1).alignment = {
        horizontal: 'left'
      };
    }

    currentRow += 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const filterLabels = filters?.map(f => f.val).filter(Boolean).join('--');
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${rptDisplayName}${filterLabels ? `--${filterLabels}` : ''}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateGraphCSV = async (
  widgetData,
  data,
  config,
  visibleColumns,
  sortConfig,
  filters
) => {
  if (!widgetData) return;

  const { rptDisplayName, xAxisLabel } = widgetData || {};
  const {
    reportHeader1,
    reportHeader2,
    reportHeader3,
    headingAlignment
  } = config || {};

  const safeAlignment = headingAlignment?.toLowerCase() || 'left';

  const currentDate =
    new Date().toLocaleDateString('en-GB') +
    ' ' +
    new Date().toLocaleTimeString('en-GB');

  if (
    !data?.[0]?.categories?.length ||
    !data?.[0]?.seriesData?.length ||
    !data[0].seriesData[0].data
  ) {
    ToastAlert('No graph data available to download.', 'warning');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Graph Report');

  let currentRow = 1;
  let fixedLeftEndRow = 0;
  const headerRowStart = currentRow;

  const maxColumnCount = Math.max(data?.[0]?.seriesData?.length);

  [
    reportHeader1,
    reportHeader2,
    reportHeader3,
    rptDisplayName || 'Report'
  ].filter(Boolean).forEach(text => {
    const rowNumber = currentRow++;
    worksheet.mergeCells(rowNumber, 1, rowNumber, maxColumnCount + 1);
    const cell = worksheet.getCell(rowNumber, 1);
    cell.value = text;
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };

    fixedLeftEndRow = rowNumber;
  });

  const headerRowEnd = fixedLeftEndRow;

  // currentRow += 2;

  const dateRow = worksheet.getRow(currentRow++);
  dateRow.getCell(1).value = `Date: ${currentDate}`;
  dateRow.getCell(1).alignment = { horizontal: safeAlignment };
  dateRow.getCell(1).font = { bold: true };

  // currentRow++;


  if (filters?.length) {
    filters.forEach(filter => {
      if (filter?.disName && filter?.val) {
        const r = worksheet.getRow(currentRow++);
        r.getCell(1).value = `${filter.disName}: ${filter.val}`;
        r.getCell(1).alignment = { horizontal: safeAlignment };
        r.getCell(1).font = { bold: true };
      }
    });
    // currentRow++;
  }

  currentRow++;

  const selectedHeaders =
    visibleColumns?.length > 0
      ? visibleColumns.map(c => c.name)
      : [
        xAxisLabel,
        ...data[0].seriesData.map(s => s.name)
      ];

  const headerRow = worksheet.getRow(currentRow++);
  selectedHeaders.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true };
    cell.alignment = { horizontal: safeAlignment };
  });


  let rows = data[0].categories.map((category, index) => {
    const rowObj = {};
    selectedHeaders.forEach(h => {
      if (h === xAxisLabel) {
        rowObj[h] = category;
      } else {
        const series = data[0].seriesData.find(s => s.name === h);
        rowObj[h] = series ? series.data[index] || 0 : '';
      }
    });
    return rowObj;
  });

  if (sortConfig?.length > 0) {
    sortConfig.forEach(sortRule => {
      rows.sort((a, b) => {
        if (a[sortRule.name] < b[sortRule.name])
          return sortRule.direction === 'asc' ? -1 : 1;
        if (a[sortRule.name] > b[sortRule.name])
          return sortRule.direction === 'asc' ? 1 : -1;
        return 0;
      });
    });
  }

  rows.forEach(rowObj => {
    const row = worksheet.getRow(currentRow++);
    selectedHeaders.forEach((h, i) => {
      row.getCell(i + 1).value = rowObj[h];
      row.getCell(i + 1).alignment = { horizontal: safeAlignment };
    });
  });

  for (let r = headerRowStart; r <= headerRowEnd; r++) {
    worksheet.getRow(r).getCell(1).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
  }

  // Left-align Date & Filters ONLY
  for (let r = headerRowEnd + 1; r <= fixedLeftEndRow; r++) {
    worksheet.getRow(r).getCell(1).alignment = {
      horizontal: 'left'
    };
  }


  const filterLabels = filters?.map(f => f.val).filter(Boolean).join('--');

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${rptDisplayName}${filterLabels ? `--${filterLabels}` : ''}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



