import { describe, expect, it } from "vitest";
import { ValidationError } from "@/config/validation.error";

describe("ValidationError", () => {
  it("sets message, reference, level and name", () => {
    const error = new ValidationError("Invalid input", "REF-123");

    expect(error.message).toBe("Invalid input");
    expect(error.reference).toBe("REF-123");
    expect(error.level).toBe("error");
    expect(error.name).toBe("ValidationError");
  });

  it("is an instance of both ValidationError and Error", () => {
    const error = new ValidationError("Invalid input", "REF-123");

    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(Error);
  });
});
