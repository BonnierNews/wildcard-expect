import wildcard from "../index";

describe("Testing using wildcards", () => {
  it("should validate the object structure", () => {
    const obj = {
      name: "John",
      age: 30,
      isActive: true,
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
      isActive: wildcard.boolean(),
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

  it("should accept UUID versions 1 through 8", () => {
    const uuids = {
      v1: "c232ab00-9414-11ec-b3c8-9e6bdeced846",
      v3: "5df41881-3aed-3515-88a7-2f4a814cf09e",
      v4: "919108f7-52d1-4320-9bac-f847db4148a8",
      v5: "2ed6657d-e927-568b-95e1-2665a8aea6a2",
      v6: "1ec9414c-232a-6b00-b3c8-9e6bdeced846",
      v7: "017f22e2-79b0-7cc3-98c4-dc0c0c07398f",
      v8: "320c3d4d-cc00-875b-8ec9-32b5f3e2e3a1",
    };

    wildcard.expect(uuids).to.deep.equal({
      v1: wildcard.uuid(),
      v3: wildcard.uuid(),
      v4: wildcard.uuid(),
      v5: wildcard.uuid(),
      v6: wildcard.uuid(),
      v7: wildcard.uuid(),
      v8: wildcard.uuid(),
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
