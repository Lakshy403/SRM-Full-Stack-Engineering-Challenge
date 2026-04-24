function createNode(name, adjacency) {
  const children = [...(adjacency.get(name) || [])].sort();

  return {
    name,
    children: children.map((child) => createNode(child, adjacency))
  };
}

function getDepth(root, adjacency) {
  const children = adjacency.get(root) || [];

  if (children.length === 0) {
    return 1;
  }

  let maxDepth = 0;

  for (const child of children) {
    maxDepth = Math.max(maxDepth, getDepth(child, adjacency));
  }

  return maxDepth + 1;
}

module.exports = {
  createNode,
  getDepth
};
