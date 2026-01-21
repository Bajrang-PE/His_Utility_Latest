import Papa from 'papaparse';

self.onmessage = (e) => {
    try {
        const { widgetData, data, config, visibleColumns, sortConfig, filters } = e.data;
        const { rptDisplayName, xAxisLabel, yAxisLabel } = widgetData || {};
        const { reportHeader1, reportHeader2, reportHeader3 } = config || {};
        const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

        // Prepare heading
        let heading = [];

        // Heading section (only once at the top)
        heading.push([]);
        reportHeader1 && heading.push([reportHeader1 || '']);
        reportHeader2 && heading.push([reportHeader2 || '']);
        reportHeader3 && heading.push([reportHeader3 || '']);
        heading.push([rptDisplayName || 'Report Title']);
        heading.push([]);
        heading.push([`Date: ${currentDate}`]);
        heading.push([]);

        if (filters?.length) {
            filters.forEach(filter => {
                heading.push([`${filter.disName}: ${filter.val}`]);
            });
            heading.push([]);
        }

        let csvContent;

        const firstClmName = data[0]?.seriesData[0]?.lebel || xAxisLabel;
        const selectedHeaders =
            visibleColumns?.length > 0
                ? visibleColumns.map((c) => c.name)
                : [firstClmName, ...data[0].seriesData.map((s) => s.name)];

        let rows = data[0].categories.map((category, index) => {
            const rowObj = {};
            selectedHeaders.forEach((h) => {
                if
                    (h === firstClmName) {
                    rowObj[h] = category;
                } else {
                    const series = data[0].seriesData.find((s) => s.name === h);
                    rowObj[h] = series ? series.data[index]?.y || 0 : "";
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
        // const csvContent = Papa.unparse(finalData, { skipEmptyLines: false });
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