"use client";

import { useState } from "react";

const ENDPOINT = "https://formspree.io/f/xjyvekyr";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The site is a static export, so submissions go to Formspree rather than to
 * our own backend.
 *
 * The <form> keeps a real `action` and `method`, so without JavaScript it
 * still submits the ordinary way, and the browser just lands on Formspree's own
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


  // Once it has sent, the form has done its job. Replacing it outright with a
  // confirmation is unmistakable in a way a line of text under a button is not.
  if (status === "sent") {
    return (
      <div className="sent" role="status" aria-live="polite">
        <svg className="sent__tick" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="3" />
          <path
            d="M25 41.5 35.5 52 56 30"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="sent__title">Thank you</p>
        <p className="sent__line">Your enquiry is with us. One of our managers will be in touch within 24 hours.</p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="form" action={ENDPOINT} method="POST" onSubmit={handleSubmit}>
      {/* Gives the notification email a useful subject line. */}
      <input type="hidden" name="_subject" value="New enquiry from slateandcove.com" />
      {/* Formspree's honeypot: bots fill it in, people never see it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" hidden />

      <label className="field">
        <span>Name</span>
        <input type="text" name="name" autoComplete="name" required />
      </label>

      <div className="form__row form__row--pair">
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Telephone (optional)</span>
          <input type="tel" name="telephone" autoComplete="tel" />
        </label>
      </div>

      {/* Routing, and it tells us who is writing before we open the message. */}
      <label className="field">
        <span>What is this about?</span>
        <select name="enquiry-type" defaultValue="I have a property to let" required>
          <option>I have a property to let</option>
          <option>I am already a client</option>
          <option>I am a guest with a booking question</option>
          <option>Press or partnership</option>
          <option>Something else</option>
        </select>
      </label>

      <label className="field">
        <span>Property postcode (optional)</span>
        <input
          type="text"
          name="postcode"
          autoComplete="postal-code"
          placeholder="SW1A 1AA"
        />
        <span className="field__hint">
          If your enquiry is about a particular property, this is enough for us
          to give you a rough figure.
        </span>
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows={7}
          placeholder="Tell us what you would like to know"
          required
        />
      </label>

      <div className="form__submit">
        <button className="btn btn--solid btn--lg" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send enquiry"}
        </button>
        {status === "idle" || status === "sending" ? (
          <span className="form__note">
            No spam, no obligation. We reply within 24 hours.
          </span>
        ) : null}
      </div>

      <p
        className={
          status === "error" ? "form__status form__status--error" : "form__status"
        }
        role="status"
        aria-live="polite"
      >
        {status === "error" &&
          "Something went wrong sending that. Please email info@slateandcove.com or call +44 7484 646008."}
      </p>
    </form>
  );
}
