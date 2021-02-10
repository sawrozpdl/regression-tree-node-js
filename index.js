import * as file from "./utils/file.js";
import { BranchNode, LeafNode, Condition } from "./models/index.js";

async function main() {
  const TRAINING_DATA_PATH = "./data/train.csv";
  const TESTING_DATA_PATH = "./data/test.csv";

  const rawData = await file.readFileAsText(TRAINING_DATA_PATH);

  const [headers, rows] = file.csvToDS(rawData, false);

  console.log(headers, rows);

  const ques1 = new Condition(1, "Hot");
  const ques2 = new Condition(1, "Mild");
  const ques3 = new Condition(1, "Cool");

  console.log(ques2.toString(headers)); // Temperature is Mild?

  const leaf = new LeafNode(rows);

  const left = new BranchNode(ques2, leaf, leaf);
  const right = new BranchNode(ques3, leaf, leaf);
  const first = new BranchNode(ques1, left, right);

  console.log(
    first.condition.satisfies(["Sunny", "Cool", "Normal", "True", "23"]),
    first.trueNode.condition.satisfies([
      "Sunny",
      "Cool",
      "Normal",
      "True",
      "23",
    ]),
    first.falseNode.condition.satisfies([
      "Sunny",
      "Cool",
      "Normal",
      "True",
      "23",
    ]),
    first.trueNode.trueNode.value
  ); // false false true 39.785714285714285
}

main();
