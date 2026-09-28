import { BookingPayload } from "./bookingClient";

const firstNames = ["Sara", "Imran", "Lina", "Omar", "Tania", "Rafi"];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function buildBooking(
  overrides: Partial<BookingPayload> = {},
): BookingPayload {
  return {
    firstname: pick(firstNames),
    lastname: `Tester${Date.now()}${Math.floor(Math.random() * 1000)}`,
    totalprice: 100 + Math.floor(Math.random() * 400),
    depositpaid: true,
    bookingdates: { checkin: "2026-11-01", checkout: "2026-11-05" },
    additionalneeds: "Breakfast",
    ...overrides,
  };
}
