import { LinkedList } from './linked-list';

const list = new LinkedList();

list.add(1);
list.add(2);
list.add(3);

console.log(list.head?.value); // 1
console.log(list.tail?.value); // 3
console.log(list.head?.next?.value); // 2
console.log(list.head?.next?.prev?.value); // 1

for (const value of list) {
	console.log(value);
}