import { average, cov, standardDeviation } from "./utils/math.js";
import { getValues, uniqueValues } from "./utils/data.js";
import * as file from "./utils/file.js";
import { isNumber } from "./utils/string.js";

async function main() {
  const TRAINING_DATA_PATH = "./data/train.csv";
  const TESTING_DATA_PATH = "./data/test.csv";

  const rawData = await file.readFileAsText(TRAINING_DATA_PATH);

  console.log(rawData);

  const [headers, rows] = file.csvToDS(rawData, false);

  console.log(headers, rows);

  const values = getValues(rows);

  console.log("values: ", values); //  [25, 30, 46, 45, 52, 23, 43, 35, 38, 46, 48, 52, 44, 30]

  console.log(
    "avg: ",
    average(values), // 39.785714285714285
    "sd: ",
    standardDeviation(values), // 9.321086474291743
    "cv: ",
    cov(values) // 23.428224531433468
  );

  headers.forEach((header, ind) => {
    console.log(`${header[ind]}: `, uniqueValues(rows, ind)); // eg: e:  [ 'Hot', 'Mild', 'Cool' ]
  });

  console.log(isNumber("5"), isNumber(5), isNumber("b")); // True True False
}

main();
