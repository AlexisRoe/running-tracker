import { NumberInput, type NumberInputProps } from "@mantine/core";
import { useEffect, useRef } from "react";

const DELAY_IN_MILLISECONDS = 750;

export interface DistanceInputProps extends NumberInputProps {
  focusOnStart?: boolean;
}

export function DistanceInput(props: DistanceInputProps) {
  const { label, value, onChange, focusOnStart = false, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnStart === true) {
      // Small timeout ensures the drawer animation has time to start/render
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, DELAY_IN_MILLISECONDS);

      return () => clearTimeout(timeout);
    }
  }, [focusOnStart]);

  return (
    <NumberInput
      label={label}
      value={value}
      onChange={onChange}
      min={0}
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
