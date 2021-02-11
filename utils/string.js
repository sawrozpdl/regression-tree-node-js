import { DEBUG } from "../config.js";

/**
 * Checks whether a given data is number.
 *
 * @param {any} val
 */
const isNumber = (val) => val && !isNaN(val);

/**
 * Generates a space to the size of given value.
 *
 * @param {*} val
 */
const spaces = (val = 0) => {
  let str = "";

  for (let i = 0; i < val; i++) {
    str += " ";
  }

  return str;
};

/**
 * Logs info to the console considering the depth value.
 *
 * @param {Number} depth
 * @param  {...any} values
 */
const log = (depth, ...values) => {
  if (DEBUG) {
    console.log(spaces(depth * 2), ...values);
  }
};

export { spaces, isNumber, log };
