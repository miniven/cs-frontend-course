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
