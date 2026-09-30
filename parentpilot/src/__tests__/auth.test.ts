import { classifyAuthError } from "@/auth/errors";
import { createSupabaseAuthService, interpretSignUp } from "@/auth/supabaseAuthService";

const mockAuth = {
  getSession: jest.fn(),
  onAuthStateChange: jest.fn(),
  signUp: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  resetPasswordForEmail: jest.fn(),
};
jest.mock("@/data/supabase/client", () => ({ getSupabase: () => ({ auth: mockAuth }) }));

beforeEach(() => jest.resetAllMocks());

describe("classifyAuthError", () => {
  it.each([
    [{ code: "invalid_credentials", status: 400 }, "invalid_credentials"],
    [{ code: "user_already_exists", status: 422 }, "existing_account"],
    [{ code: "email_exists" }, "existing_account"],
    [{ code: "email_not_confirmed" }, "email_not_confirmed"],
    [{ code: "weak_password" }, "weak_password"],
    [{ code: "over_request_rate_limit", status: 429 }, "rate_limited"],
    [{ status: 429 }, "rate_limited"],
    [{ name: "AuthRetryableFetchError", status: 0 }, "network"],
    [{ message: "TypeError: Network request failed" }, "network"],
    [{ code: "something_new" }, "unknown"],
    [null, "unknown"],
  ])("%j -> %s", (error, expected) => expect(classifyAuthError(error)).toBe(expected));
});

describe("sign-up interpretation", () => {
  const session = { access_token: "t" } as never;
  it("is usable immediately when the project returns a session (confirmation off)", () => {
    expect(interpretSignUp({ user: { identities: [{}] } as never, session })).toEqual({ ok: true });
  });
  it("tells the parent to check their email when there is no session (confirmation on)", () => {
    expect(interpretSignUp({ user: { identities: [{}] } as never, session: null })).toEqual({ ok: true, needsEmailConfirmation: true });
  });
  it("does not treat Supabase's hidden 'already registered' response as a new account", () => {
    const result = interpretSignUp({ user: { identities: [] } as never, session: null });
    expect(result).toMatchObject({ ok: false, reason: "existing_account" });
  });
});

describe("supabase auth service", () => {
  const service = () => createSupabaseAuthService();

  it("restores an existing session on start", async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: { user: { id: "u1", email: "a@b.co" } } }, error: null });
    expect(await service().getUser()).toEqual({ id: "u1", email: "a@b.co" });
  });

  it("is signed out when there is no session, when restoring fails, or when it throws (offline)", async () => {
    mockAuth.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });
    expect(await service().getUser()).toBeNull();
    mockAuth.getSession.mockResolvedValueOnce({ data: { session: null }, error: { code: "refresh_token_not_found" } });
    expect(await service().getUser()).toBeNull();
    mockAuth.getSession.mockRejectedValueOnce(new Error("Network request failed"));
    expect(await service().getUser()).toBeNull();
  });

  it("reports session changes, including expiry (null user), and can unsubscribe", () => {
    const unsubscribe = jest.fn();
    let emit: (event: string, session: unknown) => void = () => {};
    mockAuth.onAuthStateChange.mockImplementation((cb) => {
      emit = cb;
      return { data: { subscription: { unsubscribe } } };
    });
    const seen: unknown[] = [];
    const off = service().onChange((u) => seen.push(u));
    emit("SIGNED_IN", { user: { id: "u1" } });
    emit("SIGNED_OUT", null);
    expect(seen).toEqual([{ id: "u1", email: undefined }, null]);
    off();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("signs in; invalid credentials give a calm message", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: null });
    expect(await service().signIn("a@b.co", "password1")).toEqual({ ok: true });
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: { code: "invalid_credentials", status: 400, message: "Invalid login credentials" } });
    const res = await service().signIn("a@b.co", "wrong");
    expect(res).toMatchObject({ ok: false, reason: "invalid_credentials" });
    expect(res.ok === false && res.message).not.toMatch(/invalid login credentials/i); // no raw backend text
  });

  it("turns thrown network errors into a friendly failure instead of crashing", async () => {
    mockAuth.signInWithPassword.mockRejectedValueOnce(new TypeError("Network request failed"));
    expect(await service().signIn("a@b.co", "password1")).toMatchObject({ ok: false, reason: "network" });
    mockAuth.signUp.mockRejectedValueOnce(Object.assign(new Error("x"), { name: "AuthRetryableFetchError", status: 0 }));
    expect(await service().signUp("a@b.co", "password1")).toMatchObject({ ok: false, reason: "network" });
  });

  it("surfaces an unconfirmed email on sign-in", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({ error: { code: "email_not_confirmed", status: 400, message: "Email not confirmed" } });
    expect(await service().signIn("a@b.co", "password1")).toMatchObject({ ok: false, reason: "email_not_confirmed" });
  });

  it("signs up: confirmation required vs immediate", async () => {
    mockAuth.signUp.mockResolvedValueOnce({ data: { user: { identities: [{}] }, session: null }, error: null });
    expect(await service().signUp("a@b.co", "password1")).toEqual({ ok: true, needsEmailConfirmation: true });
    mockAuth.signUp.mockResolvedValueOnce({ data: { user: { identities: [{}] }, session: { access_token: "t" } }, error: null });
    expect(await service().signUp("a@b.co", "password1")).toEqual({ ok: true });
    mockAuth.signUp.mockResolvedValueOnce({ data: { user: null, session: null }, error: { code: "user_already_exists", status: 422, message: "x" } });
    expect(await service().signUp("a@b.co", "password1")).toMatchObject({ ok: false, reason: "existing_account" });
  });

  it("signs out and requests password reset", async () => {
    mockAuth.signOut.mockResolvedValueOnce({ error: null });
    expect(await service().signOut()).toEqual({ ok: true });
    mockAuth.resetPasswordForEmail.mockResolvedValueOnce({ error: null });
    expect(await service().requestPasswordReset("a@b.co")).toEqual({ ok: true });
  });
});
