import { writable }     from 'svelte/store';

import { Subscribers }  from './Subscribers.js';

let sort = false;
const storeSort = writable(sort);

/**
 * Provides the compare function to sort macros by name alphabetically.
 *
 * @param {Macro} a -
 *
 * @param {Macro} b -
 *
 * @returns {number} sort order
 */
function sortAlpha(a, b)
{
   return sort ? a.name.localeCompare(b.name) : 0;
}

// Create a custom store that changes when on select / option change.
sortAlpha.subscribe = (handler) =>
{
   const unsubscribe = storeSort.subscribe(handler);

   Subscribers.add(unsubscribe);

   return unsubscribe;
};

sortAlpha.set = (value) =>
{
   if (typeof value === 'boolean')
   {
      sort = value;
      storeSort.set(sort);
   }
};

export { sortAlpha };