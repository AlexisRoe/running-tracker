import { NumberInput, type NumberInputProps } from "@mantine/core";
import { useEffect, useRef } from "react";
import { INPUT_FOCUS_DELAY_MS } from "@/config/constants.const";

/** Props for {@link DistanceInput}; extends Mantine's NumberInput. */
export interface DistanceInputProps extends NumberInputProps {
  /** Focus the input shortly after mount (e.g. when revealed inside a drawer). */
  focusOnStart?: boolean;
}

/** Distance number input in km, preconfigured (non-negative, 2 decimals) with optional mount focus. */
export function DistanceInput(props: DistanceInputProps) {
  const { label, value, onChange, focusOnStart = false, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnStart === true) {
      // Small timeout ensures the drawer animation has time to start/render
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, INPUT_FOCUS_DELAY_MS);

      return () => clearTimeout(timeout);
    }
  }, [focusOnStart]);

  return (
    <NumberInput
      label={label}
      value={value}
      onChange={onChange}
      min={0}
      decimalScale={2}
      suffix=" km"
      autoFocus={true}
      allowNegative={false}
      required
      hideControls
      ref={inputRef}
      {...rest}
    />
  );
}
