import { LinkedList } from './LinkedList';
import { Structure } from './Structure';
import { StructureFieldType } from './Structure/types';

console.log('LINKED LIST PROBLEM');

const list = new LinkedList();

list.add(1);
list.add(2);
list.add(3);

// А можно так:
list.add(4).add(5).add(6).remove(5);

console.log(list.head?.value); // 1
console.log(list.tail?.value); // 3
console.log(list.head?.next?.value); // 2
console.log(list.head?.next?.prev?.value); // 1

console.log('ITERATION PROBLEM');

for (const value of list) {
	console.log(value);
}

console.log('STRUCTURE PROBLEM');

const jackBlack = new Structure([
	// ['name', StructureFieldType.UTF_16, 10], // Число - это максимальное количество символов
	// ['lastName', StructureFieldType.UTF_16, 10],
	['age', StructureFieldType.U_16], // uint16
	['size', StructureFieldType.U_16],
]);

// jackBlack.set('name', 'Jack');
// jackBlack.set('lastName', 'Black');
jackBlack.set('age', 53);
jackBlack.set('size', 49);

console.log('age', jackBlack.get('age')); // 'Jack'
console.log('size', jackBlack.get('size')); // 'Jack'
