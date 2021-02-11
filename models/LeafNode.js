import { average } from "../utils/math.js";
import { getValues } from "../utils/data.js";

class LeafNode {
  /**
   * Sets a leaf node with final prediction which is average of all the values in the node.
   *
   * @param {Array<Array<String>>} rows
   */
  constructor(rows) {
    const values = getValues(rows);

    this.value = average(values);
  }
}

export default LeafNode;
