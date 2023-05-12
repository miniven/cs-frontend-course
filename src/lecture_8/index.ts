import { BST } from './BST';
import { binarySearch, binarySearchRight } from './binarySearch';

console.log(binarySearch([1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9], (el) => el - 7)); // 6
console.log(binarySearchRight([1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8, 9], (el) => el - 7)); // 9

console.log(binarySearch([], (el) => el - 7)); // -1
console.log(binarySearchRight([], (el) => el - 7)); // -1

console.log(binarySearch([3], (el) => el - 7)); // -1
console.log(binarySearchRight([3], (el) => el - 7)); // -1

console.log(binarySearch([7, 7, 7, 7, 7, 7, 7], (el) => el - 7)); // 0
console.log(binarySearchRight([7, 7, 7, 7, 7, 7, 7], (el) => el - 7)); // 6

const arr = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }];

console.log(binarySearch(arr, (el) => el.value - 5)); // 4
console.log(binarySearchRight(arr, (el) => el.value - 5)); // 4

console.log('BST');

const tree = new BST<number>((a, b) => a - b);

tree.add(10);
tree.add(5);
tree.add(2);
tree.add(7);
tree.add(50);
tree.add(30);
tree.add(3);
tree.add(40);
tree.add(20);
tree.add(25);

console.log('min', tree.findMin()); // 2
console.log('max', tree.findMax()); // 50

console.log('remove max');
tree.remove(tree.findMax());
console.log('new max', tree.findMax()); // 40

console.log('remove min');
tree.remove(tree.findMin());
console.log('new min', tree.findMin()); // 40

console.log('pre order traversal');

const treeToTraverse = new BST<number>((a, b) => a - b);

treeToTraverse.add(100).add(3).add(1).add(65).add(95).add(91).add(4).add(0).add(111).add(105);

//         100
//       /     \
//      3       111
//     / \     /
//    1   65  105
//   /   /  \
//  0   4    95
//          /
//        91

console.log([...treeToTraverse.preOrderTraverse()]); // [0, 1, 3, 4, 65, 91, 95, 100, 105, 111]

console.log('breadth first traversal');
console.log([...treeToTraverse.breadthFirstTraverse()]); // [100, 3, 111, 1, 65, 105, 0, 4, 95, 91]
