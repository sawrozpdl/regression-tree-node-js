const getValues = (rows) => rows.map((row) => +row[row.length - 1]);

const uniqueValues = (rows, columnIndex) => {
  let unique = new Set();

  rows.forEach((row) => {
    unique.add(row[columnIndex]);
  });

  return [...unique];
};

export { getValues, uniqueValues };
