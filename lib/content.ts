// All site copy, lifted verbatim from the Claude Design prototype
// "Slate and Cove Website.dc.html". Keeping it here means the repeated
// sections (services, comparison rows, FAQ, coverage areas) are data rather
// than duplicated markup.

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "For Landlords" },
  { href: "/partners", label: "Agents & partners" },
  { href: "/contact", label: "Contact" },
] as const;

export const CONTACT = {
  email: "info@slateandcove.com",
  telephone: "+44 7484 646008",
  telephoneHref: "+447484646008",
  addressLines: ["124 City Road", "London EC1V 2NX"],
  hoursLines: ["Office, weekdays 9am–10pm", "Guest line, always"],
} as const;

/**
 * The financial proposition.
 *
 * The range is the reason most landlords look at short lets at all, so it is
 * stated rather than avoided. It is framed as potential throughout, and the
 * qualifier travels with it: every place the figure appears, the sentence
 * saying what it depends on appears too. It is not presented as a result every
 * property achieves, and it is not called a return.
 *
 * There is no Slate & Cove performance data in this repository to derive a
 * more precise figure from, so nothing here claims more precision than
 * "potentially".
 */
export const UPLIFT = {
  range: "30\u201340%",
  headline: "Potentially 30\u201340% more than a traditional long-term let",
  qualifier:
    "Every property is different. What yours could do depends on its location, type, local demand, how much of the year it is available and what it costs to run. We assess the property and give you a realistic estimate rather than a number off a website.",
} as const;

/**
 * The reassurance strip under the hero.
 *
 * It used to lead with "30-40% more than a long tenancy". Nothing in this
 * repository substantiates that, and a comparative performance claim needs
 * substantiating, so it is gone rather than restated more carefully. These
 * four are facts about the service we sell rather than predictions about what
 * a property will do, which is the difference between a claim we can defend
 * and one we cannot.
 */
export const ASSURANCES = [
  { figure: "London", label: "and the Home Counties" },
  { figure: "End to end", label: "listing, guests, cleaning, upkeep" },
  { figure: "24/7", label: "guest cover, every night" },
  { figure: "Monthly", label: "owner report and payout" },
] as const;

/**
 * The eight services. `icon` is the path data for a 24x24 line mark, kept
 * beside the copy so a service and its mark cannot drift apart.
 */
export const SERVICES = [
  {
    title: "Listing optimisation",
    icon: ["M6 3.5h12v17H6z", "M9 8.5h6", "M9 12h7", "M9 15.5h4"],
    copy: "Titles, descriptions and keywords written for search, then tested and revised.",
  },
  {
    title: "Photography",
    icon: ["M3.5 8h4l1.6-2.5h5.8L16.5 8h4v12.5h-17z", "M12 17.5a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z"],
    copy: "Professional shoots, staging advice, and refreshed images as the property changes.",
  },
  {
    title: "Dynamic pricing",
    icon: ["M3.5 16.5 9 11l3.5 3.5L20.5 6", "M15.5 6h5v5"],
    copy: "Rates moved daily against local demand, events, competitors and season.",
  },
  {
    title: "Guest communication",
    icon: ["M20.5 12c0 3.6-3.8 6.5-8.5 6.5-1.1 0-2.2-.2-3.2-.5L4 20l1.5-3.6A6.1 6.1 0 0 1 3.5 12c0-3.6 3.8-6.5 8.5-6.5S20.5 8.4 20.5 12Z"],
    copy: "Screening, fast replies at any hour, and every message for the length of the stay.",
  },
  {
    title: "Cleaning & linen",
    icon: ["M10 3 11.6 8 16.5 9.6 11.6 11.2 10 16.2 8.4 11.2 3.5 9.6 8.4 8Z", "M18 15v5", "M15.5 17.5h5"],
    copy: "Vetted teams, premium linen, photographed turnarounds and quality checks.",
  },
  {
    title: "Maintenance",
    icon: ["M3.5 9.5h17v11h-17z", "M9 9.5V7A1.5 1.5 0 0 1 10.5 5.5h3A1.5 1.5 0 0 1 15 7v2.5", "M3.5 14.5h17"],
    copy: "Emergency response, trusted trades, and preventive work booked before it bites.",
  },
  {
    title: "Review management",
    icon: ["M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8Z"],
    copy: "Reviews requested, answered properly, and the feedback acted on.",
  },
  {
    title: "Monthly reporting",
    icon: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3", "M8 14.5v3", "M12 13v4.5", "M16 15.5v2"],
    copy: "Occupancy, revenue, expenses and net payout, on one statement.",
  },
] as const;

export const COMPARISON_COLUMNS = ["Slate & Cove", "Hosting yourself", "A long tenancy"] as const;

export const COMPARISON_ROWS = [
  { label: "Short-stay lettings", values: ["Yes", "Yes", "No"] },
  { label: "Verified guest screening", values: ["Yes", "No", "Yes"] },
  { label: "Fully hands-off management", values: ["Yes", "No", "No"] },
  { label: "Round-the-clock guest support", values: ["Yes", "No", "No"] },
  { label: "Repairs & upkeep", values: ["Yes", "No", "Yes"] },
  { label: "Smart dynamic pricing", values: ["Yes", "No", "No"] },
  { label: "Listed across all platforms", values: ["Yes", "No", "No"] },
] as const;

/** The tick used on feature lists. One definition, so they never diverge. */
export const TICK = [
  "M12 3.4 20.2 7v5.4c0 4.3-3.3 7.5-8.2 8.7-4.9-1.2-8.2-4.4-8.2-8.7V7Z",
  "M8.6 12.2 11 14.6l4.6-4.8",
] as const;

export const STEPS = [
  {
    num: "01",
    title: "Consultation",
    icon: ["M20.5 12c0 3.6-3.8 6.5-8.5 6.5-1.1 0-2.2-.2-3.2-.5L4 20l1.5-3.6A6.1 6.1 0 0 1 3.5 12c0-3.6 3.8-6.5 8.5-6.5S20.5 8.4 20.5 12Z"],
    copy: "A free consultation: the property, your goals, what it could realistically earn, and any questions about how we work.",
  },
  {
    num: "02",
    title: "Onboarding",
    icon: ["M3.5 8h4l1.6-2.5h5.8L16.5 8h4v12.5h-17z", "M12 17.5a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z"],
    copy: "Photography, the listing, pricing, and any improvements worth making before launch. All of it ours to arrange.",
  },
  {
    num: "03",
    title: "Go live",
    icon: ["M12 3.5 5 7v6c0 4 3 6.9 7 7.5 4-.6 7-3.5 7-7.5V7Z", "M12 8.5v7", "M8.5 12h7"],
    copy: "Live across Airbnb, Booking.com and Vrbo, with dynamic pricing working from the first day.",
  },
  {
    num: "04",
    title: "Ongoing management",
    icon: ["M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z", "M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"],
    copy: "Guests, cleaning, maintenance and reviews, all from our side. Be as involved as you like; most owners read the report and leave it at that.",
  },
  {
    num: "05",
    title: "Monthly payout",
    icon: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3", "M8 14.5v3", "M12 13v4.5", "M16 15.5v2"],
    copy: "Your payout, with occupancy, revenue, expenses and our fee set out in full.",
  },
] as const;

export const FAQ = [
  {
    q: "How much can I earn?",
    a: "It depends on location, size, amenities and season, and anyone who gives you a figure before seeing the property is guessing. We give a personalised estimate at the consultation, based on what comparable properties nearby are actually achieving, and we will tell you if a short let is the wrong answer for your property.",
  },
  {
    q: "What does the fee cover?",
    a: "Listing creation and optimisation, photography, dynamic pricing, guest communication around the clock, booking management, cleaning and maintenance coordination, review management and monthly reporting. The only extras are direct costs such as cleaning fees, usually covered by guest payments.",
  },
  {
    q: "How quickly can it be listed?",
    a: "Most properties are live within one to two weeks of signing, allowing for photography, listing creation and minor preparation. Already guest-ready, and we can move faster.",
  },
  {
    q: "Can I still use the property?",
    a: "Yes. Block off any dates you want through the owner portal. We ask only for reasonable notice so the calendar can be managed around your own bookings.",
  },
  {
    q: "What if something goes wrong mid-stay?",
    a: "Our team is reachable at any hour. From minor inconveniences to emergencies we have set protocols and trusted tradespeople. We keep you informed and handle the work.",
  },
  {
    q: "How are guests screened?",
    a: "Platform verification, booking history and direct conversation. We can add requirements such as minimum age, verified ID or longer minimum stays if you prefer.",
  },
  {
    q: "Can the property be run to my own house rules?",
    a: "Yes. House rules are set by you and stated in the listing, so guests accept them before they book. That covers no parties or events, no smoking, no alcohol on the premises, minimum stay lengths and minimum age. We enforce breaches through the platform rather than overlooking them. Landlords who need the property run to a particular standard, including for religious reasons, should tell us at the outset and we will configure the listing to it.",
  },
  {
    q: "What about property damage?",
    a: "All major platforms provide host protection insurance and we make sure the listing is always covered. Condition is photographed before and after each stay, and we handle any claim on your behalf.",
  },
  {
    q: "Can I keep my own cleaners?",
    a: "If you have cleaners you trust, we will bring them into our system. Otherwise we assign one of our vetted teams, experienced in short-let turnovers.",
  },
] as const;

/**
 * The management commission for each plan, shown on the plan cards.
 * Calculated on net revenue after platform fees, per the note under the plans.
 */
export const MANAGEMENT_FEES = {
  fullTime: "15%",
  flexible: "18%",
} as const;

export const PLAN_FULL_TIME = [
  "Available full time, all year round",
  "Minimum six-month commitment period",
  "Earns revenue every night of the year",
  "Higher returns through consistent occupancy",
  "Listed across Airbnb and Booking.com",
  "Guest queries handled day and night",
  "Rates adjusted automatically to maximise income",
  "A single dedicated contact for everything",
] as const;

export const PLAN_FLEXIBLE = [
  "Use the property as much as you like, when it isn't booked",
  "Block out any dates you need it back",
  "30-day rolling contract, no long-term tie-in",
  "No minimum nights or availability required",
  "Listed across Airbnb and Booking.com",
  "Guest queries handled day and night",
  "Rates adjusted automatically to maximise income",
  "A single dedicated contact for everything",
] as const;

export const EXCLUSIONS = [
  { title: "Cleaning", copy: "Charged to guests as a cleaning fee and passed through at cost." },
  {
    title: "Maintenance & repairs",
    copy: "Billed at cost with full transparency. We coordinate, you approve.",
  },
  { title: "Consumables", copy: "Toiletries, coffee and supplies restocked as needed, at cost." },
] as const;

export const AREAS = [
  {
    title: "Central London",
    places: [
      "Central London", "Kensington", "Notting Hill", "Paddington",
      "Little Venice & Maida Vale", "Earls Court", "Chelsea", "Southbank",
      "Farringdon", "Elephant & Castle",
    ],
  },
  {
    title: "London zones 2–4",
    places: [
      "Hammersmith", "Barons Court", "Fulham", "Shepherd's Bush",
      "Chiswick", "Brentford", "Kew", "Acton",
      "Ealing", "Wembley", "Hounslow", "Canary Wharf",
      "Whitechapel", "Battersea", "Wandsworth",
    ],
  },
  { title: "Greater London", places: ["Harrow", "Hayes", "Yeading", "Uxbridge"] },
  {
    title: "Berkshire",
    places: ["Slough", "Windsor", "Maidenhead", "Reading", "Bracknell", "Ascot"],
  },
  {
    title: "Hertfordshire, Surrey & Buckinghamshire",
    places: ["Watford", "Staines", "Beaconsfield"],
  },
] as const;

/** Extra footer links that are not in the main navigation. */
export const FOOTER_EXTRA = [
  { href: "/submit-property", label: "Submit your property" },
  { href: "/refer", label: "Refer a property" },
] as const;

export const FOOTER_SERVICES = [
  "Listing optimisation",
  "Photography",
  "Dynamic pricing",
  "Guest communication",
  "Cleaning & linen",
  "Maintenance",
  "Monthly reporting",
] as const;

/* --------------------------------------------------------------------------
   Estate and letting agent partnership
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Estate agents: two ways to be paid
   -------------------------------------------------------------------------- */

/**
 * Agents choose per property between a flat fee and a share of what the
 * property earns for its first three months.
 *
 * The choice exists because an agent's book is not uniform. A studio and a
 * Kensington house are worth very different amounts to us, and one flat fee
 * pays the same for both, which under-rewards exactly the referral we most
 * want: a high-revenue property. The share fixes that without us guessing at
 * a property's value in advance.
 *
 * It is offered to agents only. An agent refers repeatedly and will happily
 * learn a rule; somebody who knows one landlord will not, and asking them to
 * weigh two structures is how an introduction stops being made. Independent
 * referrers get the flat fee, stated on its own page.
 */
export const PARTNER = {
  flatFee: 275,
  revenueShare: 0.03,
  revenueMonths: 3,
} as const;

const money = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

/** What the share pays on a given monthly revenue. */
export const partnerUpside = (monthlyRevenue: number) =>
  monthlyRevenue * PARTNER.revenueShare * PARTNER.revenueMonths;

/** Where the two come level. Derived, so it cannot drift from the fee. */
export const PARTNER_CROSSOVER =
  PARTNER.flatFee / (PARTNER.revenueShare * PARTNER.revenueMonths);

export const PARTNER_OPTIONS = ["The flat fee", "The share"] as const;

export const PARTNER_HEADLINES = [
  { figure: money(PARTNER.flatFee), note: "per property, once the listing is live" },
  { figure: "3%", note: "of revenue, across the first three months" },
  { figure: "Per property", note: "you choose, not once for all of them" },
  { figure: "One email", note: "the whole of your involvement" },
] as const;

/**
 * The worked examples are three real London property shapes rather than round
 * numbers, and they are chosen so each option wins one. An agent should be
 * able to find their own property in the list.
 */
const EXAMPLES = [
  { label: "A one bedroom in Ealing at £2,400 a month", revenue: 2400, units: 1 },
  { label: "A two bedroom in Kensington at £6,000 a month", revenue: 6000, units: 1 },
  { label: "Five flats in one block at £3,500 each", revenue: 3500, units: 5 },
] as const;

export const PARTNER_TABLE = [
  {
    label: "How it is worked out",
    values: ["One fee for the property", "3% of what the property earns"],
  },
  {
    label: "When it reaches you",
    values: ["Within 14 days of the listing going live", "Three monthly payments, alongside the owner's"],
  },
  {
    label: "Suits",
    values: ["Smaller units, and knowing the figure in advance", "Higher earning flats, and portfolios"],
  },
  ...EXAMPLES.map(({ label, revenue, units }) => ({
    label,
    values: [money(PARTNER.flatFee * units), money(partnerUpside(revenue) * units)] as const,
  })),
] as const;


/**
 * The referral programme. One figure, one trigger, one audience.
 *
 * It used to be two options, a flat fee or a share of revenue, with a
 * calculator to work out which paid more. That was a worse offer for being a
 * cleverer one: an agent deciding between two structures is an agent not
 * making an introduction. A single number can be read once and remembered,
 * which is what a referral scheme needs.
 *
 * The same figure goes to anyone. An estate agent and a landlord's neighbour
 * bring us the same thing, so paying them differently only needed explaining.
 *
 * "When the property goes live" is the trigger and it needs a date attached or
 * it becomes an argument later, so it is paid within 14 days of the listing
 * going live and earning.
 */
export const REFERRAL = {
  fee: "£275",
  window: "within 14 days",
  trigger: "when the property goes live",
} as const;

/**
 * The two kinds of referrer. Estate agents first, because they are the channel
 * with volume, but the second is not a footnote: most people who know a
 * landlord are not agents.
 */
export const REFERRERS = [
  {
    kind: "Estate and letting agents",
    icon: ["M5.5 4.5h13v7h-13z", "M9 11.5v8", "M6 19.5h6"],
    copy: "You already act for landlords whose property is empty, will not shift, or is earning less than it should. Introduce one and we take it from there. We do not act on sales or long tenancies, so there is no instruction of yours for us to compete for.",
    point: "£275, or 3% for three months. Your choice, per property.",
  },
  {
    kind: "Anyone else",
    icon: ["M12 3.5 5 7v6c0 4 3 6.9 7 7.5 4-.6 7-3.5 7-7.5V7Z", "M8.8 12.2 11 14.4l4.2-4.4"],
    copy: "You do not have to work in property. Mortgage brokers, solicitors, accountants, relocation agents, developers, existing landlords, or somebody who simply knows an owner with an empty flat. One flat fee, nothing to weigh up.",
    point: "A flat £275 when the property goes live.",
  },
] as const;

/**
 * The landlords an agent already has on their books. This is the section that
 * turns an abstract offer into a name they can think of, so it is written as
 * situations rather than as categories.
 */
export const WHO_TO_REFER = [
  "A property that has been on the market for months and is still empty.",
  "An overseas owner who cannot manage anything from where they are.",
  "A landlord between tenancies, or facing a void they cannot fill.",
  "Someone unhappy with the return a long tenancy is giving them.",
  "An accidental landlord who never wanted to be one.",
  "A landlord already talking about trying Airbnb themselves.",
  "A portfolio owner who wants the whole thing off their desk.",
  "A developer sitting on completed units that are not selling yet.",
] as const;

/** How a referral runs. Five steps, and the referrer only does the first. */
export const REFERRAL_STEPS = [
  {
    num: "01",
    title: "Introduce the property",
    copy: "A postcode, the property type, and a name and number for the owner. Phone it through, email it, or use the form on this page.",
  },
  {
    num: "02",
    title: "We contact the owner",
    copy: "Usually the same day. We explain who we are and that you passed their details on, so nobody is surprised to hear from us.",
  },
  {
    num: "03",
    title: "We assess it honestly",
    copy: "The lease, the mortgage, the freeholder position, and what the property can realistically earn. If a short let is the wrong answer we say so, to you and to the owner.",
  },
  {
    num: "04",
    title: "The property goes live",
    copy: "Photography, listing, pricing and compliance. Most properties are taking bookings inside two weeks of the owner signing, and you are told on the day.",
  },
  {
    num: "05",
    title: "You are paid",
    copy: "Whichever option you took, within 14 days of the property going live, on our normal payout cycle. Nothing to invoice and nothing to chase.",
  },
] as const;

/** The commitments. The reason an introduction is safe to make. */
export const REFERRAL_TERMS = [
  "We do not act on sales or on long tenancies, so there is no instruction of yours for us to compete for.",
  "We will not approach the owner about either, and when they are ready for one we send them back to you.",
  "If the property sells or returns to a tenancy, the management ends. No exit fee and no tie-in.",
  "The property can still be marketed and viewed while it is let, with reasonable notice around bookings.",
  "Your fee is set out in writing, so an agent can disclose the arrangement to their client.",
  "If a short let is wrong for the property, we tell you before we tell the owner.",
] as const;

export const REFERRAL_FAQ = [
  {
    q: "Who can become a partner?",
    a: "Anyone. Estate and letting agents are the reason the programme exists and they get a choice of how they are paid, because they refer repeatedly and their properties vary. Everybody else, mortgage brokers, solicitors, accountants, relocation agents, developers, landlords and people who simply know an owner with an empty flat, takes the flat £275.",
  },
  {
    q: "How much do I receive?",
    a: "Estate and letting agents choose per property: £275 when the property goes live, or 3% of what it earns across its first three months. The two come level at about £3,000 a month, so a higher earning property is usually worth taking on the share. Everyone else takes the flat £275. There is no cap on how many properties you refer, either way.",
  },
  {
    q: "When do I get paid?",
    a: "Within 14 days of the property going live and earning, on our normal payout cycle. Not at introduction, and not at the end of a year.",
  },
  {
    q: "Does the landlord pay anything extra?",
    a: "No. The owner pays the same management fee whether they came through you or found us themselves: 15% of net revenue on the full-time plan, 18% on the flexible one. The referral fee comes out of our side, not theirs.",
  },
  {
    q: "Do I need to manage the landlord after introducing them?",
    a: "No. Once you have passed the details, the assessment, the paperwork and every conversation with the owner are ours. You are told when the property goes live and when you are paid.",
  },
  {
    q: "What happens after I submit a referral?",
    a: "We contact the owner, usually the same day, and tell them you passed their details on. We assess the property and tell you honestly whether it suits a short let. If it does, we onboard it; if it does not, we say so and nothing is owed either way.",
  },
  {
    q: "Can I refer more than one property?",
    a: "Yes, and there is no limit. Each property that goes live is its own £275, so five owners who go ahead is five payments.",
  },
  {
    q: "What happens if the landlord has already contacted Slate & Cove?",
    a: "Then the introduction is not yours, and we will tell you plainly rather than quietly. Whoever named the owner first has the referral, which is why it is worth sending us a name before the owner gets in touch themselves.",
  },
  {
    q: "Will you take my client off me?",
    a: "No, and it is in the agreement rather than left to good faith. We do not act on sales or long tenancies at all, so there is no instruction of yours for us to compete for. When the owner is ready to sell or let long term, we tell them to speak to you.",
  },
] as const;

/* --------------------------------------------------------------------------
   Home page: who it is for, and what we group the work into
   -------------------------------------------------------------------------- */

/**
 * The owners we help, written as the sentence they would use about themselves
 * rather than as a marketing segment. No claim about what any of them will
 * earn: the point is recognition, not a promise.
 */
export const OWNERS = [
  {
    who: "Too busy to run it yourself",
    copy: "You have a job. Guest messages at eleven at night and a cleaner who has not turned up are not part of it.",
  },
  {
    who: "Living overseas",
    copy: "The property is in London and you are not. Somebody has to hold keys, meet trades and answer the phone in the right time zone.",
  },
  {
    who: "A property sitting empty",
    copy: "Between tenancies, waiting on a sale, or simply unlet. An empty flat costs you every month it stands still.",
  },
  {
    who: "Already hosting, and tired of it",
    copy: "You have done it yourself and it works, but it has become a second job. The listing stays; the work moves.",
  },
  {
    who: "A let that is not performing",
    copy: "The tenancy no longer covers what it should, or the agent has gone quiet. Worth knowing what else the property could do.",
  },
  {
    who: "Building a portfolio",
    copy: "More than one property, and no appetite for running any of them. One team, one report, one point of contact.",
  },
] as const;

/**
 * The eight services in four groups.
 *
 * Eight separate cards asks the reader to hold eight things. Four groups asks
 * them to hold one idea, that the whole job is covered, which is the thing we
 * actually want them to leave with. Each service still links to its own page
 * for anybody who wants the detail.
 */
export const SERVICE_GROUPS = [
  {
    group: "Property",
    copy: "Getting it right before a guest ever sees it, and keeping it that way.",
    items: ["photography", "listing-optimisation", "cleaning-and-linen", "maintenance"],
  },
  {
    group: "Revenue",
    copy: "What the property is priced at, and how often it sells.",
    items: ["dynamic-pricing", "listing-optimisation"],
  },
  {
    group: "Guests",
    copy: "Who books, how they are handled, and what they write afterwards.",
    items: ["guest-communication", "review-management"],
  },
  {
    group: "Operations",
    copy: "The running of it, and the record of what happened.",
    items: ["cleaning-and-linen", "maintenance", "monthly-reporting"],
  },
] as const;

/** The process, in the four stages an owner actually experiences. */
export const HOW_IT_WORKS = [
  {
    num: "01",
    title: "We assess the property",
    copy: "A free consultation: the lease, the mortgage position, what it could realistically earn, and whether a short let suits it at all.",
  },
  {
    num: "02",
    title: "We prepare and list it",
    copy: "Photography, the listing, pricing and compliance. Most properties are taking bookings inside two weeks of signing.",
  },
  {
    num: "03",
    title: "We manage the guests and the property",
    copy: "Bookings, messages at any hour, changeovers, cleaning, linen and repairs. You can be as involved as you like.",
  },
  {
    num: "04",
    title: "You get a report and a payout",
    copy: "Occupancy, revenue, costs, our fee and your payout, on one statement, every month.",
  },
] as const;

/**
 * The questions a landlord asks on the home page, which are not the same as
 * the ones they ask after reading how it works. Six, then a link to the rest.
 */
export const HOME_FAQ = [
  {
    q: "What does Slate & Cove actually manage?",
    a: "All of it. The listing, the photography, the pricing, every guest message, check-in, cleaning, linen, maintenance, reviews and a monthly report. The only decisions that come to you are the ones that are genuinely yours to make.",
  },
  {
    q: "Do I have to deal with guests?",
    a: "No. Guest communication is ours, day and night, from the first enquiry to the review afterwards. Most owners never speak to a guest.",
  },
  {
    q: "Can I still use the property myself?",
    a: "Yes. Block out whatever dates you want. On the flexible plan there is no minimum availability at all, which is why that plan carries the higher fee.",
  },
  {
    q: "Do I need to furnish it first?",
    a: "It needs to be furnished to let short-term, but you do not need to have done it before we speak. We will tell you what the property needs and what is worth spending, and we would rather say that before you spend than after.",
  },
  {
    q: "What happens if something breaks?",
    a: "We deal with it. Faults are triaged the same day, we use trades we have used before, and you set a limit below which we simply get it done rather than telephoning you about a toilet seat. Every job appears on your monthly statement.",
  },
  {
    q: "How do I find out what my property could earn?",
    a: "Send us the property. A manager comes back within 24 hours with a realistic figure based on what comparable properties nearby are actually achieving. A well-run short let can potentially earn 30 to 40% more than a traditional long-term let, though that depends entirely on the property, its location, its availability and what it costs to run, which is why we look before quoting. It is free, there is no obligation, and if a short let is wrong for your property we will say so.",
  },
] as const;

/**
 * The work an owner is actually signing away. Stated plainly and once: the
 * point is recognition rather than alarm, and a landlord who has done it for
 * a month does not need persuading that it is a job.
 */
export const THE_WORK = [
  "Guest messages, at whatever hour they arrive",
  "Pricing the calendar, night by night",
  "Check-ins, keys and late arrivals",
  "Cleaning and linen between every stay",
  "Maintenance, and the trades to do it",
  "Reviews, asked for and answered",
  "Keeping the calendar full and the gaps priced",
  "Whatever goes wrong at two in the morning",
] as const;

/**
 * Who actually refers a property, written as jobs somebody holds rather than
 * as a list of "partner types". These are the people who find out first that
 * an owner has a property doing nothing.
 */
export const WHO_CAN_REFER = [
  "A friend or a relative with a flat they have stopped getting much out of",
  "A mortgage broker whose client has just completed on a second property",
  "A solicitor acting on a probate sale that nobody wants to rush",
  "An accountant whose client is asking what to do with an empty property",
  "A relocation agent whose client is leaving the country for a year",
  "A developer with completed units that have not sold yet",
  "A landlord who knows another landlord",
  "A builder, a cleaner or a concierge who sees inside a lot of properties",
] as const;
