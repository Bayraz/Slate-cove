"use client";

import { useState } from "react";
import { CONTACT, REFERRAL } from "@/lib/content";

/**
 * The referral form.
 *
 * One form for both kinds of referrer rather than two nearly identical ones.
 * The only field an estate agent has that a neighbour does not is the agency
 * name, so that is one optional field rather than a second form and a decision
 * about which to use.
 *
 * It posts to the same endpoint as the property submission, with a subject
 * that marks it as a referral, so referrals land in the same inbox and are
 * still obvious at a glance.
 */
const ENDPOINT = "https://formspree.io/f/meaqvpjb";

export default function ReferralForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="sent" role="status">
        <svg className="sent__tick" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
          <path
            d="M19 33.5 28 42.5 45 22"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="sent__title">Referral received</p>
        <p className="sent__body">
          We will contact the owner, usually the same day, and tell them you
          passed their details on. You will hear from us either way: if the
          property is not right for a short let, we will say so.
        </p>
        <p className="sent__body">
          If it goes live, your {REFERRAL.fee} follows {REFERRAL.window}.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <input type="hidden" name="_subject" value="Property referral" />
      <input type="hidden" name="Enquiry type" value="Referral" />
      {/* Bots fill hidden fields; people do not. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp"
      />

      <fieldset className="form__set">
        <legend className="form__legend">About you</legend>
        <div className="form__row">
          <label className="field">
            <span>Your name</span>
            <input type="text" name="Referrer name" required autoComplete="name" />
          </label>
          <label className="field">
            <span>Agency (optional)</span>
            <input
              type="text"
              name="Agency"
              autoComplete="organization"
              placeholder="Leave blank if you are not an agent"
            />
          </label>
        </div>
        <div className="form__row">
          <label className="field">
            <span>Email</span>
            <input type="email" name="Referrer email" required autoComplete="email" />
          </label>
          <label className="field">
            <span>Telephone</span>
            <input type="tel" name="Referrer telephone" autoComplete="tel" placeholder="07700 900000" />
          </label>
        </div>
      </fieldset>

      <fieldset className="form__set">
        <legend className="form__legend">The property</legend>
        <div className="form__row">
          <label className="field">
            <span>Property address or postcode</span>
            <input type="text" name="Property address" required placeholder="SW1A 1AA" />
          </label>
          <label className="field">
            <span>Owner&rsquo;s name</span>
            <input type="text" name="Owner name" required />
          </label>
        </div>
        <label className="field">
          <span>Owner&rsquo;s contact details</span>
          <input
            type="text"
            name="Owner contact"
            required
            placeholder="Email address, telephone number, or both"
          />
        </label>
        <label className="field">
          <span>Anything we should know (optional)</span>
          <textarea
            name="Notes"
            rows={4}
            placeholder="Why you think it suits a short let, whether the owner is expecting our call, anything about the property"
          />
        </label>
      </fieldset>

      <div className="form__foot">
        <button className="btn btn--solid" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending" : "Refer this property"}
        </button>
        <p className="form__note">
          {REFERRAL.fee} {REFERRAL.trigger}. Nothing owed if it does not go
          ahead.
        </p>
      </div>

      {state === "error" && (
        <p className="form__error" role="alert">
          That did not send. Email{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the
          property and the owner&rsquo;s details and we will treat it as a
          referral from you.
        </p>
      )}
    </form>
  );
}
