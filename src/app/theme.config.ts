import {
  ActionIcon,
  Alert,
  Button,
  Card,
  createTheme,
  Drawer,
  type MantineColorsTuple,
  Paper,
  Tooltip,
} from "@mantine/core";

/** The app's orange brand color ramp (Mantine shades 0–9, light → dark). */
const brand: MantineColorsTuple = [
  "#fff1e6",
  "#ffe1cc",
  "#ffc39b",
  "#ffa264",
  "#fe8637",
  "#fe741a",
  "#ff6a09",
  "#e45900",
  "#cb4e00",
  "#b14100",
];

/** Mantine theme: brand palette, Space Grotesk typography, and per-component defaults. */
export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 5 },
  colors: {
    brand,
  },
  defaultRadius: "lg",
  fontFamily:
    "'Space Grotesk Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily:
      "'Space Grotesk Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "2rem", lineHeight: "1.2" },
    },
  },
  components: {
    Paper: Paper.extend({
      defaultProps: {
        shadow: "xs",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        shadow: "xs",
        radius: "lg",
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: "xl",
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        radius: "xl",
      },
    }),
    Alert: Alert.extend({
      defaultProps: {
        radius: "lg",
      },
    }),
    // Mantine inverts the tooltip relative to the surrounding surface by
    // default (dark tooltip in light mode, light tooltip in dark mode);
    // match the surrounding surface instead: white/black text in light
    // mode, black/white text in dark mode.
    Tooltip: Tooltip.extend({
      vars: () => ({
        tooltip: {
          "--tooltip-bg": "light-dark(var(--mantine-color-white), var(--mantine-color-black))",
          "--tooltip-color": "light-dark(var(--mantine-color-black), var(--mantine-color-white))",
        },
      }),
      styles: {
        tooltip: {
          border: "1px solid light-dark(var(--mantine-color-gray-6), var(--mantine-color-white))",
        },
      },
    }),
    // Top/bottom drawers default to a fixed height (`size`, md = 440px) and
    // scroll their content. Force auto-height so they grow to fit their content
    // (including bottom padding/spacing). Mantine's base CSS still caps the
    // content at the viewport height and falls back to scrolling when needed.
    Drawer: Drawer.extend({
      styles: (_theme, props) =>
        props.position === "bottom" || props.position === "top"
          ? {
              content: {
                height: "auto",
                borderTopLeftRadius: "var(--mantine-radius-xl)",
                borderTopRightRadius: "var(--mantine-radius-xl)",
              },
            }
          : {},
    }),
  },
});
