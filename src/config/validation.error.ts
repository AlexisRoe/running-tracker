export class ValidationError extends Error {
  readonly reference: string;
  readonly level: "error" | "warning" | "debug" | "info";

  constructor(message: string, reference: string) {
    super(message);

    this.reference = reference;
    this.level = "error";

    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = "ValidationError";
  }
}
