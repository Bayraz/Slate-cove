"use client";

import { useState } from "react";
import { PARTNER, PARTNER_CROSSOVER, partnerUpside } from "@/lib/content";

/**
 * Which of the two options pays more, on a property the agent actually has.
 *
 * The rule is simple enough to do on the back of an envelope and no agent
 * will, so they put in one figure they already know and are told which option
 * to take and what it comes to. It is arithmetic on the published terms rather
 * than a forecast of what a property earns, so it cannot promise anything we
 * would have to walk back: the number that goes in is theirs.
 *
 * The chart is the same arithmetic seen whole. The flat fee is a flat line and
 * the share is a rising one, so the shape explains in a second what the table
 * explains in a sentence, and the marker puts their own property on it.
 *
 * Each option keeps its own colour throughout, so the colour means the option
 * and never "the winner". Which one pays more is marked with a label instead.
 */
const money = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

// The plotted range. 8,000 a month covers everything an agent will type and
// still leaves the interesting part, the crossing, in the middle third.
const MAX_REVENUE = 8000;
const MAX_PAYOUT = partnerUpside(MAX_REVENUE);

const W = 720;
const H = 230;
const PAD = { top: 22, right: 96, bottom: 38, left: 30 };

const x = (revenue: number) =>
  PAD.left + (revenue / MAX_REVENUE) * (W - PAD.left - PAD.right);
const y = (payout: number) =>
  H - PAD.bottom - (payout / MAX_PAYOUT) * (H - PAD.top - PAD.bottom);

const TICKS = [0, 2000, 4000, 6000, 8000];

export default function PartnerCalculator() {
  const [revenue, setRevenue] = useState("3500");
  const [units, setUnits] = useState("1");

  const monthly = Math.max(0, Number(revenue) || 0);
  const count = Math.min(500, Math.max(1, Math.round(Number(units) || 1)));

  const flat = PARTNER.flatFee * count;
  const share = partnerUpside(monthly) * count;
  const shareWins = share > flat;
  const level = flat === share;

  // The chart is drawn per property; the figures above it carry the units.
  const plotted = Math.min(monthly, MAX_REVENUE);
  const markerX = x(plotted);

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

      {/* Announced as one statement, so a screen reader hears the whole answer
          rather than three fragments as each figure changes. */}
      <div className="calc__out" aria-live="polite">
        <div className="calc__opt calc__opt--flat">
          <p className="calc__label">
            <span className="calc__key" aria-hidden="true" />
            The flat fee
          </p>
          <p className="calc__figure">{money(flat)}</p>
          <p className="calc__sub">
            Within 14 days of the listing going live
            {!shareWins && !level ? <b className="calc__win">Pays more</b> : null}
          </p>
        </div>
        <div className="calc__opt calc__opt--share">
          <p className="calc__label">
            <span className="calc__key" aria-hidden="true" />
            The share, 3% for three months
          </p>
          <p className="calc__figure">{money(share)}</p>
          <p className="calc__sub">
            Three monthly payments
            {shareWins ? <b className="calc__win">Pays more</b> : null}
          </p>
        </div>
      </div>

      {/* The figures above say everything the chart does, so it is presentation
          rather than content and is hidden from screen readers.

          It sits in its own scroller because scaling a 720 unit drawing into a
          phone's width takes the axis labels down to four pixels. Below the
          breakpoint it holds its size and the reader swipes it instead. */}
      <div className="calc__chartwrap">
      <svg
        className="calc__chart"
        viewBox={`0 0 ${W} ${H}`}
        role="presentation"
        aria-hidden="true"
      >
        {TICKS.map((t) => (
          <g key={t}>
            <line className="calc__tickline" x1={x(t)} y1={y(0)} x2={x(t)} y2={PAD.top} />
            <text className="calc__ticklabel" x={x(t)} y={H - PAD.bottom + 22}>
              {t === 0 ? "£0" : `£${t / 1000}k`}
            </text>
          </g>
        ))}
        <line className="calc__axis" x1={PAD.left} y1={y(0)} x2={W - PAD.right} y2={y(0)} />

        {/* Where the two come level. Labelled, so the crossing is a fact the
            reader is given rather than one they have to measure. */}
        <line
          className="calc__cross"
          x1={x(PARTNER_CROSSOVER)}
          y1={y(0)}
          x2={x(PARTNER_CROSSOVER)}
          y2={PAD.top + 4}
        />
        <text className="calc__crosslabel" x={x(PARTNER_CROSSOVER)} y={PAD.top - 6}>
          They come level at {money(PARTNER_CROSSOVER)}
        </text>

        <line
          className="calc__line calc__line--flat"
          x1={PAD.left}
          y1={y(PARTNER.flatFee)}
          x2={W - PAD.right}
          y2={y(PARTNER.flatFee)}
        />
        <line
          className="calc__line calc__line--share"
          x1={x(0)}
          y1={y(0)}
          x2={x(MAX_REVENUE)}
          y2={y(MAX_PAYOUT)}
        />

        <text className="calc__series" x={W - PAD.right + 10} y={y(PARTNER.flatFee) + 4}>
          The flat fee
        </text>
        <text className="calc__series" x={W - PAD.right + 10} y={y(MAX_PAYOUT) + 4}>
          The share
        </text>

        {/* The agent's own property, on both lines. No second vertical rule
            here: one beside the crossing dashes reads as a second crossing. */}
        <circle
          className="calc__dot calc__dot--flat"
          cx={markerX}
          cy={y(PARTNER.flatFee)}
          r="5.5"
        />
        <circle
          className="calc__dot calc__dot--share"
          cx={markerX}
          cy={y(partnerUpside(plotted))}
          r="5.5"
        />
      </svg>
      </div>

      <p className="calc__verdict">
        {monthly === 0
          ? `Put in what the property earns a month and we will tell you which option pays more. The two come level at about ${money(PARTNER_CROSSOVER)} a month.`
          : shareWins
            ? `Take the share. It pays ${money(share - flat)} more than the flat fee on this one.`
            : level
              ? "The two are level on this one, so take whichever you prefer."
              : `Take the flat fee. It pays ${money(flat - share)} more than the share on this one.`}
      </p>
    </div>
  );
}
