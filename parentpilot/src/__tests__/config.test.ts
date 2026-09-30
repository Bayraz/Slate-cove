import fs from "fs";
import path from "path";
import { demoReasonText, resolveConfig } from "@/config/env";

describe("resolveConfig", () => {
  it("is live only with a valid URL and key", () => {
    expect(resolveConfig({ url: "https://abc.supabase.co", anonKey: "key" })).toEqual({ mode: "live" });
  });
  it("fails gracefully into demo mode when configuration is missing or wrong", () => {
    expect(resolveConfig({})).toEqual({ mode: "demo", reason: "not_configured" });
    expect(resolveConfig({ url: "https://abc.supabase.co" })).toEqual({ mode: "demo", reason: "incomplete" });
    expect(resolveConfig({ anonKey: "key" })).toEqual({ mode: "demo", reason: "incomplete" });
    expect(resolveConfig({ url: "not a url", anonKey: "key" })).toEqual({ mode: "demo", reason: "invalid_url" });
    expect(resolveConfig({ url: "ftp://x.co", anonKey: "key" })).toEqual({ mode: "demo", reason: "invalid_url" });
  });
  it("can be forced into demo mode even when configured", () => {
    expect(resolveConfig({ url: "https://abc.supabase.co", anonKey: "key", forceDemo: true })).toEqual({ mode: "demo", reason: "forced" });
  });
  it("explains demo mode calmly, and says nothing when live", () => {
    expect(demoReasonText({ mode: "live" })).toBeUndefined();
    expect(demoReasonText({ mode: "demo", reason: "incomplete" })).toMatch(/incomplete/);
  });
});

describe("no secrets in the client", () => {
  const root = path.resolve(__dirname, "../..");
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? (e.name === "__tests__" ? [] : walk(p)) : [p];
    });
  const sources = [...walk(path.join(root, "src")), ...walk(path.join(root, "app"))];

  it("never references a service-role key in app code", () => {
    const hits = sources.filter((f) => /service_role|SERVICE_ROLE|serviceRole/.test(fs.readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });
  it("never exposes a secret through an EXPO_PUBLIC_ variable in .env.example", () => {
    const example = fs.readFileSync(path.join(root, ".env.example"), "utf8");
    const names = [...example.matchAll(/^\s*(EXPO_PUBLIC_[A-Z0-9_]+)\s*=/gm)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(0);
    expect(names.filter((n) => /SECRET|SERVICE|PRIVATE|PASSWORD|API_KEY/.test(n!))).toEqual([]);
    expect(example).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/); // no real JWT committed
  });
  it("does not ship a committed .env with values", () => {
    const tracked = fs.existsSync(path.join(root, ".env")) ? fs.readFileSync(path.join(root, ".env"), "utf8") : "";
    expect(tracked).not.toMatch(/service_role/i);
  });
});
