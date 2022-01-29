import { writable }  from 'svelte/store';

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
   const perms = macro.data.permission;
   const OBSERVER = CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER;

   // If no user ID is set do not filter otherwise if ID is in permissions or the default permission is at least
   // OBSERVER then keep the macro.
   return userId === '' ? true : (userId in perms && perms[userId] >= OBSERVER) ||
    ('default' in perms && perms['default'] >= OBSERVER);
}

// Create a custom store that changes when on select / option change.
filterUser.subscribe = storeUserId.subscribe;
filterUser.get = () => userId;
filterUser.set = (value) =>
{
   if (typeof value === 'string')
   {
      userId = value;
      storeUserId.set(userId);
   }
};

export { filterUser };