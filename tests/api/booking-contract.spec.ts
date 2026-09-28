import { test, expect } from "../support/fixtures";
import { buildBooking } from "../support/testData";
import {
  bookingSchema,
  createResponseSchema,
  bookingListSchema,
  schemaErrors,
} from "../support/schemas";

test.describe("JSON schema contract", () => {
  test("POST /booking response matches the schema", async ({ client }) => {
    const response = await client.create(buildBooking());
    expect(schemaErrors(createResponseSchema, await response.json())).toBe("");
  });

  test("GET /booking/{id} response matches the schema", async ({ client }) => {
    const { bookingid } = await (await client.create(buildBooking())).json();
    const response = await client.get(bookingid);
    expect(schemaErrors(bookingSchema, await response.json())).toBe("");
  });

  test("GET /booking list matches the schema", async ({ client }) => {
    const response = await client.list();
    const body = await response.json();

    expect(body.length).toBeGreaterThan(0);
    expect(schemaErrors(bookingListSchema, body)).toBe("");
  });
});
