import { BST, TreeNode } from './BST';
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

console.log('Находим длину максимального пути от корня до листа');

const head = new TreeNode(1);

head.left = new TreeNode(4);
head.right = new TreeNode(7);

head.left.left = new TreeNode(2);
head.left.right = new TreeNode(3);

head.right.left = new TreeNode(5);
head.right.right = new TreeNode(4);

function getMaxSumRecursive(node: TreeNode<number> | null): number {
	if (!node) {
		return 0;
	}

	const leftValue = getMaxSumRecursive(node.left);
	const rightValue = getMaxSumRecursive(node.right);

	return node.value + Math.max(leftValue, rightValue);
}

function getMaxSum(head: TreeNode<number>) {
	const stack: Array<[TreeNode<number> | null, 'white' | 'gray']> = [[head, 'white']];
	const sums: Array<number> = [];

	while (stack.length) {
		const [node, color] = stack.pop()!;

		if (!node) {
			sums.push(0);

			continue;
		}

		if (color === 'white') {
			stack.push([node, 'gray'], [node.right, 'white'], [node.left, 'white']);

			continue;
		}

		if (color === 'gray') {
			const max = Math.max(sums.pop()!, sums.pop()!);

			sums.push(max + node.value);
		}
	}

	return sums[0];
}

console.log('Рекурсивный алгоритм', getMaxSumRecursive(head));
console.log('Алгоритм на стеке', getMaxSum(head));

console.log('Находим длину максимального пути из любой вершины дерева');

const head2 = new TreeNode(-10);

head2.left = new TreeNode(9);
head2.right = new TreeNode(20);

head2.right.left = new TreeNode(-3);
head2.right.left.left = new TreeNode(5);
head2.right.left.right = new TreeNode(-4);

head2.right.left.left.left = new TreeNode(-2);

head2.right.right = new TreeNode(8);
head2.right.right.right = new TreeNode(-2);

console.log('Рекурсивный алгоритм', getMaxPathRecursive(head2));
console.log('Алгоритм на стеке', getMaxPath(head2));

//    -10
//   /    \
//  9      20
//        /   \
//      -3     8
// 	    /  \     \
// 	   5   -4     -2
//    /
//  -2

function getMaxPathRecursive(head: TreeNode<number>): number {
	let result = 0;

	function helper(node: TreeNode<number> | null): number {
		if (!node) {
			return 0;
		}

		let leftSum = Math.max(helper(node.left), 0);
		let rightSum = Math.max(helper(node.right), 0);

		const nodeResult = node.value + Math.max(leftSum, rightSum);

		result = Math.max(result, nodeResult);

		return nodeResult;
	}

	helper(head);

	return result;
}

function getMaxPath(head: TreeNode<number>): number {
	let result = 0;
	const stack: Array<[TreeNode<number> | null, 'white' | 'gray']> = [[head, 'white']];
	const sums: Array<number> = [];

	while (stack.length) {
		const [node, color] = stack.pop()!;

		if (!node) {
			sums.push(0);

			continue;
		}

		if (color === 'white') {
			stack.push([node, 'gray'], [node.right, 'white'], [node.left, 'white']);

			continue;
		}

		if (color === 'gray') {
			const nodeResult = node.value + Math.max(sums.pop()!, sums.pop()!, 0);

			result = Math.max(result, nodeResult);

			sums.push(nodeResult);
		}
	}

	return result;
}
