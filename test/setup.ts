import "mocha";
import * as chai from "chai";
import "mocha-cakes-2";

chai.config.truncateThreshold = 0;
chai.config.includeStack = true;

(global as any).expect = chai.expect;

declare global {
  const expect: Chai.ExpectStatic;
}
