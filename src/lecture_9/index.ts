import { Heap } from './Heap';
import { heapSort } from './heapSort';

console.log('HEAP DATA STRUCTURE');

const heap = new Heap<number>((a, b) => a - b);

heap.push(8);
heap.push(5);
heap.push(100);
heap.push(3);
heap.push(71);

console.log(heap.pop());
console.log(heap.pop());
console.log(heap.pop());
console.log(heap.pop());
console.log(heap.pop());

console.log('HEAP SORT ALGORITHM');

console.log(heapSort([9, 6, 3, 25, 8, 7, 8, 0], (a, b) => a - b)); // [0, 3, 6, 7, 8, 8, 9, 25]
console.log(heapSort([9, 6, 3, 25, 8, 7, 8, 0], (a, b) => b - a)); // [25, 9, 8, 8, 7, 6, 3, 0]
console.log(heapSort([0, 0, 0, 0], (a, b) => a - b)); // [0, 0, 0, 0]
console.log(heapSort([], (a, b) => a - b)); // []
