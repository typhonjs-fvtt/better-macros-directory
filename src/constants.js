/**
 * Defines the main constants for module name and label.
 *
 * @type {{moduleName: string, moduleLabel: string}}
 */
const constants = {
   moduleLabel: `Better Macro Directory`,
   moduleName: 'better-macro-directory'
};

/**
 * @type {BMDSettings} Defines all the module settings for world and client.
 */
const settings = {
};

/**
 * @type {BMDSessionConstants} Defines all the module session storage static constants.
 */
const sessionConstants = {
   bmdOpen: `${constants.moduleName}.open`,
   bmdPosition: `${constants.moduleName}.position`,
   bmdStyleSelect: `${constants.moduleName}.stylesheet.select`,
   propertyFilterEnabled: `${constants.moduleName}.property.filter.enabled`,
   propertyFilterKeyword: `${constants.moduleName}.property.filter.keyword`,
   themeDarkMode: `${constants.moduleName}.theme.dark`
}

export { constants, sessionConstants, settings };

/**
 * @typedef {object} BMDSettings
 */

/**
 * @typedef {object} BMDSessionConstants
 *
 * @property {string} bmdOpen - Indicates whether BetterMacroDirectory app is open.
 *
 * @property {string} bmdPosition - Stores the position of BetterMacroDirectory.
 *
 * @property {string} bmdStyleSelect - Current selected stylesheet.
 *
 * @property {string} propertyFilterEnabled - Whether property keyword filtering is enabled.
 *
 * @property {string} propertyFilterKeyword - Stores any entered keyword for property filtering.
 *
 * @property {string} themeDarkMode - Indicates whether dark mode is enabled.
 */