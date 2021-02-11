import fs from "fs";

/**
 * Splits the string considering the ignoring character.
 *
 * @param {String} str
 * @param {String} by
 * @param {String} limit
 */
function smartSplit(str, by, limit) {
  let ignore = false;
  const acc = [];
  let checkpoint = 0;

  str = str + by;
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if (char === limit && i > 0 && str.charAt(i - 1) !== "\\") {
      ignore = !ignore;
      continue;
    }
    if (char === by && !ignore) {
      const offset = str.charAt(i - 1) === limit ? 1 : 0;

      acc.push(str.substring(checkpoint + offset, i - offset));
      checkpoint = i + 1;
    }
  }

  return acc;
}

/**
 * Removes unnecessary line breaks from strings.
 *
 * @param {String} str
 */
function cleanString(str) {
  return str ? str.replace(/[\r\n]+/gm, "") : str;
}

/**
 * Converts the CSV string to data structure.
 *
 * @param {String} csv
 * @param {Boolean} objectMode
 * @param {Array<String>} dataHeaders
 */
export function csvToDS(csv, objectMode = true, dataHeaders = null) {
  const [firstLine, ...lines] = csv.split("\n");

  const tableHeaders = firstLine.split(",");

  const keys =
    dataHeaders && dataHeaders.length === tableHeaders.length
      ? dataHeaders
      : tableHeaders;

  return objectMode
    ? lines.map((line) =>
        ((values) =>
          keys.reduce(
            (acc, curr, index) => ({
              ...acc,
              [curr]: cleanString(values[index]) || null,
            }),
            {}
          ))(smartSplit(line, ",", '"'))
      )
    : [keys, lines.map((line) => smartSplit(line, ",", '"'))];
}

/**
 * Reads the file from given location as text.
 *
 * @param {String} path
 */
export function readFileAsText(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
}
