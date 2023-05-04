import { Graph } from './Graph';

const graph = new Graph<string>(null, true);

graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D').addVertex('E').addVertex('F');

graph.addEdge('A', 'B');
graph.addEdge('A', 'E').addEdge('B', 'C').addEdge('C', 'D');

console.log(graph.isAdjacent('A', 'B')); // true
console.log(graph.isAdjacent('A', 'C')); // false
console.log(graph.isAdjacent('A', 'b')); // false

//       A     F
//      / \
//     B   E
//    /
//   C
//  /
// D

console.log('DFS', ...graph.getDFSIterator()); // [A B C D E F]
console.log('BFS', ...graph.getBFSIterator()); // [A B E C D F]
