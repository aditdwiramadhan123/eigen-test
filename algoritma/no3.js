function countOccurrences(input, query) {
  const result = [];

  query.forEach((word) => {
    const count = input.filter((item) => item === word).length;
    result.push(count);
  });

  return result;
}

const INPUT = ["xc", "dz", "bbb", "dz"];
const QUERY = ["bbb", "ac", "dz"];
const OUTPUT = countOccurrences(INPUT, QUERY);

console.log(OUTPUT);
