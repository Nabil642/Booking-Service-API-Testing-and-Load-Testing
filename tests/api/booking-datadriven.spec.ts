import { test, expect } from "../support/fixtures";
import scenarios from "../../data/bookings.json";

for (const scenario of scenarios) {
  test(`stores and returns booking: ${scenario.name}`, async ({ client }) => {
    const created = await client.create(scenario.payload);
    expect(created.status()).toBe(200);

    const { bookingid } = await created.json();
    const fetched = await client.get(bookingid);

    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toMatchObject(scenario.payload);
  });
}
