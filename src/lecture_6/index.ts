import { Vector } from './Vector';

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
