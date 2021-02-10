import { average } from "../utils/math.js";
import { getValues } from "../utils/data.js";

class LeafNode {
  constructor(rows) {
    const values = getValues(rows);

    this.value = average(values);
  }
}

export default LeafNode;
