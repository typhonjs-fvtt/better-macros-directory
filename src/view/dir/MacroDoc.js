export class MacroDoc
{
   /**
    * Execute macro for given document ID.
    *
    * @param {string} documentId - Document ID.
    */
   static exec(documentId)
   {
      /** @type {Macro} */
      const macro = game.macros.get(documentId);

      if (macro) { macro.execute(); }
   }

   /**
    * Open macro sheet for given document ID.
    *
    * @param {string} documentId - Document ID.
    */
   static open(documentId)
   {
      const sheet = game.macros.get(documentId)?.sheet;

      if (!sheet) { return; }

      // If the sheet is already rendered:
      if (sheet.rendered)
      {
         sheet.bringToFront();
         sheet.maximize();
      }
      // Otherwise render the sheet
      else
      {
         sheet.render(true);
      }
   }
}
