/**
 * Picks only the allowed keys from a request body.
 * Stops clients from writing fields they should not control
 * (e.g. `_id`, `postedBy`, `createdAt`).
 */
const pick = (object, keys) => {
  const result = {};
  if (!object || typeof object !== 'object') return result;

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key) && object[key] !== undefined) {
      result[key] = object[key];
    }
  });

  return result;
};

/** Escapes a user-supplied string so it is safe inside a RegExp. */
const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Turns "12" into 12, leaves anything else untouched. */
const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

module.exports = { pick, escapeRegex, toNumber };
