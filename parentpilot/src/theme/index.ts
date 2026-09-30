/** Design tokens. Warm, calm, high-contrast enough for tired eyes (WCAG AA for text). */
export const colors = {
  background: "#FBF6EF",
  surface: "#FFFFFF",
  surfaceMuted: "#F3EADF",
  border: "#E7DCCD",
  text: "#2B2622",
  textSecondary: "#655C53", // 5.9:1 on background
  primary: "#3F6B5B", // 6.3:1 with white text
  primaryText: "#FFFFFF",
  primarySoft: "#E3EEE8",
  accentSoft: "#F6E1D1",
  safetyBackground: "#FDEEE3",
  safetyBorder: "#D98B5F",
  danger: "#A33A2C",
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { md: 14, lg: 20, pill: 999 } as const;
/** Minimum touch target (Apple HIG 44pt / Material 48dp). */
export const MIN_TOUCH = 48;

export const typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const },
  title: { fontSize: 22, lineHeight: 30, fontWeight: "600" as const },
  body: { fontSize: 17, lineHeight: 26, fontWeight: "400" as const },
  bodyStrong: { fontSize: 17, lineHeight: 26, fontWeight: "600" as const },
  secondary: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
};
export type TextVariant = keyof typeof typography;
