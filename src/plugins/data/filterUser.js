import { writable }  from 'svelte/store';

let userId = '';
const storeUserId = writable(userId);

function filterUser(macro)
{
   const perms = macro.data.permission;
   const OBSERVER = CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER;

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
}

export { filterUser };