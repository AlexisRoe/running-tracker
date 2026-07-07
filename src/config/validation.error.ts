/** Error thrown when user input fails validation, carrying a stable reference id for tracing. */
export class ValidationError extends Error {
  /** Stable identifier for this specific validation failure (used for tracing/logging). */
  readonly reference: string;
  /** Severity of the validation failure. */
  readonly level: "error" | "warning" | "debug" | "info";

  constructor(message: string, reference: string) {
    super(message);

    this.reference = reference;
    this.level = "error";

    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = "ValidationError";
  }
}
