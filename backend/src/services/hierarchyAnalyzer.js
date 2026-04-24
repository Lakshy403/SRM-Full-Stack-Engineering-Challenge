const { createNode, getDepth } = require("../utils/treeBuilder");

const EDGE_PATTERN = /^([A-Za-z0-9_]+)->([A-Za-z0-9_]+)$/;

function sortLexicographically(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function analyzeHierarchies(entries) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const duplicateSet = new Set();
  const seenEdges = new Set();
  const parsedEdges = [];

  for (const rawEntry of Array.isArray(entries) ? entries : []) {
    if (typeof rawEntry !== "string") {
      invalidEntries.push(rawEntry);
      continue;
    }

    const entry = rawEntry.trim();
    const match = entry.match(EDGE_PATTERN);

    if (!entry || !match) {
      invalidEntries.push(rawEntry);
      continue;
    }

    const [, parent, child] = match;

    if (parent === child) {
      invalidEntries.push(rawEntry);
      continue;
    }

    if (seenEdges.has(entry)) {
      if (!duplicateSet.has(entry)) {
        duplicateEdges.push(entry);
        duplicateSet.add(entry);
      }
      continue;
    }

    seenEdges.add(entry);
    parsedEdges.push({ parent, child, raw: entry });
  }

  const childToParent = new Map();
  const effectiveEdges = [];
  const allNodes = new Set();

  for (const edge of parsedEdges) {
    if (childToParent.has(edge.child)) {
      continue;
    }

    childToParent.set(edge.child, edge.parent);
    effectiveEdges.push(edge);
    allNodes.add(edge.parent);
    allNodes.add(edge.child);
  }

  const adjacency = new Map();
  const indegree = new Map();

  for (const node of allNodes) {
    adjacency.set(node, []);
    indegree.set(node, 0);
  }

  for (const edge of effectiveEdges) {
    adjacency.get(edge.parent).push(edge.child);
    indegree.set(edge.child, (indegree.get(edge.child) || 0) + 1);
  }

  for (const [node, children] of adjacency.entries()) {
    adjacency.set(node, sortLexicographically(children));
  }

  const undirected = new Map();

  for (const node of allNodes) {
    undirected.set(node, new Set());
  }

  for (const edge of effectiveEdges) {
    undirected.get(edge.parent).add(edge.child);
    undirected.get(edge.child).add(edge.parent);
  }

  const visitedUndirected = new Set();
  const components = [];

  for (const node of sortLexicographically(allNodes)) {
    if (visitedUndirected.has(node)) {
      continue;
    }

    const stack = [node];
    const componentNodes = [];

    visitedUndirected.add(node);

    while (stack.length > 0) {
      const current = stack.pop();
      componentNodes.push(current);

      for (const next of undirected.get(current) || []) {
        if (!visitedUndirected.has(next)) {
          visitedUndirected.add(next);
          stack.push(next);
        }
      }
    }

    components.push(sortLexicographically(componentNodes));
  }

  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = null;
  let largestTreeSize = 0;

  for (const componentNodes of components) {
    const componentSet = new Set(componentNodes);
    const state = new Map();
    let hasCycle = false;

    function dfs(node) {
      state.set(node, 1);

      for (const child of adjacency.get(node) || []) {
        if (!componentSet.has(child)) {
          continue;
        }

        const childState = state.get(child) || 0;

        if (childState === 1) {
          hasCycle = true;
          return;
        }

        if (childState === 0) {
          dfs(child);
          if (hasCycle) {
            return;
          }
        }
      }

      state.set(node, 2);
    }

    for (const node of componentNodes) {
      if ((state.get(node) || 0) === 0) {
        dfs(node);
      }

      if (hasCycle) {
        break;
      }
    }

    if (hasCycle) {
      totalCycles += 1;
      hierarchies.push({
        has_cycle: true,
        tree: {},
        component_nodes: componentNodes
      });
      continue;
    }

    const roots = componentNodes.filter((node) => (indegree.get(node) || 0) === 0);
    const root = sortLexicographically(roots)[0] || componentNodes[0];
    const tree = createNode(root, adjacency);
    const depth = getDepth(root, adjacency);

    totalTrees += 1;

    if (
      componentNodes.length > largestTreeSize ||
      (componentNodes.length === largestTreeSize && largestTreeRoot && root.localeCompare(largestTreeRoot) < 0) ||
      (componentNodes.length === largestTreeSize && !largestTreeRoot)
    ) {
      largestTreeRoot = root;
      largestTreeSize = componentNodes.length;
    }

    hierarchies.push({
      has_cycle: false,
      root,
      depth,
      node_count: componentNodes.length,
      tree
    });
  }

  return {
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: sortLexicographically(duplicateEdges),
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot
    }
  };
}

module.exports = {
  analyzeHierarchies
};
