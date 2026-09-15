// The eight services, each as its own page.
//
// The home page lists them in a sentence each, which tells an owner what we do
// but not how any of it works. These pages answer the four questions a
// landlord actually has about a line item on a management agreement: what it
// is, why it matters, how we do it, and what they end up holding.
//
// They are also the part of the site an AI assistant can quote from. A summary
// of "listing optimisation" assembled from a card that says "titles and
// descriptions, tested and revised" is worthless; one assembled from a page
// that explains what a search algorithm ranks and who rewrites what is worth
// having. Every claim here is one we can stand behind. No invented figures:
// the only numbers stated anywhere on this site are the two management fees
// and the 90-night London limit.

export type Service = {
  slug: string;
  name: string;
  /** For the page title and the cards. One line. */
  summary: string;
  /** The meta description. */
  description: string;
  icon: readonly string[];
  /** Answers the question in the first three sentences, before any heading. */
  opening: string;
  what: string;
  why: string;
  how: readonly string[];
  /** What the owner is left holding. */
  gets: readonly string[];
  /** The questions this service actually raises, with straight answers. */
  faq: readonly { q: string; a: string }[];
};

export const SERVICE_PAGES: Service[] = [
  {
    slug: "listing-optimisation",
    name: "Listing optimisation",
    summary: "The listing rewritten for how guests actually search, then revised on what the data says.",
    description:
      "How Slate & Cove writes and maintains a short-let listing: the title, the description, the amenity data that platforms rank on, and the revisions that follow once real booking data arrives.",
    icon: ["M6 3.5h12v17H6z", "M9 8.5h6", "M9 12h7", "M9 15.5h4"],
    opening:
      "A listing is not a description of a flat. It is a record in a search index, and it competes with every comparable property for a place on the first screen a guest ever sees. Optimisation means writing it for the ranking as well as the reader, then changing it when the numbers say to.",
    what:
      "The title, the summary, the full description, the amenity checklist, the house rules and the structured fields every platform holds behind the scenes. Most owners write these once, at launch, and never look at them again. We treat them as the part of the property that can be improved without spending anything.",
    why:
      "Search on Airbnb and Booking.com is ranked, not listed. A property that does not surface for the searches its guests are actually making is invisible regardless of how good it is, and the amenity fields are a large part of what decides that: a missing filter tag removes the property from every search that uses it. The description then has to convert the click, which is a different job with different rules.",
    how: [
      "We write the title around what the property genuinely is and where it sits, because that is what the search box receives.",
      "Every amenity field is completed accurately rather than optimistically. Claiming an amenity you do not have buys one booking and a review that costs ten.",
      "The description leads with the two or three things that decide a booking for this particular property, not with a tour that starts at the front door.",
      "House rules are set by you, stated in the listing, and accepted by the guest before they can book.",
      "Once there is real data, we revise. Views without bookings is a pricing or photography problem; no views at all is a ranking problem, and those are fixed differently.",
    ],
    gets: [
      "A listing written for search and for the reader, not one or the other.",
      "Complete, accurate amenity data, which is the cheapest ranking work there is.",
      "Revisions driven by what the listing is actually doing, rather than a rewrite once a year.",
    ],
    faq: [
      {
        q: "Can I write the listing myself?",
        a: "You can, and some owners have a much better ear for their own property than we do. Send us what you have written and we will tell you honestly whether it needs changing. Where we do change it, we will say why.",
      },
      {
        q: "Does changing the listing reset its ranking?",
        a: "Editing a live listing does not wipe its history, but it does mean the platform has to learn how the new version performs, so we change one thing at a time rather than rewriting everything at once. That way it is clear what worked.",
      },
    ],
  },
  {
    slug: "photography",
    name: "Photography",
    summary: "A professional shoot, staged properly, and reshot when the property changes.",
    description:
      "Why short-let photography decides the click, how Slate & Cove prepares and shoots a London property, and what happens to the images afterwards.",
    icon: ["M3.5 8h4l1.6-2.5h5.8L16.5 8h4v12.5h-17z", "M12 17.5a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z"],
    opening:
      "The first photograph is the entire advert. A guest scrolling a results page decides whether your property exists on the strength of one image at thumbnail size, and everything else on the listing only matters to the people that image has already stopped. This is the single highest-return thing most owners have never done properly.",
    what:
      "A professional shoot of the whole property, staged before the camera comes out, with the images ordered deliberately rather than in the order the rooms happen to sit. Plus the reshoots: new furniture, a redecoration, a different season through the windows.",
    why:
      "Every other lever on a listing is a fraction of a percent. Photography is the one that changes whether the property is considered at all. It also sets expectation, which is what reviews measure against: a flat that photographs honestly and arrives as promised gets a better review than a better flat that oversold itself.",
    how: [
      "We stage before we shoot. Clearing surfaces, making beds properly and turning lights on does more than any camera.",
      "The hero image is chosen for what stops a scroll, which is usually the best-lit room rather than the largest one or the one nearest the door.",
      "The set is ordered to walk a guest through the property in the order they will actually use it.",
      "Shot on the platform's own aspect ratios, so nothing important is cropped off in the results grid.",
      "Reshot when the property changes. An old photo of furniture you have replaced is a complaint waiting to be written.",
    ],
    gets: [
      "A full professional set, yours to keep and use anywhere.",
      "Images that set an expectation the property can meet, which protects the review score.",
      "Reshoots as the property changes, rather than a set that ages for five years.",
    ],
    faq: [
      {
        q: "Do I pay extra for photography?",
        a: "No. It is covered by the management fee on both plans, as part of getting the property live.",
      },
      {
        q: "What do I need to do before the shoot?",
        a: "Nothing, though the property should be empty of personal belongings and anything you would not want a guest to see. We will tell you in advance if we think it needs anything more, and if we think it needs work before it can be photographed well we will say that instead of shooting it badly.",
      },
    ],
  },
  {
    slug: "dynamic-pricing",
    name: "Dynamic pricing",
    summary: "Rates moved against real demand, so the calendar fills at the best rate it can.",
    description:
      "How dynamic pricing works for a London short let: what moves a nightly rate, why a fixed price leaves money behind, and how Slate & Cove sets and reviews yours.",
    icon: ["M3.5 16.5 9 11l3.5 3.5L20.5 6", "M15.5 6h5v5"],
    opening:
      "A fixed nightly rate is wrong every night of the year. It is too high in February and far too low the week a conference fills every hotel within a mile, and both cost you. Dynamic pricing means the rate moves with demand, so you are not choosing between an empty calendar and a cheap one.",
    what:
      "A nightly rate set per date rather than per property, reviewed against what is happening around it: the season, the day of the week, local events, school holidays, how full comparable properties are, and how close the date is.",
    why:
      "Occupancy and rate pull against each other, and the goal is neither one on its own. A property at full occupancy is almost certainly underpriced. A property at a high rate with an empty February is losing more than it is protecting. What matters is the total across the year, and no fixed number gets close to it.",
    how: [
      "We set a floor, so the property is never sold at a price you would be unhappy with, whatever the algorithm thinks.",
      "Rates move with demand for the specific dates, not with a blanket seasonal percentage.",
      "Local events are priced in advance rather than discovered afterwards, which is where most of the upside sits.",
      "Gaps are managed: a stranded two-night hole between bookings is priced to sell rather than left to expire.",
      "Minimum stays flex with the date, because the right minimum in December is not the right one in July.",
    ],
    gets: [
      "A calendar priced per date, with a floor you set.",
      "The month-by-month numbers in your report, so you can see what the pricing actually did.",
      "Someone to argue with about it. If you think a rate is wrong, tell us and we will explain the reasoning or change it.",
    ],
    faq: [
      {
        q: "Will you drop my rate to fill the calendar?",
        a: "Not below the floor you set. Occupancy on its own is not the target, and a manager chasing it is optimising for a number that flatters them rather than for your revenue.",
      },
      {
        q: "Can I set my own prices?",
        a: "You set the floor and we work above it. If you want to set specific rates for specific dates, say so and we will hold them, though we will tell you when we think a date is priced against you.",
      },
    ],
  },
  {
    slug: "guest-communication",
    name: "Guest communication",
    summary: "Every message, at any hour, from the first enquiry to the last review.",
    description:
      "What round-the-clock guest communication involves for a London short let, how guests are screened before they book, and what happens when something goes wrong at two in the morning.",
    icon: ["M20.5 12c0 3.6-3.8 6.5-8.5 6.5-1.1 0-2.2-.2-3.2-.5L4 20l1.5-3.6A6.1 6.1 0 0 1 3.5 12c0-3.6 3.8-6.5 8.5-6.5S20.5 8.4 20.5 12Z"],
    opening:
      "This is the part owners underestimate, and it is the reason most of them stop self-managing. It is not the volume of messages, it is that they arrive at times you cannot control and that a slow reply costs you both the booking and the ranking. We take the whole of it.",
    what:
      "Every message about the property: pre-booking questions, screening, check-in instructions, problems during the stay, late arrivals, lost keys, the boiler at midnight, and the review conversation afterwards.",
    why:
      "Response time is ranked by the platforms, so a slow reply costs future visibility as well as the booking in front of you. More importantly, the stay is where the review is earned. A problem handled quickly and without fuss frequently produces a better review than a stay where nothing happened at all, and the review score sets what the property can charge next year.",
    how: [
      "Enquiries are answered quickly, day or night, because a guest asking a question is usually asking three properties at once.",
      "Guests are screened before they book: platform verification, booking history, and a direct conversation where anything looks off.",
      "You can require verified identification, a minimum age and a minimum stay. Those filters change who books more than anything else.",
      "House rules are yours, stated up front and accepted at booking, and we act on a breach through the platform rather than letting it go because a cancellation is inconvenient.",
      "Problems are fixed first and reported to you after, unless the decision is genuinely yours to make.",
    ],
    gets: [
      "A phone that is not yours ringing at midnight.",
      "Guests filtered to the terms you set, rather than whoever books first.",
      "A record of what happened during each stay, in the monthly report.",
    ],
    faq: [
      {
        q: "Do you actually answer at night, or is it an automated reply?",
        a: "Templates cover the routine questions, because a guest asking for the wifi password at 1am wants the password rather than a conversation. Anything that is not routine reaches a person.",
      },
      {
        q: "Can I talk to the guests myself?",
        a: "You can, though we would rather you did not do it in parallel with us, because two people answering the same guest differently is how a stay goes wrong. Tell us what you want said and we will say it.",
      },
    ],
  },
  {
    slug: "cleaning-and-linen",
    name: "Cleaning and linen",
    summary: "Hotel-standard turnarounds, photographed, with linen that is replaced rather than nursed.",
    description:
      "How changeover cleaning works between short-let stays, why the turnaround window decides how many nights you can sell, and what Slate & Cove's teams check on every visit.",
    icon: ["M10 3 11.6 8 16.5 9.6 11.6 11.2 10 16.2 8.4 11.2 3.5 9.6 8.4 8Z", "M18 15v5", "M15.5 17.5h5"],
    opening:
      "Cleanliness is the most common reason a short let gets a bad review, and it is entirely preventable. A changeover is not a domestic clean: it is a reset of the whole property to an identical standard, done inside a few hours, between a guest leaving and the next one arriving.",
    what:
      "A full reset between stays. Every surface, the bathroom and kitchen to a hotel standard, fresh linen and towels throughout, consumables restocked, and a condition check with photographs.",
    why:
      "It protects the review score, which is the thing that sets your rate. It also decides your capacity: a property that can be turned around in one afternoon can sell same-day changeovers, and a property that needs a full day between guests cannot. Over a year that difference is a meaningful number of nights.",
    how: [
      "Vetted teams who do short-let turnarounds specifically, which is a different job from a weekly domestic clean.",
      "The same checklist every time, so the standard does not depend on who turned up.",
      "Linen and towels are replaced with a fresh set rather than laundered on site, so a delayed wash never delays a check-in.",
      "Condition is photographed at the end of every clean. That record is what settles a damage claim.",
      "Anything found broken is reported the same day, so it is fixed before the next guest rather than discovered by them.",
    ],
    gets: [
      "A consistent standard you do not have to inspect.",
      "A photographic record of the property's condition between every stay.",
      "Same-day changeovers where the property allows, which is more sellable nights.",
    ],
    faq: [
      {
        q: "Who pays for the cleaning?",
        a: "The cleaning fee is charged to the guest as part of the booking, which is standard across the platforms. It appears in your monthly report alongside everything else.",
      },
      {
        q: "Can I keep my own cleaner?",
        a: "Yes, if you have someone you trust. We bring them into our system and our checklist so the standard and the reporting stay consistent. If they are not available for a changeover, our team covers it.",
      },
    ],
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    summary: "Emergencies answered the same day, and the small things caught before a guest finds them.",
    description:
      "How maintenance is handled on a managed short let: emergency response, trusted trades, preventive work, and where the line sits between our cost and yours.",
    icon: ["M3.5 9.5h17v11h-17z", "M9 9.5V7A1.5 1.5 0 0 1 10.5 5.5h3A1.5 1.5 0 0 1 15 7v2.5", "M3.5 14.5h17"],
    opening:
      "A short let goes through more wear in a year than a tenancy does in three, and every fault is discovered by a paying guest rather than by someone who lives there and can wait until Saturday. Maintenance on a short let is therefore mostly about speed and about catching things early.",
    what:
      "Everything from a blown bulb to a failed boiler: the emergency call-outs, the trades, the preventive work that stops a small fault becoming a refunded stay, and the coordination of anything you decide to have done.",
    why:
      "A fault during a stay is not just a repair, it is a refund, a bad review and a gap in the calendar while it is fixed. The cost of reacting is almost always higher than the cost of preventing. And because the property is inspected between every single stay, a managed short let surfaces problems far earlier than a tenancy does.",
    how: [
      "Faults reported by guests or found at changeover are triaged the same day.",
      "Trades we have used before and can get hold of, rather than whoever answers the phone on a Sunday.",
      "Preventive work is booked into calendar gaps, so it does not cost you a night.",
      "You set a limit below which we simply get it done, and above which we ask you first. Most owners set it at a level that avoids being telephoned about a toilet seat.",
      "Every job appears in the monthly report with what it was and what it cost.",
    ],
    gets: [
      "A property that is looked at between every stay rather than once a year.",
      "One number to call, and someone else making the calls.",
      "An itemised record of every job, which is also what your accountant needs.",
    ],
    faq: [
      {
        q: "Who pays for repairs?",
        a: "You do, as the owner, exactly as with a tenancy. We do not mark up trade invoices. What the management fee covers is the arranging, the access, the supervision and the reporting.",
      },
      {
        q: "What counts as an emergency?",
        a: "Anything that stops a guest using the property safely: heating and hot water, water ingress, electrical faults, security of the door. Those are dealt with immediately. A dripping tap is fixed at the next changeover.",
      },
    ],
  },
  {
    slug: "review-management",
    name: "Review management",
    summary: "Reviews asked for properly, answered properly, and used to fix what they point at.",
    description:
      "Why the first reviews on a short let matter more than the next hundred, how Slate & Cove asks for and responds to them, and what to do about an unfair one.",
    icon: ["M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8Z"],
    opening:
      "Your review score is the number that decides what you can charge. It sets how high the property ranks, whether a guest considers it at all, and how much they will pay once they have. A new listing with no reviews is the hardest position a property will ever be in, and getting out of it quickly is worth real money.",
    what:
      "Asking every guest, at the right moment and in the right way. Responding to what comes back, publicly and properly. Reporting unfair reviews where there are grounds. And acting on what reviews repeatedly say, which is the part most managers skip.",
    why:
      "A listing with a handful of strong early reviews climbs; one that limps to its tenth review over six months does not. Later reviews move the average less and less, so the first ones are disproportionately valuable. Responses matter too: they are read by the next guest, not by the one who wrote the complaint.",
    how: [
      "The request is made when the stay is fresh and the guest is most likely to respond.",
      "Every review is answered, including the good ones, because the response is read by future guests deciding between you and another property.",
      "Criticism is answered without arguing. A defensive reply does more damage than the review it is defending against.",
      "Where a review breaches platform policy, we report it. Where it is simply unfavourable and fair, we fix what it identified.",
      "Repeated themes are treated as a fault list. Three guests mentioning the mattress is a mattress problem, not a review problem.",
    ],
    gets: [
      "A listing that builds its score deliberately rather than by accident.",
      "Public responses written to be read by the next guest.",
      "The recurring complaints brought to you as things to fix, with what they are costing.",
    ],
    faq: [
      {
        q: "Can a bad review be removed?",
        a: "Only where it breaches the platform's own policy, for example if it is about something outside the host's control or contains content the policy forbids. We report those. A review that is simply negative and accurate stays, and the right answer is to fix the cause.",
      },
      {
        q: "Do you review the guests too?",
        a: "Yes, honestly. Host reviews are how the next host screens, and a system where everyone leaves five stars to avoid trouble is useless to all of us.",
      },
    ],
  },
  {
    slug: "monthly-reporting",
    name: "Monthly reporting",
    summary: "Occupancy, revenue, costs, our fee and your payout, on one statement, every month.",
    description:
      "What is in a Slate & Cove monthly owner report, why it matters at tax time, and how the payout works.",
    icon: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3", "M8 14.5v3", "M12 13v4.5", "M16 15.5v2"],
    opening:
      "Most owners never see inside their own property's numbers. A short let generates income unevenly across the year with costs landing at different points, and reconstructing that from platform statements twelve months later is miserable. One statement a month, in the same format every time, is the whole answer.",
    what:
      "A monthly statement covering occupancy, gross revenue, platform fees, cleaning, maintenance spend, our management fee and your net payout, with the bookings behind it.",
    why:
      "It is the only way to know whether the property is doing well, because a good month in isolation tells you nothing. It is also what makes the tax return straightforward: twelve consistent statements is a year of accounts, which is exactly what the calculation needs and exactly what nobody has when they self-manage.",
    how: [
      "The same format every month, so figures can be compared rather than re-learned.",
      "Costs are itemised, not netted off quietly against income.",
      "Our fee is shown as a line, so you can see what you paid us and what it was charged on.",
      "The payout goes out on a set cycle rather than when someone gets round to it.",
      "Ask about any line and we will show you the booking or the invoice behind it.",
    ],
    gets: [
      "One statement a month instead of a platform dashboard you have to interpret.",
      "A year of consistent accounts at the end of it.",
      "Enough detail to challenge us, which is the point of sending it.",
    ],
    faq: [
      {
        q: "What is the fee charged on?",
        a: "Net revenue, after platform fees. The management fee is 15% on the full-time plan and 18% on the flexible plan, and it appears as its own line on every statement.",
      },
      {
        q: "Will my accountant accept it?",
        a: "It is a management statement rather than a formal set of accounts, but it carries the figures an accountant needs and itemises the costs. Owners have not had a problem with it.",
      },
    ],
  },
];

export const SERVICE_BY_SLUG = new Map(SERVICE_PAGES.map((s) => [s.slug, s]));
