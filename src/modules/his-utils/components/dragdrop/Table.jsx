const Table = ({ tableData, widgitStyle }) => {
  if (!Array.isArray(tableData) || tableData.length === 0) return null;

  const tableStyles =
    widgitStyle === ''
      ? ['Table__wrapper', 'Table__wrapper--table']
      : widgitStyle;

  const columns = Object.keys(tableData?.at(0));

  return (
    <div className={tableStyles.at(0)}>
      <table className={tableStyles.at(1)}>
        <thead>
          <tr>
            {columns.map((data, index) => {
              return <th key={index}>{data}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData, idx) => {
            return (
              <tr key={idx}>
                {columns.map((row, index) => {
                  return <td key={index}>{rowData[row] || 'NA'}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
