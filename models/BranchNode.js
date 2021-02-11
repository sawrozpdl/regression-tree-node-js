class BranchNode {
  /**
   * Creates a branch node with a condition and 2 children nodes.
   *
   * @param {Condition} condition
   * @param {BranchNode || LeafNode} trueNode
   * @param {BranchNode || LeafNode} falseNode
   */
  constructor(condition, trueNode, falseNode) {
    this.condition = condition;
    this.trueNode = trueNode;
    this.falseNode = falseNode;
  }
}

export default BranchNode;
