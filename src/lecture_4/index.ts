import { Queue } from './Queue';

const queue = new Queue();

queue.insert(1);
queue.insert(2);
queue.insert(3);

console.log(queue.remove());
console.log(queue.remove());
console.log(queue.remove());

queue.insert(4);
queue.insert(5);

console.log(queue.remove());
