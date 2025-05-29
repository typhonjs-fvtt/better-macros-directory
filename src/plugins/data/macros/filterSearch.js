import { writable }     from 'svelte/store';

import { Subscribers }  from './Subscribers.js';

let keyword = '';
let regex;
const storeKeyword = writable(keyword);

/**
 * If there is no filter keyword / regex then do not filter otherwise filter based on the case-insensitive regex
 * created from the search input element.
 *
 * @param {Macro} macro - Macro to potentially filter.
 *
 * @returns {boolean} Macro filter state.
 */
function filterSearch(macro)
{
   return keyword === '' || !regex ? true : regex.test(foundry.applications.ux.SearchFilter.cleanQuery(macro.name));
}

// Create a custom store that changes when the search keyword changes.
filterSearch.subscribe = (handler) =>
{
   const unsubscribe = storeKeyword.subscribe(handler);

   Subscribers.add(unsubscribe);

   return unsubscribe;
};

filterSearch.set = (value) =>
{
   if (typeof value === 'string')
   {
      keyword = foundry.applications.ux.SearchFilter.cleanQuery(value);
      regex = new RegExp(RegExp.escape(keyword), 'i');
      storeKeyword.set(keyword);
   }
};

// ------------------------

export { filterSearch };
