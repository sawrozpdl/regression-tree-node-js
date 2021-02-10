const average = (data = []) => {
  let sum = 0;

  data.forEach((num) => {
    sum += num;
  });

  return sum / data.length;
};

const standardDeviation = (data = [], avg = null) => {
  avg = avg || average(data);

  let sqrSum = 0;

  data.forEach((num) => {
    sqrSum += Math.pow(num - avg, 2);
  });

  return Math.sqrt(sqrSum / data.length);
};

const cov = (data = [], avg = null, sd = null) => {
  avg = avg || average(data);
  sd = sd || standardDeviation(data, avg);
  return (sd / avg) * 100;
};

export { average, standardDeviation, cov };
