const subscribers = [];

/**
 * Tracks all subscribers for the filter & sort stores. This is necessary as BMD is a hybrid app and currently
 * piggybacks off the core Foundry functionality for building the macro / folder relationship. The core updates and
 * rebuilds the entire data structure on any create, update, delete operation. When this is triggered we need to
 * manually unsubscribe from our augmented data structure removing the subscribers for the filters and sort function
 * added to all DynArrayReducers in {@link MacroData.buildTree} & {@link MacroData.augmentTree}.
 */
export class Subscribers
{
   /**
    * Adds an unsubscribe callback.
    *
    * @type {import('svelte/store').Unsubscriber[]} unsubscribe -
    */
   static add(unsubscribe)
   {
      subscribers.push(unsubscribe);
   }

   /**
    * Invokes all unsubscribe callbacks then clears the subscriber array.
    */
   static unsubscribeAll()
   {
      for (const unsubscribe of subscribers) { unsubscribe(); }
      subscribers.length = 0;
   }
}