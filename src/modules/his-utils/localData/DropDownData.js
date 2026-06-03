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
    { value: "DUAL_AXES_COLUMN", label: "Dual Axes Column Graph" },

    // --- New Google Charts ---
    { value: "BAR_RACE", label: "Bar Race Graph" },
    { value: "COMBO_CHART", label: "Combo Chart" },
    { value: "BUBBLE_CHART", label: "Bubble Chart" },
    { value: "HISTOGRAM", label: "Histogram" },
    { value: "STEPPED_AREA_GRAPH", label: "Stepped Area Graph" },
    { value: "CANDLESTICK_CHART", label: "Candlestick Chart" },
    { value: "SCATTER_CHART", label: "Scatter Chart" },
    { value: "TREEMAP_CHART", label: "TreeMap Chart" },
    { value: "GEO_CHART", label: "Geo Chart" },
    { value: "CALENDAR_CHART", label: "Calendar Chart" },
    { value: "GANTT_CHART", label: "Gantt Chart" },
    { value: "SANKEY_CHART", label: "Sankey Chart" },
]

export const apacheChartOptions = [
    { value: "GAUGE", label: "Gauge Chart" },
    { value: "3D_BAR", label: "3D Bar Chart" },
    { value: "COLUMN", label: "Column Chart" },
    { value: "BAR", label: "Bar Chart" },
    { value: "LINE", label: "Line Chart" },
    { value: "AREA", label: "Area Chart" },
    { value: "PIE", label: "Pie Chart" },
    { value: "DONUT", label: "Donut Chart" },
]


export const iconImageOptions = [
    { value: "1.jpg", label: "1.jpg" },
    { value: "177780732_iserg-istock-thinkstock.jpg", label: "177780732_iserg-istock-thinkstock.jpg" },
    { value: "1_123125_123073_2279751_2279752_110128_ex_pillstn.jpg.CROP.original-original.jpg", label: "1_123125_123073_2279751_2279752_110128_ex_pillstn.jpg.CROP.original-original.jpg" },
    { value: "2.jpg", label: "2.jpg" },
    { value: "3.jpg", label: "3.jpg" },
    { value: "4.jpg", label: "4.jpg" },
    { value: "5.jpg", label: "5.jpg" },
    { value: "6.jpg", label: "6.jpg" },
    { value: "6.png", label: "6.png" },
    { value: "7.jpg", label: "7.jpg" },
    { value: "8.jpg", label: "8.jpg" },
    { value: "9.jpg", label: "9.jpg" },
    { value: "adult-child.png", label: "adult-child.png" },
    { value: "AggregateDemand.png", label: "AggregateDemand.png" },
    { value: "ambulance.png", label: "ambulance.png" },
    { value: "assets.png", label: "assets.png" },
    { value: "Blood Bank.jpg", label: "Blood Bank.jpg" },
    { value: "blood2.gif", label: "blood2.gif" },
    { value: "Boxes.jpg", label: "Boxes.jpg" },
    { value: "call.png", label: "call.png" },
    { value: "consption3.jpg", label: "consption3.jpg" },
    { value: "consultant.png", label: "consultant.png" },
    { value: "consuptionPattern.jpg", label: "consuptionPattern.jpg" },
    { value: "ConsuptionPattern.png", label: "ConsuptionPattern.png" },
    { value: "consuptionPattern2.jpg", label: "consuptionPattern2.jpg" },
    { value: "default-icon.png", label: "default-icon.png" },
    { value: "demand.png", label: "demand.png" },
    { value: "disease.png", label: "disease.png" },
    { value: "Disease_Profiling.PNG", label: "Disease_Profiling.PNG" },
    { value: "drug.jpg", label: "drug.jpg" },
    { value: "drug.png", label: "drug.png" },
    { value: "drug2.jpg", label: "drug2.jpg" },
    { value: "drug2.png", label: "drug2.png" },
    { value: "drug3.jpg", label: "drug3.jpg" },
    { value: "drug3.png", label: "drug3.png" },
    { value: "drug4.jpg", label: "drug4.jpg" },
    { value: "DrugExpired.png", label: "DrugExpired.png" },
    { value: "drugWithquestion.png", label: "drugWithquestion.png" },
    { value: "Drug_Search.PNG", label: "Drug_Search.PNG" },
    { value: "edl.png", label: "edl.png" },
    { value: "ExcessShortage.png", label: "ExcessShortage.png" },
    { value: "excessShortage2.png", label: "excessShortage2.png" },
    { value: "excess_shortage.gif", label: "excess_shortage.gif" },
    { value: "expired.jpg", label: "expired.jpg" },
    { value: "expired2.jpg", label: "expired2.jpg" },
    { value: "fund.png", label: "fund.png" },
    { value: "globalfund.png", label: "globalfund.png" },
    { value: "HealthFacilityNotConnected.png", label: "HealthFacilityNotConnected.png" },
    { value: "Health_facility.PNG", label: "Health_facility.PNG" },
    { value: "helpline.png", label: "helpline.png" },
    { value: "helpline2.png", label: "helpline2.png" },
    { value: "holiday.png", label: "holiday.png" },
    { value: "hospital-icon.png", label: "hospital-icon.png" },
    { value: "images.png", label: "images.png" },
    { value: "indiaStates.png", label: "indiaStates.png" },
    { value: "InPatient.png", label: "InPatient.png" },
    { value: "Inventory.PNG", label: "Inventory.PNG" },
    { value: "IPD.PNG", label: "IPD.PNG" },
    { value: "lab.png", label: "lab.png" },
    { value: "laboratory_icon.png", label: "laboratory_icon.png" },
    { value: "MIS.PNG", label: "MIS.PNG" },
    { value: "money.jpg", label: "money.jpg" },
    { value: "money.png", label: "money.png" },
    { value: "OPD.PNG", label: "OPD.PNG" },
    { value: "opd2.png", label: "opd2.png" },
    { value: "outPatient.png", label: "outPatient.png" },
    { value: "patient.png", label: "patient.png" },
    { value: "precurement.png", label: "precurement.png" },
    { value: "RateComparison.png", label: "RateComparison.png" },
    { value: "rateContract.png", label: "rateContract.png" },
    { value: "rupeeIndia.png", label: "rupeeIndia.png" },
    { value: "shoppingcart.png", label: "shoppingcart.png" },
    { value: "specialclinic.png", label: "specialclinic.png" },
    { value: "staff.png", label: "staff.png" },
    { value: "State.jpg", label: "State.jpg" },
    { value: "Status.png", label: "Status.png" },
    { value: "stock.jpg", label: "stock.jpg" },
    { value: "stock.png", label: "stock.png" },
    { value: "stock2.jpg", label: "stock2.jpg" },
    { value: "stock3.jpg", label: "stock3.jpg" },
    { value: "stock4.png", label: "stock4.png" },
    { value: "stockout.png", label: "stockout.png" },
    { value: "stockPosition.png", label: "stockPosition.png" },
    { value: "supplyDemand.jpg", label: "supplyDemand.jpg" },
    { value: "supplyDemand2.jpg", label: "supplyDemand2.jpg" },
    { value: "test.png", label: "test.png" },
    { value: "Top_10_Drugs_Consumed.PNG", label: "Top_10_Drugs_Consumed.PNG" },
    { value: "transactionAudit.png", label: "transactionAudit.png" },
    { value: "Transaction_Audit.PNG", label: "Transaction_Audit.PNG" },
    { value: "tree-view-icon.jpg", label: "tree-view-icon.jpg" },
    { value: "Untitled-2.png", label: "Untitled-2.png" },
    { value: "Untitled-4.png", label: "Untitled-4.png" },
    { value: "usaid.png", label: "usaid.png" },
    { value: "world bank.png", label: "world bank.png" },
];

//for grid

export const tablePluginOptions = [
    { value: "datatable", label: "DataTable" },
    { value: "highchartGrid", label: "HighChart Grid" },
];
export const gridThemeOptions = [
    { label: "Default", value: "hcg-theme-default" },
    { label: "Compact", value: "theme-compact" },
    { label: "Dark", value: "theme-dark" },
    { label: "Elegant", value: "theme-elegant" },
    { label: "Colorful", value: "theme-colorful" },
];