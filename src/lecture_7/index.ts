import { Graph } from './Graph';

const graph = new Graph<string>(null, true);

graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D').addVertex('E').addVertex('F').addVertex('G');

graph.addEdge('A', 'B');
graph.addEdge('A', 'F').addEdge('B', 'C').addEdge('C', 'D').addEdge('C', 'E');

console.log(graph.isAdjacent('A', 'B')); // true
console.log(graph.isAdjacent('A', 'C')); // false
console.log(graph.isAdjacent('A', 'b')); // false

//       A     G
//      / \
//     B   F
//    /
//   C
//  / \
// D   E

console.log('DFS', ...graph.getDFSIterator()); // [A B C D E F]
console.log('DFS Reversed', ...graph.getDFSReversedIterator()); // [D E C B F A G]
console.log('BFS', ...graph.getBFSIterator()); // [A B E C D F]

const graph2 = new Graph<string>(['v1', 'v2', 'v3', 'v4', 'v5', 'v6'], true);

graph2.addEdge('v1', 'v2', 5).addEdge('v1', 'v3', 15).addEdge('v1', 'v4', 10);
graph2.addEdge('v2', 'v4', 2).addEdge('v2', 'v6', 11);
graph2.addEdge('v3', 'v4', 3).addEdge('v3', 'v5', 6);
graph2.addEdge('v4', 'v1', 3).addEdge('v4', 'v3', 4).addEdge('v4', 'v5', 3).addEdge('v4', 'v6', 4);
graph2.addEdge('v5', 'v3', 2).addEdge('v5', 'v6', 6);
graph2.addEdge('v6', 'v5', 2);

console.log(graph2.getShortPath('v1', 'v6')); // [11, [v1, v2, v4, v6]]
