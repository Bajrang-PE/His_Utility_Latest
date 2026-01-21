const MiniTable = ({ data }) => {
  return (
    <div className="mini-table__wrapper">
      <table className="mini-table__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Column</th>
            <th>Key</th>
            <th>Where Clause Usage</th>
            <th>Like Clause Usage</th>
            <th>Equality Usage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.name}</td>
              <td>{row.col1}</td>
              <td>{row.col2}</td>
              <td>{`WHERE ${row.col1 + ' = ' + row.col2}`}</td>
              <td>{`${row.col1 + ' LIKE ' + '%' + row.col2 + '%'}`}</td>
              <td>{`${row.col2} = <some value>`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { MiniTable };
