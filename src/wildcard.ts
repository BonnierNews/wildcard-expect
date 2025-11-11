import { expect } from "chai";

import { isValidTraceId } from "./is-valid-traceid";
import { isValidUrl } from "./is-valid-url";
import { isValidUuid } from "./is-valid-uuid";

function replaceWildcards<T, U>(expected: T, actual: U): T {
  if (typeof expected !== "object" || expected === null) {
    return expected;
  }
  if (Array.isArray(expected)) {
    return expected.map((item, index) => replaceWildcards(item, (actual as any)?.[index])) as T;
  }

  const result: { [key: string]: any } = {};
  for (const key in expected) {
    if (Object.prototype.hasOwnProperty.call(expected, key)) {
      if ((expected as any)[key] && (expected as any)[key].__wildcard) {
        result[key] = (actual as any)?.[key];
      } else {
        result[key] = replaceWildcards((expected as any)[key], (actual as any)?.[key]);
      }
    }
  }
  return result as T;
}

function validateWildcards(expected: any, actual: any, path = ""): void {
  if (typeof expected !== "object" || expected === null) {
    return;
  }
  if (Array.isArray(expected)) {
    expected.forEach((item, index) => validateWildcards(item, actual?.[index], `${path}[${index}]`));
    return;
  }

  for (const key in expected) {
    if (Object.prototype.hasOwnProperty.call(expected, key)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (expected[key] && expected[key].__wildcard) {
        switch (expected[key].__wildcard) {
          case "any":
            break;
          case "string":
            if (typeof actual[key] !== "string") {
              throw new Error(`Expected ${currentPath} to be a string, but got ${typeof actual[key]}`);
            }
            break;
          case "object":
            if (typeof actual[key] !== "object" || actual[key] === null) {
              throw new Error(`Expected ${currentPath} to be an object, but got ${typeof actual[key]}`);
            }
            break;
          case "array":
            if (!Array.isArray(actual[key])) {
              throw new Error(`Expected ${currentPath} to be an array, but got ${typeof actual[key]}`);
            }
            break;
          case "number":
            if (typeof actual[key] !== "number") {
              throw new Error(`Expected ${currentPath} to be a number, but got ${typeof actual[key]}`);
            }
            break;
          case "function":
            if (typeof actual[key] !== "function") {
              throw new Error(`Expected ${currentPath} to be a function, but got ${typeof actual[key]}`);
            }
            break;
          case "uuid":
            if (!isValidUuid(actual[key])) {
              throw new Error(`Expected ${currentPath} to be a valid UUID, but got ${actual[key]}`);
            }
            break;
          case "traceid":
            if (!isValidTraceId(actual[key])) {
              throw new Error(`Expected ${currentPath} to be a valid trace ID, but got ${actual[key]}`);
            }
            break;
          case "url":
            if (!isValidUrl(actual[key])) {
              throw new Error(`Expected ${currentPath} to be a valid URL, but got ${actual[key]}`);
            }
            break;
          case "date":
            if (!(actual[key] instanceof Date) && (typeof actual[key] !== "string" || isNaN(Date.parse(actual[key])))) {
              throw new Error(
                `Expected ${currentPath} to be a Date object or a valid ISO date string, but got ${actual[key]}`
              );
            }
            break;
          default:
            throw new Error(`Unknown wildcard type ${expected[key].__wildcard} at ${currentPath}`);
        }
      } else {
        validateWildcards(expected[key], actual[key], currentPath);
      }
    }
  }
}

function createExpectWithWildCard(actual: any): ReturnType<typeof expect> {
  const methods = [ "equal", "eql", "property", "include", "members", "keys" ];
  const deepMethods = [ "equal", "include", "eql" ];

  const createMethod =
    (method: string) =>
      (expected: any, ...args: any[]) => {
        const replacedExpected = replaceWildcards(expected, actual);
        if (method === "property" && args.length > 0) {
          const replacedValue = replaceWildcards(args[0], actual[expected]);
          (expect(actual) as any).to.have.property(expected, replacedValue);
        } else {
          (expect(actual) as any).to[method](replacedExpected, ...args);
        }
        validateWildcards(expected, actual);
      };

  const createDeepMethod = (method: string) => (expected: any) => {
    const replacedExpected = replaceWildcards(expected, actual);
    (expect(actual) as any).to.deep[method](replacedExpected);
    validateWildcards(expected, actual);
  };

  const expectWithWildCard: any = { to: {} };

  methods.forEach((method) => {
    expectWithWildCard.to[method] = createMethod(method);
  });

  expectWithWildCard.to.deep = {};
  deepMethods.forEach((method) => {
    expectWithWildCard.to.deep[method] = createDeepMethod(method);
  });

  return expectWithWildCard;
}

const any = () => ({ __wildcard: "any" });
const string = () => ({ __wildcard: "string" });
const number = () => ({ __wildcard: "number" });
const uuid = () => ({ __wildcard: "uuid" });
const date = () => ({ __wildcard: "date" });
const traceid = () => ({ __wildcard: "traceid" });
const fn = () => ({ __wildcard: "function" });
const object = () => ({ __wildcard: "object" });
const array = () => ({ __wildcard: "array" });
const url = () => ({ __wildcard: "url" });

export default {
  any,
  string,
  number,
  uuid,
  traceid,
  date,
  array,
  fn,
  object,
  url,
  expect: createExpectWithWildCard,
};
