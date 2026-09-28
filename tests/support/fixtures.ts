import { test as base, expect } from "@playwright/test";
import { BookingClient } from "./bookingClient";

export const test = base.extend<{ client: BookingClient }>({
  client: async ({ request }, use) => {
    const client = new BookingClient(request);
    await use(client);
    await client.cleanup();
  },
});

export { expect };
