import { Pattern, PatternString } from '../models/seneca.types';
/**
 * This utility prepends required keys and autofills role if none was yet given
 *
 * @param pattern The pattern to be polyfilled
 * @param cmdKey
 * @param role The role to be added to the pattern if it is not in the pattern yet
 * @param roleKey
 */
export declare const polyfillPattern: (pattern: Pattern, role?: string, cmdKey?: string, roleKey?: string) => PatternString;
