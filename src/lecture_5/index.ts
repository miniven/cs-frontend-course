import { isValidBracketSequence } from './helpers';
import { collapse, recursiveCollapse } from './helpers/collapse';

const obj = {
	a: {
		b: [1, 2],
		'': { c: null },
	},
};

/* {'a.b.0': 1, 'a.b.1': 2, 'a..c': null} */
console.log(recursiveCollapse(obj));
console.log(collapse(obj));

console.log('BRACKETS');
console.log(isValidBracketSequence('(hello{world} and [me])')); // true
console.log(isValidBracketSequence('(hello{world)} and [me])')); // false
console.log(isValidBracketSequence(')')); // false
