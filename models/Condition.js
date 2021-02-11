import { isNumber } from "../utils/string.js";

class Condition {
  /**
   * Creates a condition object taking the column location and value at the point.
   *
   * @param {Number} columnIndex
   * @param {String || Number} value
   */
  constructor(columnIndex, value) {
    this.columnIndex = columnIndex;
    this.value = value;
  }

  /**
   * Checks whether the condition is valid for a given row of properties.
   *
   * @param {Array<String>} row
   */
  satisfies(row) {
    const val = row[this.columnIndex];
    return isNumber(val) ? val >= this.value : val === this.value;
  }

  /**
   * Gives out the annotation of the condition.
   *
   * @param {Array<String>} headers
   */
  toString(headers) {
    return `${headers[this.columnIndex]} ${
      isNumber(this.value) ? ">=" : "is"
    } ${this.value}?`;
  }
}

export default Condition;
