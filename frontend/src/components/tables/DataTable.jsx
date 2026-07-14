function DataTable({ columns, data }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#FFF",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              style={{
                textAlign: "left",
                padding: "16px",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {row.map((item, i) => (
              <td
                key={i}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #F1F5F9",
                }}
              >
                {item}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;