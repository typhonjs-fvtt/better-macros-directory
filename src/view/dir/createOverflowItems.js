import { localize }           from '#runtime/util/i18n';

import { TJSDocumentDialog }  from '#standard/application/dialog/document';

import { sessionConstants }   from "#constants";

/**
 * Creates the items for the overflow menu.
 *
 * @param {object}   [options] - Options.
 *
 * @param {Function} [options.alwaysOnTopFn] - Always on top callback.
 *
 * @param {boolean} [options.alwaysOnTop] - Current always on top value.
 *
 * @param {import('#runtime/plugin/manager/eventbus').Eventbus} [options.eventbus] - App eventbus.
 *
 * @returns {Iterable<object>} Overflow menu items.
 */
export function createOverflowItems({ alwaysOnTopFn, alwaysOnTop, eventbus } = {}) // eslint-disable-line no-unused-vars
{
   const clickExec = eventbus.triggerSync('bmd:storage:session:item:get', sessionConstants.clickExec, false);

   const items = [
      {
         label: localize('SIDEBAR.Create', { type: localize(Macro.metadata.label) }),
         icon: 'fas fa-code',
         onPress: ({ focusSource }) => TJSDocumentDialog.documentCreate(Macro, {}, { focusSource })
      },
      {
         label: 'SIDEBAR.ACTIONS.CREATE.Folder',
         icon: 'fas fa-folder',
         condition: () => game.user.isGM,
         onPress: ({ focusSource }) => TJSDocumentDialog.folderCreate({ type: 'Macro' }, { focusSource })
      },
      {
         label: 'bmd.menu.overflow.click-to-exec',
         icon: `far ${clickExec ? 'fa-square-check' : 'fa-square'}`,
         onPress: () => eventbus.triggerSync('bmd:storage:session:item:boolean:swap', sessionConstants.clickExec)
      }
   ];

   // Only add `always on top` option when `alwaysTopFn` is defined.
   if (typeof alwaysOnTopFn === 'function')
   {
      items.push({
         label: 'bmd.menu.overflow.always-on-top',
         icon: `fas fa-arrow-alt-circle-${alwaysOnTop ? 'down' : 'up'}`,
         onPress: alwaysOnTopFn
      });
   }

   items.push({ separator: 'hr' });

   return items;
}
