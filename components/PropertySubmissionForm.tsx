"use client";

import { useState } from "react";

const ENDPOINT = "https://formspree.io/f/meaqvpjb";

/** Formspree rejects oversized posts, so catch it here with a clear message. */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

type Status = "idle" | "sending" | "sent" | "sent-no-images" | "error" | "toobig";

/**
 * The detailed property submission, posting to its own Formspree form so these
 * land separately from the shorter general enquiries on /contact.
 *
 * The <form> keeps a real `action` and `method`, so without JavaScript it still
 * submits and the browser lands on Formspree's own confirmation page. With
 * JavaScript the post happens in the background and the visitor stays here.
 *
 * The image field is deliberately optional and is stripped from the payload
 * when empty: file uploads are a paid Formspree feature, so a submission
 * carrying an empty file part could be refused for a property nobody was ever
 * going to photograph. An enquiry matters more than an attachment.
 */
export default function PropertySubmissionForm() {
  const [status, setStatus] = useState<Status>("idle");

  const post = (data: FormData) =>
    fetch(ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const picker = form.elements.namedItem("property-images") as HTMLInputElement | null;
    const chosen = picker?.files ? Array.from(picker.files) : [];
    if (chosen.length === 0) {
      data.delete("property-images");
    } else {
      const total = chosen.reduce((sum, file) => sum + file.size, 0);
      if (total > MAX_UPLOAD_BYTES) {
        setStatus("toobig");
        return;
      }
    }

    setStatus("sending");
    try {
      const response = await post(data);
      if (response.ok) {
        form.reset();
        setStatus("sent");
        return;
      }

      // Uploads are a paid Formspree feature, so a submission carrying photos
      // can be refused when the details on their own would have been accepted.
      // Never lose the enquiry over an attachment: drop the images and send the
      // rest, then say plainly that the photographs did not go with it.
      if (chosen.length > 0) {
        data.delete("property-images");
        const retry = await post(data);
        if (retry.ok) {
          form.reset();
          setStatus("sent-no-images");
          return;
        }
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }


  // Once it has sent, the form has done its job. Replacing it outright with a
  // confirmation is unmistakable in a way a line of text under a button is not.
  if (status === "sent" || status === "sent-no-images") {
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
        <p className="sent__line">Your property details are with us. One of our managers will be in touch within 24 hours.</p>
        {status === "sent-no-images" ? (
          <p className="sent__note">
            The photographs did not send. Email them to{" "}
            <a href="mailto:info@slateandcove.com">info@slateandcove.com</a> and
            we will add them to your file.
          </p>
        ) : null}
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="form" action={ENDPOINT} method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value="New property submission from slateandcove.com" />
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
      </div>

      <div className="form__row">
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Telephone (optional)</span>
          <input
            type="tel"
            name="telephone"
            autoComplete="tel"
            placeholder="07700 900000"
            inputMode="tel"
          />
        </label>
      </div>

      <div className="form__row form__row--address">
        <label className="field">
          <span>Property address</span>
          <input
            type="text"
            name="address"
            autoComplete="street-address"
            placeholder="123 High Street, London"
            required
          />
        </label>
        <label className="field">
          <span>Postcode</span>
          <input
            type="text"
            name="postcode"
            autoComplete="postal-code"
            placeholder="SW1A 1AA"
            required
          />
        </label>
      </div>

      <div className="form__row form__row--detail">
        <label className="field">
          <span>Property type</span>
          <select name="property-type" defaultValue="Flat" required>
            <option>Flat</option>
            <option>House</option>
            <option>Apartment</option>
            <option>Studio</option>
            <option>Maisonette</option>
            <option>HMO</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field">
          <span>Bedrooms</span>
          <input type="number" name="bedrooms" min={0} step={1} placeholder="2" required />
        </label>
        <label className="field">
          <span>Available from (optional)</span>
          <input type="date" name="available-from" />
        </label>
      </div>

      <label className="field">
        <span>Property images (optional)</span>
        <input
          className="field__file"
          type="file"
          name="property-images"
          accept="image/*"
          multiple
        />
        <span className="field__hint">
          Up to 8MB in total. Photographs help us give a sharper estimate, but
          they are not needed to get one.
        </span>
      </label>

      <label className="field">
        <span>Additional notes (optional)</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Anything else we should know about the property"
        />
      </label>

      <div className="form__submit">
        <button className="btn btn--solid btn--lg" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Submit property"}
        </button>
        {status === "idle" || status === "sending" ? (
          <span className="form__note">
            No spam, no obligation. We reply within 24 hours.
          </span>
        ) : null}
      </div>

      <p
        className={
          status === "error" || status === "toobig"
            ? "form__status form__status--error"
            : "form__status"
        }
        role="status"
        aria-live="polite"
      >
        {status === "toobig" &&
          "Those images come to more than 8MB. Please remove a few and try again, or send them separately to info@slateandcove.com."}
        {status === "error" &&
          "Something went wrong sending that. Please email info@slateandcove.com or call +44 7484 646008."}
      </p>
    </form>
  );
}
