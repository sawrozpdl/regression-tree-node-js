import { log } from "./string.js";

/**
 * Gets the values for each row in the data.
 *
 * @param {Array<Array<String>>} rows
 */
const getValues = (rows) => rows.map((row) => +row[row.length - 1]);

/**
 * Gives out the unique properties of a certain column.
 *
 * @param {Array<Array<String>>} rows
 * @param {Number} columnIndex
 */
const uniqueValues = (rows, columnIndex) => {
  let unique = new Set();

  rows.forEach((row) => {
    unique.add(row[columnIndex]);
  });

  return [...unique];
};

/**
 * Recursively logs the JSON object into the console.
 *
 * @param {Object} object
 * @param {Number} depth
 */
const logJson = (object, depth = 1) => {
  if (depth === 1) console.log("{");
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (typeof value === "object") {
      log(depth, `${key} : {`);
      logJson(value, depth + 1);
      log(depth, "}");
    } else {
      log(depth, `${key} : ${value}`);
    }
  });
  if (depth === 1) console.log("}");
};

export { getValues, uniqueValues, logJson };
