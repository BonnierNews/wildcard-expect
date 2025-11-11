# @bonniernews/wildcard-expect

A simple utility for extending Chai's `expect` with powerful wildcard matching, perfect for testing dynamic or partially known data structures in your applications. This library allows you to assert the _shape_ and _type_ of your data without needing to know the exact values of certain fields, such as IDs, timestamps, or generated tokens.

## 🚀 Installation

```bash
npm install --save-dev @bonniernews/wildcard-expect
# or
yarn add --dev @bonniernews/wildcard-expect
```

You'll also need to make sure Chai is set up in your test environment.

## ✨ Why Use It?

When testing API responses, database records, or complex object structures, you often encounter fields whose exact values are non-deterministic (e.g., UUIDs, timestamps, unique trace IDs). Standard `expect` assertions would fail if these values changed on each run.

`@bonniernews/wildcard-expect` solves this by providing "wildcard" placeholders. You define the _expected type_ of a field, and the library handles the validation, ensuring your tests are robust and less brittle.

## 💡 Usage

Integrate `wildcard-expect` with your Chai assertions. The library provides an `expect` function that wraps Chai's, allowing you to use wildcards in your expected objects.

### Basic Example

Let's say you're testing an API endpoint that returns a chat message object with a unique ID and a creation timestamp:

```typescript
import wildcard from "@bonniernews/wildcard-expect"; // instead of import { expect } from "chai";

describe("Chat API", () => {
  it("should return a valid chat structure with dynamic fields", () => {
    wildcard.expect(responseBody).to.deep.equal({
      chatId: "some-chat-id-123", // Exact match
      replies: [
        {
          id: wildcard.uuid(), // Expect a valid UUID
          timestamp: wildcard.date(), // Expect a valid Date object or ISO date string
          role: "assistant",
          content: "Hello there!",
          metadata: {
            source: "AI",
            version: wildcard.number(), // Expect a number
            details: wildcard.string(), // Expect a string
          },
        },
        {
          id: wildcard.uuid(),
          timestamp: wildcard.date(),
          role: "user",
          content: "Hi!",
        },
      ],
      traceId: wildcard.traceid(), // Expect a valid trace ID
      url: wildcard.url(), // Expect a valid URL
    });
  });

  it("can be used with other chai methods like .property", () => {
    wildcard.expect(responseBody).to.have.property("chatId", "some-chat-id-123");
    wildcard.expect(responseBody.replies[0]).to.have.property("id", wildcard.uuid());
  });
});
```

### Available Wildcard Types

You can use the following wildcard types:

- `wildcard.any()`: Matches any value.
- `wildcard.string()`: Matches any string.
- `wildcard.number()`: Matches any number.
- `wildcard.object()`: Matches any non-null object.
- `wildcard.array()`: Matches any array.
- `wildcard.fn()`: Matches any function.
- `wildcard.uuid()`: Matches a string that is a valid UUID (v1, v3, v4, v5).
- `wildcard.date()`: Matches a `Date` object or a string that can be parsed into a valid date (e.g., ISO 8601 string).
- `wildcard.traceid()`: Matches a string that is a valid trace ID (e.g., a 32-character hexadecimal string).
- `wildcard.url()`: Matches a string that is a valid URL.

## 🤝 Contributing

We welcome contributions! If you have suggestions for improvements, new wildcard types, or bug fixes, feel free to open an issue or submit a pull request.

## 📦 Publishing

To publish a new version of this library to npm:

Run `npm run bumpp` or:

1.  Run `npm run bump`
1.  Ensure all your changes are committed and pushed to the `main` branch.
2.  Update the `version` field in `package.json` according to [semantic versioning](https://semver.org/).
3.  Run the publish command:

    ```bash
    npm publish --access public
    ```

    This will publish the package to the public npm registry.

---
