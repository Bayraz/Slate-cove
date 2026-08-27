"use client";

import { useState } from "react";

/**
 * No submission endpoint is configured yet. Until one exists this keeps the
 * enquiry on the page rather than navigating somewhere broken.
 *
 * To wire it up: replace `handleSubmit` with a POST to your handler (or a
 * server action, which would mean dropping `output: "export"` from
 * next.config.ts).
 */
export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(
      "This form has no submission endpoint yet — wire ContactForm up to your handler.",
    );
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
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
        <button className="btn btn--solid btn--lg" type="submit">
          Submit property
        </button>
        <span className="form__note">
          No spam, no obligation. We reply within 24 hours.
        </span>
      </div>

      <p className="form__status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
