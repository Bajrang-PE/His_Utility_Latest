const defaultComboOption = { label: 'Please Select', value: 'NA' };

//Dashboard Page Config
const dashboardSettings = [
  { image: '', heading: 'Database Settings', routeKey: 'database-setup' },
  { image: '', heading: 'Widgit Settings', routeKey: 'widgit-master' },
  { image: '', heading: 'Paramaters Settings', routeKey: 'parameter-master' },
  { image: '', heading: 'Drilldown Settings', routeKey: 'drilldown-master' },
  { image: '', heading: 'Links Settings', routeKey: 'link-master' },
  { image: '', heading: 'Tab Settings', routeKey: 'tab-master' },
];

//Saved Data Config
const savedDataSettings = [
  { image: '', heading: 'View Widgits', routeKey: 'widgits' },
  { image: '', heading: 'View Tabs', routeKey: 'tabs' },
  { image: '', heading: 'View Parameters', routeKey: 'parameters' },
];

const databaseTypes = [
  { image: '/postgresql-icon.svg' },
  { image: '/oracle-svgrepo-com.svg' },
];

const databaseFields = [
  'hostname',
  'port',
  'serviceName',
  'userName',
  'password',
];

//Parameter Page Config
const parameterOptions = [
  { label: 'Select an option', value: 'NA' },
  { label: 'Combo', value: 'combo' },
  { label: 'Datepicker', value: 'datePicker' },
  { label: 'Radio', value: 'radio' },
];
const parameterConfigOptions = ['SQL Editor', 'Procedure', 'Manual'];

const parameterGuidelines = [
  `Provided paramerter sql query MUST NOT CONTAIN MORE THAN 2 COLUMNS IN SELECT statement, as one will be used for key and another as value for combo`,
  'If only one column is provided in SELECT then system will by default assume key and value is that one column',
  'Parameters cannot be plugged into tabs/widgits here, to do so you must go to their specific page i.e Widgit Settings / Tab Settings',
  'Label means what will be displayed in UI, value means what will go in backend when user selects an option, CONFIGURE WISELY!',
];

//Widgit Page Config
const WidgitOptions = [
  { label: 'Select an option', value: 'NA' },
  { label: 'Tabular', value: 'table' },
  { label: 'Graph', value: 'graph' },
  { label: 'KPI', value: 'kpi' },
  { label: 'Map', value: 'map' },
  { label: 'News Ticker', value: 'newsTicker' },
  { label: 'I-Frame', value: 'iFrame' },
];

const WidgitGraphOptions = [
  { label: 'Select an option', value: 'NA' },
  { label: 'Column', value: 'column' },
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Area', value: 'area' },
  { label: 'Pie/Donut', value: 'pie' },
];

const widgitConfigOptions = ['SQL Editor', 'Procedure'];

const graphPlugins = [
  { label: 'Highcharts (default)', value: 'highcharts' },
  { label: 'Google Charts', value: 'googleCharts' },
  { label: 'Apache Superset', value: 'superset' },
];

const graphGuidelines = [
  `You CANNOT provide more than 1 column on X-Axis`,
  'Y-Axis CAN HAVE multiple columns, provide them as comma seperated values wrapped around parenthesis like (column1, column2)',
];

//Drilldown Master
const drilldownGuidelines = [
  `You CANNOT EDIT any existing widgits here, to do so you must go to it's specific page`,
  `Provided pk column must be present in parent widgit sql, else drilldown will fail`,
  'Drilldown based on multiple columns must be comma seperated and wrapped around parenthesis like (column1, column2)',
];

//Link master
const linkGuidelines = [
  `You CANNOT EDIT any existing widgits here, to do so you must go to it's specific page`,
  `Provided link column name must be present in parent widgit sql, else hyperlink will fail`,
  'There can only be ONE LINK PER COLUMN in a widgit',
  'Hyperlink cannot have hierarchy levels like drilldown, HYPERLINK CANNOT HAVE A HYPERLINK',
];

const themes = [
  { label: 'Minimalistic (Default)', value: 'minimalistic' },
  { label: 'Glacier Blue', value: 'frostWhite' },
  { label: 'Black Gold', value: 'blackGold' },
  { label: 'Emerald Green', value: 'emeraldGreen' },
];

const themeClasses = {
  frostWhite: [
    'frostWhite__container',
    'frostWhite__container-item',
    'frostWhite__wrapper',
    'frostWhite__container-widgit-wrapper',
    'frostWhite__container-widgit-wrapper--table',
    'frostWhite__popup',
    'frostWhite__popup--close',
    'frostWhite__filter',
  ],
  blackGold: [
    'blackGold__container',
    'blackGold__container-item',
    'blackGold__wrapper',
    'blackGold__container-widgit-wrapper',
    'blackGold__container-widgit-wrapper--table',
    'blackGold__popup',
    'blackGold__popup--close',
    'blackGold__filter',
  ],
  minimalistic: [
    'minimalistic__container',
    'minimalistic__container-item',
    'minimalistic__wrapper',
    'minimalistic__container-widgit-wrapper',
    'minimalistic__container-widgit-wrapper--table',
    'minimalistic__popup',
    'minimalistic__popup--close',
    'minimalistic__filter',
  ],
  emeraldGreen: [
    'emeraldGreen__container',
    'emeraldGreen__container-item',
    'emeraldGreen__wrapper',
    'emeraldGreen__container-widgit-wrapper',
    'emeraldGreen__container-widgit-wrapper--table',
    'emeraldGreen__popup',
    'emeraldGreen__popup--close',
    'emraldGreen__filter',
  ],
};

export {
  dashboardSettings,
  databaseTypes,
  databaseFields,
  parameterOptions,
  parameterConfigOptions,
  WidgitOptions,
  WidgitGraphOptions,
  widgitConfigOptions,
  drilldownGuidelines,
  linkGuidelines,
  graphGuidelines,
  parameterGuidelines,
  defaultComboOption,
  graphPlugins,
  themes,
  themeClasses,
  savedDataSettings,
};
