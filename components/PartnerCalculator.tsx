"use client";

import { useState } from "react";
import { PARTNER, partnerUpside } from "@/lib/content";

/**
 * Which of the two options pays more on a given property.
 *
 * The table above it states the rule, and the rule is simple enough that an
 * agent could do it on the back of an envelope. They will not. Typing one
 * figure they already know, the monthly revenue, and being told which option
 * to take and what it comes to, is the difference between reading the offer
 * and understanding it.
 *
 * It is arithmetic on the published terms rather than an estimate of what a
 * property earns, so it cannot promise anything we would have to walk back:
 * what goes in is the agent's own number.
 */
const money = (n: number) =>
  `£${Math.round(n).toLocaleString("en-GB")}`;

export default function PartnerCalculator() {
  const [revenue, setRevenue] = useState("3500");
  const [units, setUnits] = useState("1");

  const monthly = Math.max(0, Number(revenue) || 0);
  const count = Math.min(500, Math.max(1, Math.round(Number(units) || 1)));

  const flat = PARTNER.flatFee * count;
  const share = partnerUpside(monthly) * count;
  const shareWins = share > flat;

  return (
    <div className="calc">
      <div className="calc__inputs">
        <label className="field">
          <span>What the property earns a month</span>
          <div className="calc__money">
            <span aria-hidden="true">£</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="100"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>
        </label>

        <label className="field">
          <span>How many units</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="500"
            step="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
        </label>
      </div>

      {/* Announced together, so a screen reader hears the whole result rather
          than three fragments as each number changes. */}
      <div className="calc__out" aria-live="polite">
        <div className={shareWins ? "calc__opt" : "calc__opt is-best"}>
          <p className="calc__label">Option A, flat fee</p>
          <p className="calc__figure">{money(flat)}</p>
          <p className="calc__sub">Paid within 14 days of go live</p>
        </div>
        <div className={shareWins ? "calc__opt is-best" : "calc__opt"}>
          <p className="calc__label">Option B, 3% for three months</p>
          <p className="calc__figure">{money(share)}</p>
          <p className="calc__sub">Paid monthly, three payments</p>
        </div>
      </div>

      <p className="calc__verdict">
        {monthly === 0
          ? `Put in what the property earns a month and we will tell you which option pays more. The crossover is about ${money(PARTNER.crossover)}.`
          : shareWins
            ? `Take the 3%. It pays ${money(share - flat)} more than the flat fee on this one.`
            : flat === share
              ? "The two are level on this one, so take whichever you prefer."
              : `Take the flat fee. It pays ${money(flat - share)} more than the 3% on this one.`}
      </p>
    </div>
  );
}
