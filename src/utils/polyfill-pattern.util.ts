import { PatternObject, Pattern, PatternString } from '../models/seneca.types';
import jsonic from 'jsonic';

/**
 * This utility prepends required keys and autofills role if none was yet given
 *
 * @param pattern The pattern to be polyfilled
 * @param cmdKey
 * @param role The role to be added to the pattern if it is not in the pattern yet
 * @param roleKey
 */
export const polyfillPattern = (
  pattern: Pattern,
  role?: string,
  cmdKey = 'cmd',
  roleKey = 'role',
): PatternString => {
  // If the pattern is undefined or null, it is an invalid pattern
  if (pattern == null)
    throw new Error('The given message pattern cannot be undefined or null');

  // If the pattern is a string it needs to be converted to an object
  if (typeof pattern === 'string') {
    try {
      pattern = jsonic(pattern) as PatternObject;
    } catch (e) {
      pattern = { [cmdKey]: pattern } as PatternObject;
    }
  }

  // if no cmd was given after processing, throw
  if (pattern[cmdKey] === undefined)
    throw new Error(`No '${cmdKey}' resulted from the given pattern`);

  // if the role was not given yet, add it
  pattern[roleKey] ??= role;

  // return the jsonic string of the pattern
  return jsonic.stringify(pattern);
};
