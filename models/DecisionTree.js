class DecisionTree {
  constructor(headers) {
    this.headers = headers;
  }

  _partition() {}

  _getBestSplit() {}

  train(rows) {
    this.rows = rows;
  }

  test(rows) {}

  evaluate() {}

  visualize() {}
}

export default DecisionTree;
