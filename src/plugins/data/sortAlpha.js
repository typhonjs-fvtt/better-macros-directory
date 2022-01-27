import { writable }  from 'svelte/store';

let sort = false;
const storeSort = writable(sort);

function sortAlpha(a, b)
{
   return sort ? a.name.localeCompare(b.name) : 0;
}

// Create a custom store that changes when on select / option change.
sortAlpha.subscribe = storeSort.subscribe;
sortAlpha.get = () => sort;
sortAlpha.set = (value) =>
{
   if (typeof value === 'boolean')
   {
      sort = value
      storeSort.set(sort);
   }
}

export { sortAlpha };