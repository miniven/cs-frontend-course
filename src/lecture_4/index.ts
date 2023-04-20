import { DEQ } from './DEQ';
import { Queue } from './Queue';

const queue = new Queue();

console.log('QUEUE');

queue.insert(1);
queue.insert(2);
queue.insert(3);

console.log('head', queue.head);
console.log(queue.remove());
console.log(queue.remove());
console.log(queue.remove());

queue.insert(4);
queue.insert(5);

console.log('head', queue.head);
console.log(queue.remove());

console.log('DOUBLE ENDED QUEUE');

const deq = new DEQ(5);

deq.pushBack(0);
deq.pushFront(1);
deq.pushFront(2);
deq.pushBack(3);
deq.pushBack(4);

console.log(deq.popFront());
console.log(deq.popBack());
console.log(deq.popFront());
console.log(deq.popBack());
console.log(deq.popFront());
