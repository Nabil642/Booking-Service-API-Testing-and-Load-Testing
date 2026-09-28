import { APIRequestContext, APIResponse } from "@playwright/test";

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export class BookingClient {
  private token?: string;
  private createdIds: number[] = [];

  constructor(private readonly request: APIRequestContext) {}

  ping() {
    return this.request.get("/ping");
  }

  authenticate(username = "admin", password = "password123") {
    return this.request.post("/auth", { data: { username, password } });
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      const response = await this.authenticate();
      this.token = (await response.json()).token;
    }
    return this.token as string;
  }

  async create(payload: Partial<BookingPayload>): Promise<APIResponse> {
    const response = await this.request.post("/booking", { data: payload });
    if (response.ok()) {
      const body = await response.json().catch(() => undefined);
      if (body?.bookingid) this.createdIds.push(body.bookingid);
    }
    return response;
  }

  list(params: Record<string, string> = {}) {
    return this.request.get("/booking", { params });
  }

  get(id: number | string) {
    return this.request.get(`/booking/${id}`);
  }

  async update(id: number, payload: BookingPayload) {
    return this.request.put(`/booking/${id}`, {
      data: payload,
      headers: await this.authHeader(),
    });
  }

  async patch(id: number, changes: Partial<BookingPayload>) {
    return this.request.patch(`/booking/${id}`, {
      data: changes,
      headers: await this.authHeader(),
    });
  }

  async remove(id: number | string) {
    return this.request.delete(`/booking/${id}`, {
      headers: await this.authHeader(),
    });
  }

  updateWithoutToken(id: number, payload: BookingPayload) {
    return this.request.put(`/booking/${id}`, { data: payload });
  }

  removeWithToken(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }

  async cleanup() {
    for (const id of this.createdIds) {
      await this.remove(id).catch(() => undefined);
    }
    this.createdIds = [];
  }

  private async authHeader() {
    return { Cookie: `token=${await this.getToken()}` };
  }
}
