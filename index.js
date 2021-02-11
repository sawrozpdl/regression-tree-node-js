import * as file from "./utils/file.js";
import { logJson } from "./utils/data.js";
import { DecisionTree } from "./models/index.js";

const DATA_FOLDER = "hoursPlayed";

async function main() {
  const TRAINING_DATA_PATH = `./data/${DATA_FOLDER}/train.csv`;
  const TESTING_DATA_PATH = `./data/${DATA_FOLDER}/test.csv`;

  const rawTrainingData = await file.readFileAsText(TRAINING_DATA_PATH);
  const rawTestingData = await file.readFileAsText(TESTING_DATA_PATH);

  const [headers, trainingRows] = file.csvToDS(rawTrainingData, false);
  const [ignored, testingRows] = file.csvToDS(rawTestingData, false);

  const regressionTree = new DecisionTree(headers);

  regressionTree.train(trainingRows);

  logJson(regressionTree.getJson());

  const testy = ["Sunny", "Hot", "High", "False"];

  console.log("For: ", testy, ", Predicted: ", regressionTree.predict(testy));

  regressionTree.test(testingRows);

  regressionTree.info();
}

main();
