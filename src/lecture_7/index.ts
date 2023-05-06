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
