import { test, expect } from '../support/fixtures';
import { buildBooking } from '../support/testData';

test.describe('Booking lifecycle', () => {
  test('create a booking and read it back @smoke', async ({ client }) => {
    const booking = buildBooking();

    const created = await client.create(booking);
    expect(created.status()).toBe(200);
    const { bookingid, booking: saved } = await created.json();
    expect(saved).toMatchObject(booking);

    const fetched = await client.get(bookingid);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toMatchObject(booking);
  });

  test('a new booking shows up when filtering by last name', async ({ client }) => {
    const booking = buildBooking();
    const { bookingid } = await (await client.create(booking)).json();

    const response = await client.list({ lastname: booking.lastname });

    expect(response.status()).toBe(200);
    const ids = (await response.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(bookingid);
  });

  test('full update replaces every field', async ({ client }) => {
    const { bookingid } = await (await client.create(buildBooking())).json();
    const replacement = buildBooking({ firstname: 'Zara', totalprice: 400, additionalneeds: 'Late checkout' });

    const response = await client.update(bookingid, replacement);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(replacement);
  });

  test('partial update changes only what we send', async ({ client }) => {
    const original = buildBooking({ totalprice: 300 });
    const { bookingid } = await (await client.create(original)).json();

    const response = await client.patch(bookingid, { firstname: 'Maya' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Maya');
    expect(body.lastname).toBe(original.lastname);
    expect(body.totalprice).toBe(300);
  });

  test('deleted booking is gone', async ({ client }) => {
    const { bookingid } = await (await client.create(buildBooking())).json();

    const deleted = await client.remove(bookingid);
    expect(deleted.status()).toBe(201); // documented quirk, 200/204 would be more usual

    const afterwards = await client.get(bookingid);
    expect(afterwards.status()).toBe(404);
  });

  test('creating a booking is fast enough', async ({ client }) => {
    const started = Date.now();
    const response = await client.create(buildBooking());
    const elapsed = Date.now() - started;

    expect(response.ok()).toBeTruthy();
    expect(elapsed, `create took ${elapsed} ms`).toBeLessThan(3000);
  });
});
