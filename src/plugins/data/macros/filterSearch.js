import { writable }  from 'svelte/store';

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

// Augment the `filterSearch` function with Svelte readable store API.
// Create a custom store that changes when the search keyword changes.

filterSearch.subscribe = storeKeyword.subscribe;

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
