import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f6b4f",
      dark: "#0a4a37",
      light: "#4a9b7f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c77700",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f6f8f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#17211d",
      secondary: "#52605a",
    },
    divider: "#e1e7e3",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 18 },
        sizeLarge: { paddingBlock: 10 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #e1e7e3",
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
