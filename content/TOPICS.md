# Post queue

This file is the queue, not a post. It lives outside `content/blog/` so the
site never tries to publish it.

It is read by `.github/workflows/weekly-post.yml`, which runs every Monday
inside GitHub Actions. That job needs one repository secret, `ANTHROPIC_API_KEY`,
set under Settings > Secrets and variables > Actions. By default it opens a
pull request so the post can be read before it goes live; set
`PUBLISH_DIRECTLY` to `true` in that workflow to publish straight to the site
instead.

The job reads this file, takes the **highest unwritten topic**
from the list below, writes it, and pushes it to a draft branch for review.

To steer what gets written next, reorder this list. To kill a topic, delete the
line. To add one, put it where you want it in the order. Nothing else needs
changing.

A topic is "written" if a file already exists in `content/blog/` covering it.
Check that first, and never write a second post on a subject already covered.

---

## Queue

1. **Do you pay tax on Airbnb income in the UK?** What is declarable, the
   property allowance, allowable expenses, and when self assessment applies.
   Tax rules change: verify anything specific against GOV.UK before writing it,
   and if it cannot be verified, describe the shape of the rule rather than
   stating figures.
2. **Airbnb versus a long tenancy on a London flat: which earns more?** The
   honest version, including the cases where a tenancy wins: void periods,
   management cost, the 90-night cap, seasonality.
3. **Can you short-let a leasehold flat?** What leases typically say, why the
   freeholder matters more than the council, and what to look for in the deed
   before listing.
4. **Can you short-let on a buy-to-let mortgage?** Lender consent, why the
   product matters, and what usually happens if you do not ask.
5. **What insurance does a short let actually need?** Why standard landlord
   cover usually does not apply, what platform host protection does and does
   not include.
6. **What does a short-let management company actually do?** The unglamorous
   version, hour by hour, so an owner can judge whether to do it themselves.
7. **Council tax or business rates on a London short let?** Which applies,
   when it switches, and what that does to the numbers.
8. **Setting up a London flat for short lets: the checklist.** Safety
   certificates, the practical fit-out, what guests complain about.
9. **How much does short-let management cost in London?** Fee structures
   across the market, what is and is not included, and how to compare them.

## Written

- Do you pay tax on Airbnb income in the UK? (`do-you-pay-tax-on-airbnb-income-uk.md`)
- The 90-night rule in London (`90-night-rule-london.md`)
- Is short-let income halal (`is-airbnb-income-halal-london-landlords.md`)

---

## House rules for every post

These are not stylistic preferences. A post that breaks them should not be
pushed.

- **Never invent a number.** No statistics, percentages, fees, fines or dates
  that cannot be verified. Describe how something works rather than asserting a
  figure you cannot stand behind. The only numbers that may be stated as fact
  are the ones already on the site: the 15% and 18% management fees, and the
  90-night limit.
- **No em dashes anywhere.** Restructure the sentence with a comma, colon or
  full stop.
- **British spelling**, and the site's plain voice: short sentences, no
  marketing language, no "unlock", "seamless", "elevate" or "in today's
  fast-paced market".
- **Anything legal, tax or religious carries a closing note** in italics after
  a `---` rule, saying it is general information rather than advice and naming
  who to ask instead. Follow the pattern in the two existing posts.
- **Say the unhelpful thing where it is true.** The posts that work say when a
  short let is the wrong answer, or when a rule is genuinely contested. Do not
  resolve a real disagreement to make the sell easier.
- **One call to action**, near the end, linking to `/contact/`. Not more.
- **900 to 1,500 words.** Below that it is thin, above it nobody finishes.
