/**
 * This utility function is meant to check if a given environment variable is meant to be false or true
 *
 * @param key the environment variable name
 * @param expect whether true or false is expected
 */
export const isEnvVar = (key: string, expect = true): boolean => {
  const value: string | undefined = process.env[key];
  const truthy = value !== 'false' && value !== '0' && !!value;
  return truthy == expect;
};
