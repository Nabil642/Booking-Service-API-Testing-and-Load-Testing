import { test, expect } from "../support/fixtures";
import { buildBooking } from "../support/testData";

test.describe("Negative and security checks", () => {
  test("update without a token is forbidden", async ({ client }) => {
    const { bookingid } = await (await client.create(buildBooking())).json();

    const response = await client.updateWithoutToken(bookingid, buildBooking());

    expect(response.status()).toBe(403);
  });

  test("delete with a fake token is forbidden and the booking survives", async ({
    client,
  }) => {
    const { bookingid } = await (await client.create(buildBooking())).json();

    const response = await client.removeWithToken(
      bookingid,
      "not-a-real-token",
    );
    expect(response.status()).toBe(403);

    expect((await client.get(bookingid)).status()).toBe(200);
  });

  test("unknown booking id gives 404", async ({ client }) => {
    const response = await client.get(99999999);
    expect(response.status()).toBe(404);
  });

  test("deleting an id that does not exist answers 405 (documented quirk)", async ({
    client,
  }) => {
    const response = await client.remove(99999999);
    expect(response.status()).toBe(405);
  });

  test("booking without a last name is rejected with 400", async ({
    client,
  }) => {
    test.fail(true, "BUG-002: missing field gives a 5xx instead of 400");

    const { lastname, ...incomplete } = buildBooking();
    const response = await client.create(incomplete);

    expect(response.status()).toBe(400);
  });

  test("booking without a last name is at least not accepted", async ({
    client,
  }) => {
    const { lastname, ...incomplete } = buildBooking();
    const response = await client.create(incomplete);

    expect(response.ok()).toBeFalsy();
  });
});
