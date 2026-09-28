import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });
const datePattern = "^\\d{4}-\\d{2}-\\d{2}";

export const bookingSchema = {
  type: "object",
  required: [
    "firstname",
    "lastname",
    "totalprice",
    "depositpaid",
    "bookingdates",
  ],
  properties: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    totalprice: { type: "number" },
    depositpaid: { type: "boolean" },
    additionalneeds: { type: "string" },
    bookingdates: {
      type: "object",
      required: ["checkin", "checkout"],
      properties: {
        checkin: { type: "string", pattern: datePattern },
        checkout: { type: "string", pattern: datePattern },
      },
    },
  },
};

export const createResponseSchema = {
  type: "object",
  required: ["bookingid", "booking"],
  properties: {
    bookingid: { type: "integer" },
    booking: bookingSchema,
  },
};

export const bookingListSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["bookingid"],
    properties: { bookingid: { type: "integer" } },
  },
};

export function schemaErrors(schema: object, data: unknown): string {
  const validate = ajv.compile(schema);
  return validate(data) ? "" : ajv.errorsText(validate.errors);
}
