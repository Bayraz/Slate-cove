"use client";

import { useState } from "react";

const ENDPOINT = "https://formspree.io/f/xjyvekyr";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The site is a static export, so submissions go to Formspree rather than to
 * our own backend.
 *
 * The <form> keeps a real `action` and `method`, so without JavaScript it
 * still submits the ordinary way — the browser just lands on Formspree's own
 * confirmation page. With JavaScript, the submit is intercepted and posted in
 * the background, which keeps the visitor on the page.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form className="form" action={ENDPOINT} method="POST" onSubmit={handleSubmit}>
      {/* Gives the notification email a useful subject line. */}
      <input type="hidden" name="_subject" value="New enquiry from slateandcove.com" />
      {/* Formspree's honeypot: bots fill it in, people never see it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" hidden />

      <div className="form__row">
        <label className="field">
          <span>First name</span>
          <input type="text" name="first-name" autoComplete="given-name" required />
        </label>
        <label className="field">
          <span>Last name</span>
          <input type="text" name="last-name" autoComplete="family-name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Telephone</span>
          <input type="tel" name="telephone" autoComplete="tel" />
        </label>
      </div>

      <div className="form__row form__row--address">
        <label className="field">
          <span>Property address</span>
          <input type="text" name="address" autoComplete="street-address" required />
        </label>
        <label className="field">
          <span>Postcode</span>
          <input type="text" name="postcode" autoComplete="postal-code" required />
        </label>
      </div>

      <div className="form__row form__row--detail">
        <label className="field">
          <span>Property type</span>
          <select name="property-type" defaultValue="Flat">
            <option>Flat</option>
            <option>House</option>
            <option>Apartment</option>
            <option>Studio</option>
            <option>HMO</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field">
          <span>Bedrooms</span>
          <input type="number" name="bedrooms" min={0} step={1} />
        </label>
        <label className="field">
          <span>Available from</span>
          <input type="date" name="available-from" />
        </label>
      </div>

      <label className="field">
        <span>Anything else we should know</span>
        <textarea name="message" rows={4} />
      </label>

      <div className="form__submit">
        <button className="btn btn--solid btn--lg" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Submit property"}
        </button>
        <span className="form__note">
          No spam, no obligation. We reply within 24 hours.
        </span>
      </div>

      <p
        className={
          status === "sent"
            ? "form__status form__status--ok"
            : status === "error"
              ? "form__status form__status--error"
              : "form__status"
        }
        role="status"
        aria-live="polite"
      >
        {status === "sent" &&
          "Thank you — your property details are with us. We will be in touch within 24 hours."}
        {status === "error" &&
          "Something went wrong sending that. Please email info@slateandcove.com or call +44 7484 646008."}
      </p>
    </form>
  );
}
