import { isNumber } from "../utils/string.js";

class Condition {
  constructor(columnIndex, value) {
    this.columnIndex = columnIndex;
    this.value = value;
  }

  satisfies(row) {
    const val = row[this.columnIndex];
    return isNumber(val) ? val >= this.value : val === this.value;
  }

  toString(headers) {
    return `${headers[this.columnIndex]} ${
      isNumber(this.value) ? ">=" : "is"
    } ${this.value}?`;
  }
}

export default Condition;
