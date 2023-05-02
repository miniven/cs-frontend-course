import { HashMap } from './HashMap';
import { Matrix3D } from './Matrix';
import { Vector } from './Vector';

console.log('VECTOR');

const vector = new Vector(Uint8Array, 4);

vector.pushFront(1); // [1,_,_,_]
vector.pushFront(2); // [1,2,_,_]
vector.pushBack(3); // [1,2,_,3]
vector.pushBack(4); // [1,2,4,3]
vector.pushFront(5); // Массив аллоцируется, результат: [4,3,1,2,5,_,_]
vector.pushFront(6, 7, 8); // Массив аллоцируется, результат: [4,3,1,2,5,6,7,8,_,_,_]
vector.pushBack(9); // [4,3,1,2,5,6,7,8,_,_,9]

vector.popFront(); // [4,3,1,2,5,6,7,_,_,_,9]
vector.pushFront(100); // [4,3,1,2,5,6,7,100,_,_,9]
vector.popBack(); // [4,3,1,2,5,6,7,100,_,_,9]
vector.pushBack(255); // [4,3,1,2,5,6,7,100,_,_,255]

console.log(vector.popBack()); // 255
console.log(vector.popBack()); // 4
console.log(vector.popBack()); // 3
console.log(vector.popFront()); // 100
console.log(vector.popFront()); // 7
console.log(vector.popFront()); // 6
console.log(vector.popFront()); // 5
console.log(vector.popFront()); // 2
console.log(vector.popBack()); // 1
console.log(vector.length); // 0

console.log('MATRIX');

const matrix = new Matrix3D(5, 5, 5);

matrix.set({ x: 1, y: 1, z: 1 }, 100);

console.log(matrix.get({ x: 1, y: 1, z: 1 })); // 10

console.log('HASH MAP');

const map = new HashMap<string | number>(4);

map.set(1, '1');
map.set(2, '2');
map.set('3', '3');
map.set('four', '4');
map.set({ five: 5 }, '5');

const six = { six: 6 };

map.set(six, 6);
map.set(six, '6');

console.log(map.get(1)); // '1'
console.log(map.get(2)); // '2'
console.log(map.get('3')); // '3'
console.log(map.get('four')); // '4'
console.log(map.get({ five: 5 })); // undefined
console.log(map.get(six)); // '6'
