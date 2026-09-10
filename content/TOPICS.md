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

Each entry is one question with one complete answer. Length follows the
question: some of these are honestly 600 words, some are 1,400. Do not pad a
small question, and do not split a large one across several posts.

### Rules, tax and money

1. **Airbnb versus a long tenancy on a London flat: which earns more?** The
   honest version, including where a tenancy wins: voids, management cost, the
   90-night cap, seasonality.
2. **Can you short-let a leasehold flat?** What leases typically say, why the
   freeholder matters more than the council, what to look for before listing.
3. **Can you short-let on a buy-to-let mortgage?** Lender consent, why the
   product matters, what usually happens if you do not ask.
4. **What insurance does a short let actually need?** Why standard landlord
   cover usually will not apply, what platform host protection does and does
   not include.
5. **Council tax or business rates on a London short let?** Which applies, when
   it switches, what that does to the numbers.
6. **What does short-let management cost in London?** Fee structures across the
   market, what is and is not included, how to compare them.
7. **Do you need a licence to run a short let in London?** Licensing, planning
   and the difference between them.
8. **Who pays when a guest damages something?** Deposits, platform cover, and
   what actually happens in practice.

### Running the property

9. **What does a short-let management company actually do?** The unglamorous
   version, hour by hour, so an owner can judge whether to do it themselves.
10. **Setting up a London flat for short lets: the checklist.** Safety
    certificates, the practical fit-out, what guests complain about.
11. **What safety certificates does a short let need?** Gas, electrical, fire,
    and who is responsible for each.
12. **Self check-in: smart locks, key safes, and what guests expect.**
13. **How cleaning between stays actually works,** and why the turnaround
    window decides how many nights you can sell.
14. **Furnishing a short let: what earns its money and what does not.**
15. **What to do about a neighbour complaint.** How to handle it before it
    becomes a council matter.
16. **Noise, parties and how house rules are actually enforced.**

### Earning more

17. **How dynamic pricing works,** and why a fixed nightly rate leaves money on
    the table.
18. **Airbnb, Booking.com, Vrbo or all three?** What each platform brings and
    what it costs.
19. **How to get consistent five-star reviews,** and why the first ten matter
    more than the next hundred.
20. **What photography actually changes about a listing.**
21. **London seasonality: when the money is made, and the months to plan for.**
22. **Corporate and medium-term lets:** who books them, and why they suit a
    property that has used its 90 nights.
23. **Serviced accommodation versus short let:** the same thing, or not?
24. **Why a listing gets views but no bookings.**

### For a specific property

25. **What does a one-bed flat in Kensington earn on a short let?** Written
    against the area page, without inventing figures: describe what drives the
    number rather than asserting one.
26. **The same, for Canary Wharf,** where the weekday corporate rhythm makes
    the pattern different.
27. **The same, for a property near Heathrow,** where the demand is arrivals
    rather than tourism.
28. **Is your property suited to short lets at all?** The honest checklist,
    including the cases where the answer is no.

### Notes on this list

When the queue runs low, the better move is almost always to **update an
existing post** rather than write a near-duplicate. Revise the facts, add what
has changed, and set an `updated:` date in the frontmatter. Google treats a
refreshed page on a proven URL far better than a second page on the same
subject, and near-duplicates risk both pages being ignored.

Real search data beats this list. When Search Console has query data, reorder
this queue against what people are actually typing.

## Written

- Airbnb versus a long tenancy on a London flat: which earns more? (`airbnb-versus-long-tenancy-london-which-earns-more.md`)
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
- **Answer the question in the first three sentences**, before any heading.
  Someone who reads only the opening should have the answer; everything after
  it is the detail behind that answer. This is also the part an AI assistant
  lifts when it cites the page, so it has to stand on its own.
- **700 to 1,100 words.** Most of these questions are answerable in under a
  thousand. Length is not a measure of quality: if it is said in 700 words, stop
  at 700. Never pad to reach a number, and never split one question across two
  posts to reach a count.
- **Cut anything that is not the answer.** No preamble about how important the
  topic is, no summary of what the post will cover, no restating the question
  back before answering it.
