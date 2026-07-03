import { createTheme, Drawer, type MantineColorsTuple } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#fdf6f2",
  "#fbede4",
  "#f7dbca",
  "#f1bc9d",
  "#ea9e71",
  "#e48044",
  "#e96618",
  "#d65d14",
  "#b14d11",
  "#8c3c0d",
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand,
  },
  components: {
    // Top/bottom drawers default to a fixed height (`size`, md = 440px) and
    // scroll their content. Force auto-height so they grow to fit their content
    // (including bottom padding/spacing). Mantine's base CSS still caps the
    // content at the viewport height and falls back to scrolling when needed.
    Drawer: Drawer.extend({
      styles: (_theme, props) =>
        props.position === "bottom" || props.position === "top"
          ? { content: { height: "auto" } }
          : {},
    }),
  },
});
