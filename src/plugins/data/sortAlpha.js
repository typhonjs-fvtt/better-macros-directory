import { writable }  from 'svelte/store';

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

// Create a custom store that changes when the toggle button is engaged.
sortAlpha.subscribe = storeSort.subscribe;
sortAlpha.get = () => sort;
sortAlpha.set = (value) =>
{
   if (typeof value === 'boolean')
   {
      sort = value;
      storeSort.set(sort);
   }
};

export { sortAlpha };