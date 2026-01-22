import wildcard from "../index";

describe("Testing using wildcards", () => {
  it("should validate the object structure", () => {
    const obj = {
      name: "John",
      age: 30,
      city: "New York",
      colors: ["red", "green", "blue"],
      additionalConfig: {
        a: "a",
        b: "b",
      },
      nestedValidation: {
        field1: "value1",
        field2: "value2",
      },
      anyField: "value",
      dateField: "2023-01-01",
      traceId: "123e4567e89b12d3a456426614174000",
      uuidField: "123e4567-e89b-12d3-a456-426614174000",
      functionField: () => {
        return 123;
      },
      urlField: "https://example.com",
    };

    wildcard.expect(obj).to.deep.equal({
      name: wildcard.string(),
      age: wildcard.number(),
      city: wildcard.string(),
      colors: wildcard.array(),
      additionalConfig: wildcard.object(),
      nestedValidation: {
        field1: wildcard.string(),
        field2: wildcard.string(),
      },
      anyField: wildcard.any(),
      dateField: wildcard.date(),
      traceId: wildcard.traceid(),
      uuidField: wildcard.uuid(),
      functionField: wildcard.fn(),
      urlField: wildcard.url(),
    });
  });

  it("should validate the object structure with null values in object", () => {
    const obj = {
      name: null,
      person: {
        score: [null],
      },
    };

    wildcard.expect(obj).to.deep.equal({
      name: null,
      person: {
        score: wildcard.array(),
      },
    });
  });
});
