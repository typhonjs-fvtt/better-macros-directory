import { writable }     from 'svelte/store';

import { Subscribers }  from './Subscribers.js';

let userId = '';
const storeUserId = writable(userId);

/**
 * If there is no userId set then do not filter otherwise filter based on the default state or individual matching user
 * permissions for greater or equals OBSERVER.
 *
 * @param {Macro} macro - Macro to potentially filter.
 *
 * @returns {boolean} Macro filter state.
 */
function filterUser(macro)
{
   const ownership = macro.ownership;
   const author = macro.author;
   const LIMITED = CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;

   // If no user ID is set do not filter otherwise if author ID matches user ID, ID is in permissions or the default
   // permission is at least LIMITED then keep the macro.
   return userId === '' ? true : (author?.id === userId) || (userId in ownership && ownership[userId] >= LIMITED) ||
    ('default' in ownership && ownership['default'] >= LIMITED);
}

// Augment the `filterUser` function with Svelte readable store API.

// Create a custom store that changes when on select / option change.
filterUser.subscribe = (handler) =>
{
   const unsubscribe = storeUserId.subscribe(handler);

   Subscribers.add(unsubscribe);

   return unsubscribe;
};

filterUser.set = (value) =>
{
   if (typeof value === 'string')
   {
      userId = value;
      storeUserId.set(userId);
   }
};

export { filterUser };
