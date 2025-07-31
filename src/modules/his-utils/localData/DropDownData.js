export const itemForDashboard = [
    { value: "CENTRAL DASHBOARD", label: "CENTRAL DASHBOARD" },
    { value: "V2 CENTRAL DASHBOARD", label: "V2 CENTRAL DASHBOARD" },
    { value: "PM DIALYSIS PROGRAM", label: "PM DIALYSIS PROGRAM" }
]

export const parameterType = [
    { value: '1', label: "Combo" },
    { value: '2', label: "TextBox" },
    { value: '4', label: "Date Pick" },
    { value: '6', label: "CheckBox" },
    { value: '7', label: "Radio Button" }
]

export const parameterWidth = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3 (25% of page width)', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6 (50% of page width)', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
    { label: '11', value: 11 },
    { label: '12 (100% of page width)', value: 12 }
];

export const parameterAlignment = [
    { value: "left" || "Left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" }
]

export const validationType = [
    { value: "1", label: "No Validation" },
    { value: "2", label: "Numeric" },
    { value: "3", label: "Alphanumeric" },
    { value: "4", label: "Letters only" }
]

export const timeOutOptions = [
    { value: 1, label: '1 minute' },
    { value: 2, label: '2 minute' },
    { value: 3, label: '3 minute' },
    { value: 4, label: '4 minute' },
    { value: 5, label: '5 minute' },
    { value: 10, label: '10 minute', selected: true }
];

export const serverName = [
    { value: "WEBSPHERE", label: "WildFly/JBOSS/WebSphere" },
    { value: "TOMCAT", label: "Tomcat" }
]

export const serviceCategories = [
    { value: "Alert Service", label: "Alert Service" },
    { value: "CHI Service", label: "CHI Service" },
    { value: "Dashboard Parameter Data Service", label: "Dashboard Parameter Data Service" },
    { value: "Dashboard Widget Data Service", label: "Dashboard Widget Data Service" },
    { value: "Mobile App Service", label: "Mobile App Service" },
    { value: "Niti Aayog Service", label: "Niti Aayog Service" },
    { value: "O2 Alert services", label: "O2 Alert services" },
];

export const widgetTypeOptions = [
    { value: "columnBased", label: "Column Based" },
    { value: "singleQueryParent", label: "Single Query Parent" },
    { value: "singleQueryChild", label: "Single Query Child" },
];

export const datePickFields = [
    { value: "113", label: "From date", selected: true },
    { value: "116", label: "From date test" },
    { value: "38", label: "Stock Date" },
    { value: "97", label: "test Date" },
    { value: "11600010", label: "testdt" },
    { value: "114", label: "test from date" },
    { value: "115", label: "test from date 2" },
    { value: "117", label: "testing from date" },
    { value: "125", label: "testreactdate1" },
    { value: "126", label: "testreactdate2" },
    { value: "123", label: "To Date" },
];

export const parameterOptions = [
    { value: 1, label: "Hide Parameters" },
    { value: 2, label: "Always Display Parameters" },
    { value: 3, label: "Hide Parameters on Go" },
]

export const widgetRefreshTimeOptions = [
    { value: "0", label: "Not Required" },
    { value: "10000", label: "10 Sec" },
    { value: "30000", label: "30 Sec" },
    { value: "60000", label: "1 Min" },
    { value: "120000", label: "2 Min" },
    { value: "300000", label: "5 Min" },
    { value: "600000", label: "10 Min" },
    { value: "900000", label: "15 Min" },
    { value: "1800000", label: "30 Min" },
];

export const cachingStatusForWidgetOptions = [
    { value: "Cache for All", label: "Cache for All Widget,Parameter,Tab" },
    { value: "Cache Userid Wise", label: "Cache UserId Wise for All Widget,Parameter,Tab" },
    { value: "Cache Seatid Wise", label: "Cache Seatid Wise for All Widget,Parameter,Tab" },
    { value: "Stop Caching", label: "Stop Caching" },
];

export const headingDisplayStyleOptions = [
    { value: "asPerDataFromQuery", label: "As Per Query Result Heading" },
    { value: "allCapitalLetter", label: "All Capital Letter" },
    { value: "initCapitalLetter", label: "Initial Capital Letter" },
];

export const isActionButtonReqOptions = [
    { value: "Yes", label: "All" },
    { value: "pdf", label: "PDF Only" },
    { value: "csv", label: "CSV Only" },
    { value: "pdfAndcsv", label: "PDF and CSV" },
    { value: "advanced", label: "Advanced Options Only" },
    { value: "No", label: "No PDF, CSV or Advanced Options" },
    { value: "None", label: "None" },
];

export const graphOptions = [
    { value: "BAR_GRAPH", label: "Column Bar Graph" },
    { value: "PIE_CHART", label: "Pie Chart" },
    { value: "DONUT_CHART", label: "Donut Chart" },
    { value: "LINE_GRAPH", label: "Line Graph" },
    { value: "AREA_GRAPH", label: "Area Graph" },
    { value: "CANDLE_STICK", label: "Candle Stick Chart" },
    { value: "DUAL_AXES_COLUMN", label: "Dual Axes Column Graph" }
];

export const newsTimeIntervals = [
    { value: "1000", label: "1 Sec" },
    { value: "2000", label: "2 Sec" },
    { value: "3000", label: "3 Sec" },
    { value: "4000", label: "4 Sec" },
    { value: "5000", label: "5 Sec" },
    { value: "10000", label: "10 Sec" },
    { value: "30000", label: "30 Sec" }
];

export const iconType = [
    { value: "IMAGE", label: "Image" },
    { value: "FONT_ICON", label: "Font Icon" },
    { value: "NO_ICON", label: "No Icon Required" },
]

export const kpiTypesold = [
    { value: "rectangle", label: "Rectangle" },
    { value: "rightedge", label: "Right Edge Box" },
    { value: "leftedge", label: "Left Edge Box" },
    { value: "circle", label: "Circle" }
]
export const kpiTypes = [
    { value: "0", label: "Rectangle" },
    { value: "isWidgetForCustomDesign", label: "Right Edge Box" },
    { value: "isWidgetForCustomDesignLeft", label: "Left Edge Box" },
    { value: "isKpiACircle", label: "Circle" }
]

export const kpiBoxClickOptions = [
    { value: '0', label: 'Not Required' },
    { value: 'showTab', label: 'Show Tab' },
    { value: 'showWidget', label: 'Show Widget' },
    { value: 'showDashboard', label: 'Show Dashboard' },
]

export const tabDisplayOptions = [
    { value: 'TOP', label: 'Top Tab' },
    { value: 'SIDE', label: 'Side Tab' },
    // { value: 'BIG_ICON', label: 'Big Icon Tab' },
]

export const dataLoadOptions = [
    { value: "ALL", label: "All configuration on dashboard load" },
    { value: "TAB CLICK", label: "On tab Click" },
    { value: "FIRST TAB", label: "First tab configuration only on dashboard load" }
];

export const tabShapeOptions = [
    { value: "rectangle", label: "rectangle" },
    { value: "rectangle-toprightcurve", label: "rectangle top right" },
    { value: "rectangle-rounded", label: "rectangle-rounded" },
    { value: "circle", label: "circle" },
    { value: "oval", label: "oval" },
    { value: "square", label: "square" },
    { value: "square-rounded", label: "square-rounded" }
];

export const mapNameOptions = [
    { value: "india", label: "India" },
    { value: "andamanandnicobarislands", label: "Andaman and Nicobar Island" },
    { value: "andhrapradesh", label: "Andhra Pradesh" },
    { value: "arunachalpradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chandigarh", label: "Chandigarh" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "dadranagarhaveli", label: "Dadra Nagar Haveli" },
    { value: "delhi", label: "Delhi" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachalpradesh", label: "Himachal Pradesh" },
    { value: "jammuandkashmir", label: "Jammu and Kashmir" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "ladakh", label: "Ladakh" },
    { value: "lakshadweep", label: "Lakshadweep" },
    { value: "madhyapradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "puducherry", label: "Puducherry" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamilnadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "uttarpradesh", label: "Uttar Pradesh" },
    { value: "westbengal", label: "West Bengal" }
];

export const highchartGraphOptions = [
    { value: "BAR_GRAPH", label: "Column Bar Graph" },
    { value: "STACKED_GRAPH", label: "Stacked Graph" },
    { value: "STACKED_BAR_GRAPH", label: "Stacked Bar Graph" },
    { value: "VERTICAL_BAR_GRAPH", label: "Horizontal Bar Graph" },
    { value: "VERTICAL_STACKED_BAR_GRAPH", label: "Horizontal Stacked Bar Graph" },
    { value: "PIE_CHART", label: "Pie Chart" },
    { value: "DONUT_CHART", label: "Donut Chart" },
    { value: "LINE_GRAPH", label: "Line Graph" },
    { value: "AREA_GRAPH", label: "Area Graph" },
    { value: "AREA_STACKED_GRAPH", label: "Stacked Area Graph" },
    { value: "COLUMN_LINE_PIE_GRAPH", label: "Column Line Pie Graph" },
    { value: "DUAL_AXES_LINE_COLUMN", label: "Dual Axes Graph" },
    { value: "BAR_RACE", label: "Bar Race Graph" }
];

export const googleChartOptions = [
    { value: "BAR_GRAPH", label: "Column Bar Graph" },
    { value: "PIE_CHART", label: "Pie Chart" },
    { value: "DONUT_CHART", label: "Donut Chart" },
    { value: "LINE_GRAPH", label: "Line Graph" },
    { value: "AREA_GRAPH", label: "Area Graph" },
    { value: "CANDLE_STICK", label: "Candle Stick Chart" },
    { value: "DUAL_AXES_COLUMN", label: "Dual Axes Column Graph" }
]



