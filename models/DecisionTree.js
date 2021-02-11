import LeafNode from "./LeafNode.js";
import { log } from "../utils/string.js";
import { BranchNode, Condition } from "./index.js";
import { COV_THRESHOLD, MAX_DEPTH } from "../config.js";
import { standardDeviation, cov, average } from "../utils/math.js";
import { getValues, logJson, uniqueValues } from "../utils/data.js";

class DecisionTree {
  /**
   * Creates a decision tree object with headers.
   *
   * @param {Array<String>} headers
   */
  constructor(headers) {
    this.headers = headers;
    this.head = null;
    this.testResults = null;
  }

  /**
   * Calculates the standard deviation reduction for true and false rows wrt the table's sd.
   *
   * @param {Array<Array<String>>} trueRows
   * @param {Array<Array<String>>} falseRows
   * @param {Number} prevSD
   */
  _sdReduction(trueRows = [], falseRows = [], prevSD = 0) {
    const pTrue = trueRows.length / (trueRows.length + falseRows.length); // Probability of 'X' values.
    const pFalse = 1 - pTrue; // Probability of 'not X' values.  eg. not Sunny

    return (
      prevSD -
      (pTrue * standardDeviation(getValues(trueRows)) +
        pFalse * standardDeviation(getValues(falseRows)))
    );
  }

  /**
   * Divides the rows into the condition valid and otherwise types.
   *
   * @param {Array<Array<String>>} rows
   * @param {Condition} condition
   */
  _partition(rows, condition) {
    const trueRows = [];
    const falseRows = [];

    rows.forEach((row) => {
      if (condition.satisfies(row)) {
        trueRows.push(row);
      } else {
        falseRows.push(row);
      }
    });

    return [trueRows, falseRows];
  }

  /**
   * Finds the best possible condition in the table for which the s.d reduction is maximum.
   *
   * @param {Array<Array<String>>} rows
   * @param {Number} depth
   */
  _findBestCondition(rows, depth) {
    const values = getValues(rows);

    const avg = average(values);
    const currSD = standardDeviation(values, avg);
    const cOfVariation = cov(values, avg, currSD);

    log(depth, "Avg: ", avg, "SD: ", currSD, "CoV: ", cOfVariation);

    // 0 currSD means the data is singular or same values on each row which means we know the value already now.
    // if CoV is less than the threshold we just average the values and store as a prediction.
    if (currSD === 0 || cOfVariation <= COV_THRESHOLD || depth >= MAX_DEPTH) {
      return null;
    }

    let bestReduction = 0;
    let bestCondition = null;

    const colCount = this.headers.length - 1; // Ignoring the value column.

    for (let i = 0; i < colCount; i++) {
      // Loop on the columns
      const colValues = uniqueValues(rows, i);

      for (let j = 0; j < colValues.length; j++) {
        // Loop on the unique values on the column.
        const currValue = colValues[j];

        const condition = new Condition(i, currValue); // Create a temp condition for checking the sd reduction wrt that condition.

        log(depth, "Condition: ", condition.toString(this.headers));

        const [trueRows, falseRows] = this._partition(rows, condition); // Divide the set wrt the condition.

        log(depth, "trueRows: ", trueRows, "falseRows", falseRows);

        // We skip if the rows are biased (true/false) to single properties as we could be already inside the
        // biased parent property. also, the same values rows won't matter much in the tree if so happens.
        if (trueRows.length === 0 || falseRows.length === 0) {
          continue;
        }

        const reduction = this._sdReduction(trueRows, falseRows, currSD);

        log(depth, "Reduction: ", reduction);

        if (reduction > bestReduction) {
          bestReduction = reduction;
          bestCondition = condition;
        }
      }
    }

    return bestCondition;
  }

  /**
   * Core algorithm to build the tree by splitting recursively and placing right conditions on the branch nodes.
   *
   * @param {Array<Array<String>>} rows
   * @param {Number} depth
   */
  _buildTree(rows, depth = 0) {
    const condition = this._findBestCondition(rows, depth);

    if (!condition) {
      // The table can't be further split or we reached the required value of variance.
      return new LeafNode(rows);
    }

    log(depth, "Nd cdn: ", condition.toString(this.headers));

    // Divide the rows into 2 groups with one satisfying the condition and otherwise.
    const [trueRows, falseRows] = this._partition(rows, condition);

    // Recursively create new sub trees using the new rows.
    const trueBranch = this._buildTree(trueRows, depth + 1);
    const falseBranch = this._buildTree(falseRows, depth + 1);

    // Return the reference to the new branch node.
    return new BranchNode(condition, trueBranch, falseBranch);
  }

  /**
   * Trains the model with the given data rows by building a tree.
   *
   * @param {Array<Array<String>>} rows
   */
  train(rows) {
    this.head = this._buildTree(rows);
  }

  /**
   * Tests the new data and sets the error info.
   *
   * @param {Array<Array<String>>} rows
   */
  test(rows) {
    if (!this.head) {
      return;
    }

    const values = getValues(rows);

    const predictions = rows.map((row) => this._eval(row, this.head));

    log(0, "Correct Values: ", values, "Predicted values: ", predictions);

    let squaredErrorSum = 0;

    values.forEach((value, index) => {
      squaredErrorSum += Math.pow(value - predictions[index], 2);
    });

    this.testResults = {
      "Mean Square Error: ": squaredErrorSum / values.length,
    };
  }

  /**
   * Core evaluation function to predict the value of new data.
   *
   * @param {Array<String>} row
   * @param {BranchNode || LeafNode} node
   */
  _eval(row = [], node = null) {
    if (node instanceof LeafNode) {
      return node.value;
    }

    return node && node.condition.satisfies(row)
      ? this._eval(row, node.trueNode)
      : this._eval(row, node.falseNode);
  }

  /**
   * Predicts the value of the properties.
   *
   * @param {Array<String>} row
   */
  predict(row) {
    if (!this.head) {
      return;
    }

    return this._eval(row, this.head);
  }

  /**
   * Core json conversion algorith to convert the model to json.
   *
   * @param {BranchNode || LeafNode} node
   */
  _json(node = null) {
    if (!node) return;

    if (node instanceof LeafNode) {
      return node.value;
    }

    const ques = node.condition.toString(this.headers);

    const obj = {};

    obj[ques] = {
      true: this._json(node.trueNode),
      false: this._json(node.falseNode),
    };

    return obj;
  }

  /**
   * Gives the JSON of the model.
   */
  getJson() {
    if (!this.head) {
      return;
    }

    return this._json(this.head);
  }

  /**
   * Logs the tree in JSON format.
   */
  visualize() {
    if (!this.head) {
      return;
    }

    logJson(this._json(this.head));
  }

  /**
   * Resets the tree into initial state.
   */
  reset() {
    this.head = null;
    this.testResults = {};
  }

  /**
   * Displays the testing results of the current model.
   */
  info() {
    Object.keys(this.testResults).forEach((key) => {
      console.log(`${key}: ${this.testResults[key]}`);
    });
  }
}

export default DecisionTree;
