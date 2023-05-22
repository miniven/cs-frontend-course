import { Trie } from './Trie';

const trie = new Trie();

trie.add('abc');
trie.add('abd');

console.log(trie.has('woo')); // false
console.log(trie.has('ab')); // false
console.log(trie.has('abcd')); // false
console.log(trie.has('abc')); // true

trie.remove('abc');
console.log(trie.has('abc')); // false
console.log(trie.has('abd')); // true

trie.remove('abd');
console.log(trie.has('abd')); // false

trie.add('hello');
console.log(trie.has('hello')); // true

trie.add('bob');
console.log(trie.has('bob')); // true

trie.removeRec('bob');
console.log(trie.has('bob')); // false
