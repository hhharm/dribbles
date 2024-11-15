function divideNumbers(a, b) {
  const r = a % b;
  return [`${(a - r) / b}`, `${r}`];
}
// console.log = function () {};

function stripZeroes(numStr) {
  if (numStr === "0") return "0";
  return numStr
    .replace(/^0+([1-9]|0\.)/, "$1")
    .replace(/\.0+$/, "")
    .replace(/\.$/, "");
}

function integerDivision(a, b) {
  // console.log(`a: ${a} / b: ${b}`);
  let res = "";
  let m = a.length;
  let n = b.length;
  let pos = n;
  let curRest = a.slice(0, pos);

  // console.log(`m: ${m}, n: ${n}, compare: ${compareStrings(a, b)}`);

  if (m < n) {
    return ["0", a];
  }
  if (m === n) {
    if (compareStrings(a, b) < 0) {
      return ["0", a];
    }

    const [q, r] = divideStrings(curRest, b);
    return [q, r];
  }

  if (compareStrings(curRest, b) < 0) {
    pos++;
    curRest += a[pos - 1];
  }

  let isFN = false;
  // console.log(`m: ${m}, n: ${n}, pos: ${pos}, curRest: ${curRest}`);
  do {
    // console.log(`pos: ${pos}, curRest: ${curRest}, res: "${res}"`);
    // if b > curRest
    if (compareStrings(curRest, b) < 0) {
      if (isFN) {
        res += "0";
      } else {
        isFN = true;
      }
      pos += 1;
      curRest = Number(curRest) === 0 ? a[pos - 1] : curRest + a[pos - 1];
      // console.log(`curRest: ${curRest}, b: ${b}, isFN: ${isFN}, pos: ${pos}`);
      if (compareStrings(curRest, b) < 0) {
        continue;
      }
    }
    // else
    isFN = false;
    const [q, r] = divideStrings(curRest, b);
    res += q;
    curRest = r;
    // console.log(`q: ${q}, curRest: ${curRest}, res: ${res}`);
  } while (pos < m);
  if (isFN) {
    res += "0";
  }
  return [(res || "0").toString(), curRest.toString()];
}
function getPart(input, startPos, maxLength = 15) {
  return [
    Number(input.slice(startPos, startPos + maxLength)),
    input.slice(startPos + maxLength),
  ];
}
// Helper function to perform long division for large numbers as strings
function decimalPartDivision(a, b, maxDecimals) {
  // console.log(`0.${a} / 0.${b}`);
  let res = "";
  let curRest = a;
  if (Number(curRest) !== 0 && compareStrings(curRest, b) < 0) {
    curRest += "0";
  }
  let isFN = false;
  while (res.length < maxDecimals) {
    // console.log(`curRest: ${curRest}, res: "${res}"`);
    if (Number(curRest) === 0) {
      break;
    }
    // if b > curRest
    if (compareStrings(curRest, b) < 0) {
      if (isFN) {
        res += "0";
        if (res.length === maxDecimals) {
          break;
        }
      } else {
        isFN = true;
      }
      curRest += "0";
      // console.log(`curRest: ${curRest}, b: ${b}, isFN: ${isFN}, res: "${res}"`);
      if (compareStrings(curRest, b) < 0) {
        continue;
      }
    }
    // else
    isFN = false;
    const [q, r] = divideStrings(curRest, b);
    res += q;
    curRest = r;
  }

  return res;
}

function divideStrings(a, b) {
  let aNum = Number(a);
  let bNum = Number(b);
  if (Number.isSafeInteger(bNum)) {
    if (Number.isSafeInteger(aNum)) {
      return divideNumbers(aNum, bNum);
    }
    if (bNum === 1) {
      return [a, "0"];
    }
  }
  let x = 0;
  let r = a;
  while (compareStrings(r, b) >= 0) {
    x++;
    r = subtractStrings(r, b);
  }
  return [x.toString(), r.toString()];
}

// String-based subtraction for large numbers
function subtractStrings(a, b) {
  let aNum = Number(a);
  let bNum = Number(b);
  if (Number.isSafeInteger(aNum) && Number.isSafeInteger(bNum)) {
    return (aNum - bNum).toString();
  }

  let res = "";
  let borrow = 0;
  a = a.padStart(b.length, "0");
  b = b.padStart(a.length, "0");

  for (let i = a.length - 1; i >= 0; i--) {
    let diff = parseInt(a[i], 10) - parseInt(b[i], 10) - borrow;
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    res = diff + res;
  }

  return res.replace(/^0+/, "") || "0";
}

// Compare two numeric strings
function compareStrings(a, b) {
  let aNum = Number(a);
  let bNum = Number(b);
  if (Number.isSafeInteger(a) && Number.isSafeInteger(b)) {
    return a - b;
  }
  let aa = a.replace(/^0+/, "");
  let bb = b.replace(/^0+/, "");
  if (aa.length !== bb.length) {
    return aa.length - bb.length;
  }
  return aa.localeCompare(bb);
}

function largeDiv(dividendStr, divisorStr) {
  // Validate inputs
  if (divisorStr === "0") {
    throw new Error("Division by zero");
  }

  // Remove signs and detect negativity
  const isNegative =
    (dividendStr[0] === "-" ? 1 : 0) ^ (divisorStr[0] === "-" ? 1 : 0);
  const dividend = dividendStr.replace("-", "").split(".");
  const divisor = divisorStr.replace("-", "").split(".");

  // Normalize dividend and divisor by removing decimals
  const dividendScale = dividend.length > 1 ? dividend[1].length : 0;
  const divisorScale = divisor.length > 1 ? divisor[1].length : 0;
  const maxScale = Math.max(dividendScale, divisorScale);

  const scaledA = dividend[0] + (dividend[1] || "").padEnd(maxScale, "0");
  const scaledB = divisor[0] + (divisor[1] || "").padEnd(maxScale, "0");
  const [q, r] = integerDivision(scaledA, scaledB);
  let integerPart = q;
  let restPart = r;

  // Perform long division for decimal part
  let decimalPart = "";
  if (restPart !== "0") {
    decimalPart = decimalPartDivision(restPart, scaledB, 20);
  }

  // Construct the result
  let result = integerPart || "0";
  if (decimalPart) {
    result += "." + decimalPart;
  }

  return isNegative ? "-" + stripZeroes(result) : stripZeroes(result);
}

function largeDivWithSplit(dividendStr, divisorStr) {
  // Validate inputs
  if (divisorStr === "0") {
    throw new Error("Division by zero");
  }

  // Remove signs and detect negativity
  const isNegative =
    (dividendStr[0] === "-" ? 1 : 0) ^ (divisorStr[0] === "-" ? 1 : 0);
  const dividend = dividendStr.replace("-", "").split(".");
  const divisor = divisorStr.replace("-", "").split(".");

  let integerPart = "";
  let restPart = "";
  // Normalize dividend and divisor by removing decimals
  const dividendScale = dividend.length > 1 ? dividend[1].length : 0;
  const divisorScale = divisor.length > 1 ? divisor[1].length : 0;
  const maxScale = Math.max(dividendScale, divisorScale);

  const scaledA = dividend[0] + (dividend[1] || "").padEnd(maxScale, "0");
  const scaledB = divisor[0] + (divisor[1] || "").padEnd(maxScale, "0");

  const scaledBNum = Number(scaledB);
  if (Number.isSafeInteger(scaledBNum)) {
    let pos = 0;
    let a = scaledA;
    while (true) {
      const [part, rest] = getPart(a, pos, 15);
      const [q, r] = divideNumbers(part, scaledBNum);
      integerPart += q;
      restPart = `${r}${rest}`;
      if (Number(rest) < scaledBNum) {
        break;
      }
    }
  } else {
    const [q, r] = integerDivision(scaledA, scaledB);
    integerPart = q;
    restPart = r;
  }

  // Perform long division for decimal part
  let decimalPart = "";
  if (restPart !== "0") {
    decimalPart = decimalPartDivision(restPart, scaledB, 20);
  }

  // Construct the result
  let result = integerPart || "0";
  if (decimalPart) {
    result += "." + decimalPart;
  }

  return (isNegative ? "-" : "") + stripZeroes(result);
}

const check = (act, exp) => {
  if (exp instanceof Array && act instanceof Array) {
    if (exp.join(", ") !== act.join(", ")) {
      throw new Error(`Expected ${exp}, but got ${act}`);
    }
  } else if (act instanceof Array) {
    if (exp !== act[0]) {
      throw new Error(`Expected ${exp}, but got ${act[0]} (${act[1]})`);
    }
  } else if (exp !== act) {
    throw new Error(`Expected ${exp}, but got ${act}`);
  }
};

// helpers tests

const conf = {
  testInt: !true,
  testDec: !true,
  mainTest: true,
  longTest: true,
};

if (conf.testInt) {
  check(integerDivision("22", "7"), ["3", "1"]);
  check(integerDivision("6", "3"), ["2", "0"]);
  check(integerDivision("100", "3"), ["33", "1"]);
  check(integerDivision("100", "300"), ["0", "100"]);
  check(integerDivision("100", "5"), ["20", "0"]);
  check(integerDivision("101", "5"), ["20", "1"]);
  check(integerDivision("1403", "5"), ["280", "3"]);
  check(integerDivision("2240", "5"), ["448", "0"]);
  check(integerDivision("2240", "5"), ["448", "0"]);
  check(integerDivision("1010", "5"), ["202", "0"]);
  check(integerDivision("9110", "5"), ["1822", "0"]);
}

if (conf.testDec) {
  check(decimalPartDivision("1", "3", 5), "33333");
  check(decimalPartDivision("1", "2", 5), "5");
  // not sure if tests below are correct
  // check(decimalPartDivision("100", "5", 5), "00000");
  // check(decimalPartDivision("101", "5", 5), "20000");
  // check(decimalPartDivision("1403", "5", 5), "60000");
  // check(decimalPartDivision("2240", "5", 5), "80000");
  // check(decimalPartDivision("1010", "5", 5), "20000");
  // check(decimalPartDivision("9110", "5", 5), "80000");
}
function logExecutionTime(
  fn,
  withArgs = true,
  withResult = true,
  withTime = true
) {
  return function (...args) {
    withArgs &&
      console.log(
        `Function ${fn.name || "anonymous function"} called with arguments:`,
        args
      );
    const start = process.hrtime.bigint();

    let result;
    try {
      result = fn(...args);
      withResult &&
        console.log(`Result of ${fn.name || "anonymous function"}:`, result);
    } catch (error) {
      console.error(`Error during execution of ${fn.name}:`, error);
      throw error;
    }

    const end = process.hrtime.bigint();
    const executionTime = Number(end - start) / 1e6; // Convert nanoseconds to milliseconds
    withTime &&
      console.log(
        `Execution time for ${
          fn.name || "anonymous function"
        }: ${executionTime.toFixed(3)} ms`
      );

    return [result, executionTime];
  };
}

// const largeDivWr = logExecutionTime(largeDiv);
const largeDivWSplit = logExecutionTime(largeDivWithSplit, true, false, true);
const largeDivRegWr = logExecutionTime(largeDiv, true, false, true);
[largeDivRegWr, largeDivWSplit].forEach((largeDivWr) => {
  if (conf.mainTest) {
    check(largeDivWr("6", "2"), "3");
    check(largeDivWr("5", "2"), "2.5");
    check(largeDivWr("13.25", "0.53"), "25");
    check(largeDivWr("0", "20"), "0");
    check(largeDivWr("0", "20"), "0");

    try {
      // console.log(largeDivWr("10", "0")); // Throws error
    } catch (e) {
      console.error(e.message); // "Division by zero"
    }

    check(largeDivWr("-6", "2"), "-3");
    check(largeDivWr("-5", "-2"), "2.5");
    check(largeDivWr("13.25", "-0.53"), "-25");

    check(largeDivWr("1", "3"), "0.33333333333333333333");
    check(largeDivWr("1", "9"), "0.11111111111111111111");
    check(largeDivWr("22", "7"), "3.14285714285714285714");
    check(largeDivWr("11", "71"), "0.15492957746478873239");
    check(largeDivWr("1", "10000000000000000000000000"), "0");
    check(largeDivWr("50", "3"), "16.66666666666666666666");
    check(largeDivWr("12.25", "0.765625"), "16");
    check(largeDivWr("0.5", "0.866025403"), "0.57735026971258486282");
  }

  if (conf.longTest) {
    check(
      largeDivWr("57657158965697612113263438787665279499022", "6"),
      "9609526494282935352210573131277546583170.33333333333333333333"
    );
    check(
      largeDivWr("57657158965697612113263438787665279499022", "6"),
      "9609526494282935352210573131277546583170.33333333333333333333"
    );
    check(
      largeDivWr(
        "57657158304923049284023984.023482304965697612113263438787665279499022",
        "6"
      ),
      "9609526384153841547337330.67058038416094960201"
    );
    check(largeDivWr("1", "0.00000000000000000001"), "123");
    check(largeDivWr("11", "71"), "0.15492957746478873239");
  }
});

// const divideNUm = logExecutionTime(

//   false,
//   false,
//   false
// );

// const divideStr = logExecutionTime(
//   function str(a, b) {
//     let x = 0;
//     let r = a;
//     while (compareStrings(r, b) >= 0) {
//       x++;
//       r = subtractStrings(r, b);
//     }
//     return [x.toString(), r.toString()];
//   },
//   false,
//   false,
//   false
// );

// for (let i = 0; i < 10; i++) {
//   const n = divideN(10000, 3);
//   const s = divideStr("10000", "3");
//   console.log(n, s, n < s);
// }

// const log = logExecutionTime(largeDiv, false, false, false);
// for (let i = 0; i < 10; i++) {
//   console.log("next");
//   console.log(log("1", "3"));
//   console.log(log("1", "9"));
//   console.log(log("22", "7"));
//   console.log(log("11", "71"));
//   console.log(log("50", "3"));
//   console.log(log("12.25", "0.765625"));
//   console.log(log("1", "3"));
//   console.log(log("0.5", "0.866025403"));
//   console.log(log("1", "10000000000000000000000000"));
// }
