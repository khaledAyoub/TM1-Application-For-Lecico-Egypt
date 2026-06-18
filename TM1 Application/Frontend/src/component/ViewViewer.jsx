import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .vv-root {
    font-family: 'Inter', sans-serif;
    background: #F8F9FB;
    color: #1A1D27;
    padding: 24px;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .vv-empty {
    color: #8B90A8;
    font-size: 15px;
    padding: 40px;
    text-align: center;
    border: 1px dashed #C8CCDE;
    border-radius: 8px;
  }

  /* Page filters */
  .vv-page-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  .vv-filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #fff;
    border: 1px solid #D6D9E8;
    border-radius: 6px;
    padding: 6px 13px;
    font-family: 'Inter', sans-serif;
  }

  .vv-filter-label {
    color: #5B6AD0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-size: 11px;
  }

  .vv-filter-value {
    color: #1A1D27;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }

  /* Table wrapper */
  .vv-table-wrapper {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid #D6D9E8;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  /* Table */
  .vv-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    background: #fff;
  }

  /* Header row */
  .vv-table thead tr {
    background: #F1F3FA;
    border-bottom: 1px solid #D6D9E8;
  }

  .vv-th-dim {
    padding: 12px 18px;
    text-align: left;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #5B6AD0;
    border-right: 1px solid #D6D9E8;
    white-space: nowrap;
    border-left: 3px solid #5B6AD0;
  }

  .vv-th-col {
    padding: 12px 18px;
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 13px;
    color: #5B6270;
    border-right: 1px solid #D6D9E8;
    white-space: nowrap;
    min-width: 100px;
  }

  .vv-th-col:last-child {
    border-right: none;
  }

  /* Body rows */
  .vv-table tbody tr {
    border-bottom: 1px solid #ECEEF5;
    transition: background 0.1s ease;
  }

  .vv-table tbody tr:last-child {
    border-bottom: none;
  }

  .vv-table tbody tr:hover {
    background: #F5F6FD;
  }

  .vv-table tbody tr:nth-child(even) {
    background: #FAFBFD;
  }

  .vv-table tbody tr:nth-child(even):hover {
    background: #F5F6FD;
  }

  .vv-td-member {
    padding: 11px 18px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #1A1D27;
    border-right: 1px solid #ECEEF5;
    white-space: nowrap;
    border-left: 3px solid #5B6AD0;
  }

  .vv-td-value {
    padding: 11px 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #3D4260;
    text-align: right;
    border-right: 1px solid #ECEEF5;
    white-space: nowrap;
  }

  .vv-td-value:last-child {
    border-right: none;
  }

  .vv-td-value-empty {
    color: #C0C4D6;
  }
`;

export default function ViewViewer({
  view = {},
  dimensions = [],
  rowDimensions = [],
  columnDimensions = [],
  showContextDimensions = true,
  hideRowHeader = false,
  hideColumnHeader = false,
  className = "",
}) {
  const entries = Object.entries(view);

  if (!entries.length) {
    return (
      <>
        <style>{styles}</style>
        <div className={`vv-root ${className}`}>
          {" "}
          <div className="vv-empty">No data available</div>
        </div>
      </>
    );
  }

  const dimensionIndexes = {};
  dimensions.forEach((dim, index) => {
    dimensionIndexes[dim] = index;
  });

  const rowIndexes = rowDimensions.map((dim) => dimensionIndexes[dim]);
  const columnIndexes = columnDimensions.map((dim) => dimensionIndexes[dim]);

  const pageDimensions = dimensions.filter(
    (dim) => !rowDimensions.includes(dim) && !columnDimensions.includes(dim),
  );

  const firstTuple = entries[0][0].split("|");

  const pageValues = pageDimensions.map((dim) => ({
    dimension: dim,
    value: firstTuple[dimensionIndexes[dim]],
  }));

  const rowKeys = [];
  const columnKeys = [];
  const matrix = {};

  entries.forEach(([key, value]) => {
    const tuple = key.split("|");
    const rowKey = rowIndexes.map((i) => tuple[i]).join("|");
    const columnKey = columnIndexes.map((i) => tuple[i]).join("|");

    if (!rowKeys.includes(rowKey)) rowKeys.push(rowKey);
    if (!columnKeys.includes(columnKey)) columnKeys.push(columnKey);
    if (!matrix[rowKey]) matrix[rowKey] = {};
    matrix[rowKey][columnKey] = value;
  });

  const showHeader = !hideRowHeader || !hideColumnHeader;

  return (
    <>
      <style>{styles}</style>
      <div className={`vv-root ${className}`}>
        {" "}
        {showContextDimensions && pageValues.length > 0 && (
          <div className="vv-page-filters">
            {pageValues.map((item) => (
              <div key={item.dimension} className="vv-filter-chip">
                <span className="vv-filter-label">{item.dimension}</span>
                <span className="vv-filter-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        <div className="vv-table-wrapper">
          <table className="vv-table">
            {showHeader && (
              <thead>
                <tr>
                  {!hideRowHeader &&
                    rowDimensions.map((dim) => (
                      <th key={dim} className="vv-th-dim">
                        {dim}
                      </th>
                    ))}
                  {!hideColumnHeader &&
                    columnKeys.map((colKey) => (
                      <th key={colKey} className="vv-th-col">
                        {colKey}
                      </th>
                    ))}
                </tr>
              </thead>
            )}

            <tbody>
              {rowKeys.map((rowKey) => {
                const rowMembers = rowKey.split("|");
                return (
                  <tr key={rowKey}>
                    {!hideRowHeader &&
                      rowMembers.map((member, index) => (
                        <td key={`${rowKey}-${index}`} className="vv-td-member">
                          {member}
                        </td>
                      ))}
                    {columnKeys.map((colKey) => {
                      const val = matrix[rowKey]?.[colKey];
                      const isEmpty =
                        val === undefined || val === null || val === "";
                      return (
                        <td
                          key={`${rowKey}-${colKey}`}
                          className={`vv-td-value${isEmpty ? " vv-td-value-empty" : ""}`}
                        >
                          {isEmpty ? "—" : val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
