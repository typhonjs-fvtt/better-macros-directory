/**
 * Creates the items for the overflow menu.
 *
 * @param {object}   eventbus - Plugin eventbus
 *
 * @returns {object[]} Overflow menu items.
 */
export function createOverflowItems(eventbus) // eslint-disable-line no-unused-vars
{
   return [
      { label: 'bmd.menu.overflow.create-macro', icon: 'fas fa-code' },
      { label: 'bmd.menu.overflow.create-folder', icon: 'fas fa-folder' },
      { label: 'bmd.menu.overflow.always-on-top', icon: 'fas fa-arrow-alt-circle-up' }
   ];
}
