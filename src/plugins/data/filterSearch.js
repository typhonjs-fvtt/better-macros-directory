import { writable }  from 'svelte/store';

let keyword = '';
let storeKeyword = writable(keyword);
let regex;

function filterSearch(macro)
{
   // If there is no filter keyword or enabled store is false return true and don't filter. Otherwise, filter variable
   // by inclusion of keyword in full property name.
   return keyword === '' || !regex ? true : regex.test(SearchFilter.cleanQuery(macro.name));
}

// Create a custom store that changes when either storeKeyword or storeEnabled changes.
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