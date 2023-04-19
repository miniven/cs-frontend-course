import { LinkedList } from './LinkedList';
import { Structure } from './Structure';
import { StructureFieldType } from './Structure/types';

console.log('LINKED LIST PROBLEM');

const list = new LinkedList();

list.addLast(1);
list.addLast(2);
list.addLast(3);

// А можно так:
list.addLast(4).addLast(5).addLast(6).addFirst(0).addFirst(-1).removeValue(5);

console.log(list.head?.value);
console.log(list.head?.next?.value);

console.log('ITERATION PROBLEM');

for (const value of list) {
	console.log(value);
}

console.log('STRUCTURE PROBLEM');

const pedro = new Structure([
	['name', StructureFieldType.UTF_16, 10],
	['lastName', StructureFieldType.UTF_16, 10],
	['age', StructureFieldType.U_16],
]);

pedro.set('name', 'Pedro');
pedro.set('lastName', 'Pascal');
pedro.set('age', 53);

console.log(`Hi! My name is ${pedro.get('name')} ${pedro.get('lastName')} and I'm ${pedro.get('age')} y.o.`);
