import { test, expect } from "../support/fixtures";

test.describe("Health check and authentication", () => {
  test("ping answers 201 (documented quirk)", async ({ client }) => {
    const response = await client.ping();
    expect(response.status()).toBe(201);
  });

  test("valid credentials return a token", async ({ client }) => {
    const response = await client.authenticate();

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(5);
  });

  test("wrong password does not return a token", async ({ client }) => {
    const response = await client.authenticate("admin", "wrong-password");
    const body = await response.json();

    expect(body.token).toBeUndefined();
    expect(body.reason).toBe("Bad credentials");
  });

  test("wrong password should be rejected with a 4xx status", async ({
    client,
  }) => {
    test.fail(true, "BUG-001: bad credentials return HTTP 200");

    const response = await client.authenticate("admin", "wrong-password");
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
