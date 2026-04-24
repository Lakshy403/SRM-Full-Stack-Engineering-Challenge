const { analyzeHierarchies } = require("../src/services/hierarchyAnalyzer");

const examples = [
  {
    title: "Simple tree",
    data: ["A->B", "A->C", "B->D"]
  },
  {
    title: "Invalid, duplicate, and multi-parent",
    data: ["A->B", "A->B", "X->Y", "Z->Y", "bad", "A=>C", "A->A"]
  },
  {
    title: "Cycle",
    data: ["A->B", "B->C", "C->A", "D->E"]
  }
];

for (const example of examples) {
  console.log(`\n=== ${example.title} ===`);
  console.log(JSON.stringify(analyzeHierarchies(example.data), null, 2));
}
