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
   themeDarkMode: `${constants.moduleName}.theme.dark`
};

export { constants, sessionConstants, settings };

/**
 * @typedef {object} BMDSettings
 */

/**
 * @typedef {object} BMDSessionConstants
 *
 * @property {string} themeDarkMode - Indicates whether dark mode is enabled.
 */