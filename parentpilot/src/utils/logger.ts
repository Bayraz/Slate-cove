/**
 * Minimal dev logger. Debug output is dev-only. Never log message text,
 * memories or child details: this app handles family data.
 */
type Fields = Record<string, string | number | boolean | undefined>;

const emit = (level: "debug" | "info" | "warn" | "error", scope: string, message: string, fields?: Fields) => {
  if (process.env.NODE_ENV === "test" || (level === "debug" && !__DEV__)) return;
  const line = `[${scope}] ${message}`;
  // eslint-disable-next-line no-console
  console[level](line, ...(fields ? [fields] : []));
};

export const createLogger = (scope: string) => ({
  debug: (message: string, fields?: Fields) => emit("debug", scope, message, fields),
  info: (message: string, fields?: Fields) => emit("info", scope, message, fields),
  warn: (message: string, fields?: Fields) => emit("warn", scope, message, fields),
  error: (message: string, error?: unknown, fields?: Fields) =>
    emit("error", scope, `${message}${error instanceof Error ? `: ${error.message}` : ""}`, fields),
});
