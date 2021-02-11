import * as file from "./utils/file.js";
import { logJson } from "./utils/data.js";
import { DecisionTree } from "./models/index.js";

const DATA_SCOPE = "hoursPlayed";

async function main() {
  const TRAINING_DATA_PATH = `./data/${DATA_SCOPE}/train.csv`;
  const TESTING_DATA_PATH = `./data/${DATA_SCOPE}/test.csv`;

  const rawData = await file.readFileAsText(TRAINING_DATA_PATH);

  const [headers, rows] = file.csvToDS(rawData, false);

  const regressionTree = new DecisionTree(headers);

  regressionTree.train(rows);

  const testy = ["Rainy", "Hot", "High", "True"];

  console.log("Predicted: ", regressionTree.predict(testy));

  regressionTree.test(rows);

  logJson(regressionTree.getJson());
}

main();
