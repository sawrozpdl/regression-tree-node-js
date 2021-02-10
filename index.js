import * as file from "./utils/file.js";

async function main() {
  const TRAINING_DATA_PATH = "./data/train.csv";
  const TESTING_DATA_PATH = "./data/test.csv";

  const rawData = await file.readFileAsText(TRAINING_DATA_PATH);

  console.log(rawData);

  const [headers, rows] = file.csvToDS(rawData, false);

  console.log(headers, rows);
}

main();
