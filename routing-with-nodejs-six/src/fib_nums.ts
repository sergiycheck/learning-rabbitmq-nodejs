export function getFibonacciNums(length: number) {
  const arr: number[] = [];
  function fibonacci(first: number, second: number, counter: number, length: number) {
    if (counter > length) {
      return arr;
    }

    arr.push(first);

    const nextFirst = second;
    const nextSecond = second + first;
    let nextCounter = ++counter;

    return fibonacci(nextFirst, nextSecond, nextCounter, length);
  }

  fibonacci(0, 1, 0, length);

  return arr;
}
