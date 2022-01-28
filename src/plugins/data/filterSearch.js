import { writable }  from 'svelte/store';

let keyword = '';
let storeKeyword = writable(keyword);
let regex;

/**
 * If there is no filter keyword / regex then don't filter otherwise filter based on the case-insensitive regex
 * created from the search input element.
 *
 * @param {Macro} macro -
 *
 * @returns {boolean} Macro filter state.
 */
function filterSearch(macro)
{
   return keyword === '' || !regex ? true : regex.test(SearchFilter.cleanQuery(macro.name));
}

// Create a custom store that changes when the search keyword changes.
filterSearch.subscribe = storeKeyword.subscribe;
filterSearch.get = () => keyword;
filterSearch.set = (value) =>
{
   if (typeof value === 'string')
   {
      keyword = SearchFilter.cleanQuery(value);
      regex = new RegExp(RegExp.escape(keyword), 'i');
      storeKeyword.set(keyword);
   }
}

export { filterSearch };