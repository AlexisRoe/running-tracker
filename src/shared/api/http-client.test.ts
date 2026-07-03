import { httpClient } from "@shared/api/http-client";
import { describe, expect, it } from "vitest";

describe("httpClient", () => {
  it("defaults baseURL to /api when VITE_API_BASE_URL is unset", () => {
    expect(httpClient.defaults.baseURL).toBe("/api");
  });

  it("sends JSON content-type header", () => {
    expect(httpClient.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
