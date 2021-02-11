/**
 * Calculates the average of the given number array.
 *
 * @param {String<Number>} data
 */
const average = (data = []) => {
  let sum = 0;

  data.forEach((num) => {
    sum += num;
  });

  return sum / data.length;
};

/**
 * Calculates the standard deviation of the given number array.
 *
 * @param {String<Number>} data
 * @param {Number} avg
 */
const standardDeviation = (data = [], avg = null) => {
  avg = avg || average(data);

  let sqrSum = 0;

  data.forEach((num) => {
    sqrSum += Math.pow(num - avg, 2);
  });

  return Math.sqrt(sqrSum / data.length);
};

/**
 * Calculates the coefficient of variation of the given number array.
 *
 * @param {String<Number>} data
 * @param {Number} avg
 * @param {Number} sd
 */
const cov = (data = [], avg = null, sd = null) => {
  avg = avg || average(data);
  sd = sd || standardDeviation(data, avg);
  return (sd / avg) * 100;
};

export { average, standardDeviation, cov };
