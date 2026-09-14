// All site copy, lifted verbatim from the Claude Design prototype
// "Slate and Cove Website.dc.html". Keeping it here means the repeated
// sections (services, comparison rows, FAQ, coverage areas) are data rather
// than duplicated markup.

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "For Landlords" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
] as const;

export const CONTACT = {
  email: "info@slateandcove.com",
  telephone: "+44 7484 646008",
  telephoneHref: "+447484646008",
  addressLines: ["124 City Road", "London EC1V 2NX"],
  hoursLines: ["Office, weekdays 9am–10pm", "Guest line, always"],
} as const;

export const STATS = [
  { figure: "30–40%", label: "More than a long tenancy" },
  { figure: "7 days", label: "Onboarding, at the fastest" },
  { figure: "24/7", label: "Guest cover, every night" },
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

export const COMPARISON_COLUMNS = ["Slate & Cove", "Hosting yourself", "Estate agent"] as const;

export const COMPARISON_ROWS = [
  { label: "Short-stay lettings", values: ["Yes", "Yes", "No"] },
  { label: "Verified guest screening", values: ["Yes", "No", "Yes"] },
  { label: "Fully hands-off management", values: ["Yes", "No", "No"] },
  { label: "Round-the-clock guest support", values: ["Yes", "No", "No"] },
  { label: "Repairs & upkeep", values: ["Yes", "No", "Yes"] },
  { label: "Smart dynamic pricing", values: ["Yes", "No", "No"] },
  { label: "Listed across all platforms", values: ["Yes", "No", "No"] },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "“Within the first month we were earning 35% more than with our previous long-term tenant. Absolutely brilliant service.”",
    name: "James Thornton",
    role: "Landlord, Manchester",
  },
  {
    quote:
      "“The team handled everything: photography, listings, guests, cleaning. I genuinely don't have to do a thing.”",
    name: "Sarah Okafor",
    role: "Property owner, London",
  },
  {
    quote:
      "“The transparency is what sets them apart. A clear monthly report and my payout lands on time every single month.”",
    name: "David Whitmore",
    role: "Landlord, Birmingham",
  },
] as const;

/** The tick used on feature lists. One definition, so they never diverge. */
export const TICK = [
  "M12 3.4 20.2 7v5.4c0 4.3-3.3 7.5-8.2 8.7-4.9-1.2-8.2-4.4-8.2-8.7V7Z",
  "M8.6 12.2 11 14.6l4.6-4.8",
] as const;

export const HOME_CTA_POINTS = [
  "Free income estimate for your property",
  "No lock-in contracts, cancel any time",
  "Onboarding in as little as 7 days",
  "A dedicated local property manager",
] as const;

export const STEPS = [
  {
    num: "01",
    title: "Consultation",
    icon: ["M20.5 12c0 3.6-3.8 6.5-8.5 6.5-1.1 0-2.2-.2-3.2-.5L4 20l1.5-3.6A6.1 6.1 0 0 1 3.5 12c0-3.6 3.8-6.5 8.5-6.5S20.5 8.4 20.5 12Z"],
    copy: "A free consultation to understand the property, your goals and your expectations. We assess its potential, discuss availability, and answer any questions about how we manage.",
  },
  {
    num: "02",
    title: "Onboarding",
    icon: ["M3.5 8h4l1.6-2.5h5.8L16.5 8h4v12.5h-17z", "M12 17.5a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z"],
    copy: "We handle everything needed to get the property guest-ready: professional photography, listing creation, pricing setup, and coordinating any improvements worth making before launch.",
  },
  {
    num: "03",
    title: "Go live",
    icon: ["M12 3.5 5 7v6c0 4 3 6.9 7 7.5 4-.6 7-3.5 7-7.5V7Z", "M12 8.5v7", "M8.5 12h7"],
    copy: "The listing goes live across Airbnb, Booking.com and Vrbo. Dynamic pricing starts working immediately to attract bookings at the best achievable rates.",
  },
  {
    num: "04",
    title: "Ongoing management",
    icon: ["M12 15.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z", "M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"],
    copy: "Guest communication, cleaning, maintenance and reviews run from our side. You can be as involved as you like; most owners simply read the monthly report.",
  },
  {
    num: "05",
    title: "Monthly payout",
    icon: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3", "M8 14.5v3", "M12 13v4.5", "M16 15.5v2"],
    copy: "At month end you receive a detailed performance report along with your payout: occupancy, revenue, expenses and our fee, set out in full.",
  },
] as const;

export const FAQ = [
  {
    q: "How much can I earn?",
    a: "Earnings depend on location, size, amenities and season. On average our managed properties earn 40% more than self-managed listings. We give a personalised estimate at the consultation, based on comparable properties nearby.",
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

/**
 * The commercial terms offered to a referring agent.
 *
 * Two options, picked per property rather than once for the whole
 * relationship. `crossover` is where they come level and is derived, not
 * chosen: three months of 3% is 9% of one month's revenue, so it is the flat
 * fee divided by 0.09. Change a number here and the table, the worked
 * examples and the calculator all move together.
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
 * Properties an agent has already given up on. Each line says what we would
 * do with it, and none of them claims a figure we cannot stand behind.
 */
export const PARTNER_SEND = [
  {
    title: "The flat that has been on since spring",
    copy: "It earns while it stays on the market with you, and still shows for viewings.",
  },
  {
    title: "The one nobody wants to rent",
    copy: "Most are listed and taking bookings inside two weeks of the owner signing.",
  },
  {
    title: "The landlord who says the numbers no longer work",
    copy: "We price it properly and tell them what it can honestly do, month by month.",
  },
  {
    title: "The client who inherited a flat",
    copy: "Income from it without handing the keys to anyone for twelve months.",
  },
  {
    title: "The owner moving back in next year",
    copy: "The gap earns, and the property is theirs again on thirty days' notice.",
  },
  {
    title: "The block with units standing empty",
    copy: "The fee is the same on every unit, so a block is where this pays properly.",
  },
] as const;

/**
 * The two routes in, one per kind of agent. A sales agent and a letting agent
 * are not the same reader and do not want the same thing, and a page that
 * blurs them speaks properly to neither.
 */
export const PARTNER_ROUTES = [
  {
    kind: "If you sell",
    title: "Let it while it sells",
    icon: ["M5.5 4.5h13v7h-13z", "M9 11.5v8", "M6 19.5h6"],
    copy: "Your vendor has been on the market four months and is still paying a mortgage on an empty flat. We run it as a short let while it stays listed with you. It can be viewed with reasonable notice, it shows better for being cleaned and maintained every few days, and the moment it sells the management ends.",
    point: "The sale stays yours. We do not act on sales.",
  },
  {
    kind: "If you let",
    title: "We take the management",
    icon: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3", "M9.5 15h5"],
    copy: "A landlord who wants the property earning rather than sitting between tenancies, or who has decided a long tenancy is not working. They come to us on our standard management terms, the same ones any owner gets, and we run the property day to day. You keep the relationship and the instruction.",
    point: "The landlord stays your client, and your landlord.",
  },
] as const;

/**
 * Why a small agency in particular. The corporates have their own short-let
 * arm and will not refer anything; an independent has the same properties and
 * nowhere to send them.
 */
export const PARTNER_WHO =
  "This is for independent agencies, whether that is one office or a handful. A corporate chain has its own short-let arm and an instruction to keep everything in house. You have the same stalled sales and the same empty months, nowhere to send them, and better things to do than build a short-let operation to deal with it.";

/**
 * What the fee does not cover. An agent putting their name to a supplier is
 * lending us their reputation, and that is a bigger decision than the fee, so
 * these three are about what happens in front of their client rather than
 * about money.
 */
export const PARTNER_OFFER = [
  {
    title: "We will tell you when it is a no",
    icon: ["M11 18.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15", "M16.4 16.4 20.5 20.5", "M8.6 11h4.8"],
    copy: "Some properties should not be short let. If the lease forbids it, the mortgage will not allow it or the numbers simply do not work, you hear that from us first and you decide how to put it to your client.",
  },
  {
    title: "The client stays yours, and comes back",
    icon: ["M12 3.5 5 7v6c0 4 3 6.9 7 7.5 4-.6 7-3.5 7-7.5V7Z", "M8.8 12.2 11 14.4l4.2-4.4"],
    copy: "We do not pitch your client for a sale or a tenancy and we do not market to them. When an owner we manage decides to sell or to let long term, we send them to the agent who introduced them. The referral runs in both directions.",
  },
  {
    title: "You make one introduction",
    icon: ["M6 3.5h12v17H6z", "M9.2 12.3 11 14.1l3.8-4", "M9 7.5h6"],
    copy: "After the email, the assessment, the lease and mortgage questions, the photography, the listing and every conversation with the owner are ours. You are copied in when the property goes live and again when you are paid.",
  },
] as const;

/** How a referral actually runs, so nobody has to ask. */
export const PARTNER_STEPS = [
  {
    num: "01",
    title: "You introduce us",
    icon: ["M20.5 12c0 3.6-3.8 6.5-8.5 6.5-1.1 0-2.2-.2-3.2-.5L4 20l1.5-3.6A6.1 6.1 0 0 1 3.5 12c0-3.6 3.8-6.5 8.5-6.5S20.5 8.4 20.5 12Z"],
    copy: "A postcode, the property type and a name to call. Phone it through, email it, or put it in the form at the foot of this page. That is the introduction done.",
  },
  {
    num: "02",
    title: "We assess it honestly",
    icon: ["M11 18.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15", "M16.4 16.4 20.5 20.5"],
    copy: "We look at the lease, the mortgage, the freeholder position and what the property can realistically earn. If a short let is the wrong answer we say so, to you and to the owner, rather than signing something that unravels in month three.",
  },
  {
    num: "03",
    title: "It goes live",
    icon: ["M3.5 8h4l1.6-2.5h5.8L16.5 8h4v12.5h-17z", "M12 17.5a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z"],
    copy: "Photography, the listing, pricing and the compliance paperwork. Most properties are taking bookings inside two weeks of the owner signing, and you are copied in on the day it happens.",
  },
  {
    num: "04",
    title: "You are paid monthly",
    icon: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3", "M8 14.5v3", "M12 13v4.5", "M16 15.5v2"],
    copy: "Whichever option you took, it is paid on our normal payout cycle with a statement behind it. Nothing to invoice, nothing to chase, and no waiting for a year end.",
  },
] as const;

/** The commitments, in the order an agent worries about them. */
export const PARTNER_TERMS = [
  "We do not act on sales or on long tenancies, so there is no instruction of yours for us to compete for.",
  "When an owner we manage is ready to sell or to let long term, we send them back to you.",
  "We will not approach your client about a sale or a tenancy, and we will not add them to any marketing list.",
  "If the property sells or returns to a tenancy, the management ends. No exit fee, and no tie-in on the flexible plan.",
  "The property can still be marketed and viewed while it is let, with reasonable notice around bookings.",
  "Your fee, and which option you took, are set out in writing so you can disclose the arrangement to your client.",
  "We check the lease, the mortgage terms and the freeholder position before anything is listed.",
  "One property is enough to start, and there is nothing to sign before you send it.",
] as const;

export const PARTNER_FAQ = [
  {
    q: "Will you take my client off me?",
    a: "No, and it is in the agreement rather than left to good faith. We do not act on sales or long tenancies at all, so there is no instruction of yours for us to compete for. When the owner is ready to sell or to let long-term, we tell them to speak to you.",
  },
  {
    q: "Do I have to tell my client about the fee?",
    a: "Yes. Estate agents are expected to disclose referral arrangements to clients, in writing, including who the arrangement is with and what it is worth. We make that straightforward: you get the arrangement and the figures in writing before you refer anyone, in a form you can pass to your client. If you are unsure what your own obligations are, your redress scheme or Propertymark will tell you.",
  },
  {
    q: "Can the property still be on the market while you manage it?",
    a: "Yes, and for a stalled sale that is usually the point. Viewings are arranged around bookings with reasonable notice, and a property that is being cleaned and maintained every few days shows better than one that has been standing empty since February.",
  },
  {
    q: "What about the 90-night rule?",
    a: "In London a property let on short lets is generally limited to 90 nights a year without planning permission. We manage to that limit rather than around it, and where a property runs out of nights we look at medium-term and corporate lets, which fall outside it. Outside London the position depends on the local authority.",
  },
  {
    q: "What kind of property is worth referring?",
    a: "One or two bedroom flats in London and the Home Counties are the core of it, particularly anything near a station, a hospital or a business district. A large family house in a quiet suburb usually is not. Send it anyway and we will tell you either way.",
  },
  {
    q: "I am a letting agent. Does this cost me a management fee?",
    a: "It replaces a management fee on a property that is currently earning you nothing, and pays you on one that is earning. If the landlord is between tenancies, or has decided a long tenancy no longer works for them, the alternative is usually an empty property or a client who sells. Where a long tenancy is working, leave it alone. We are not trying to convert your managed book.",
  },
  {
    q: "What if the landlord wants to go back to a long tenancy?",
    a: "Then they should, and we will hand the property back. On the flexible plan that takes 30 days. We would rather you got the tenancy than we kept a property on a listing the owner has stopped wanting.",
  },
] as const;

/**
 * The landlord referral, which is a different offer to a different person.
 *
 * An agent is paid for introducing a client they act for, and chooses between
 * two options. A landlord is paid for introducing someone they know, which is
 * a smaller thing to ask and a simpler thing to explain, so it is one figure
 * and one condition.
 *
 * It is for owners we already manage for. That is deliberate rather than mean:
 * a recommendation from somebody whose property we actually run is worth
 * having, and it is the only version of this we can put a price on honestly.
 *
 * "The deal goes through" needs a date attached or it becomes an argument
 * later, so it is the property going live and earning, paid within 14 days,
 * which is the same trigger and the same window as the agent's flat fee.
 */
export const LANDLORD_REFERRAL = {
  fee: "£250",
  window: "within 14 days",
} as const;

export const LANDLORD_REFERRAL_POINTS = [
  "For owners we already manage for. If we run a property for you, this is open to you.",
  "Paid within 14 days of their property going live, on the same cycle as your own payout.",
  "There is no cap. Five owners who go ahead is five payments.",
  "Tell them to mention your name, or send us theirs and we will make the call.",
  "If we assess the property and decline it, nothing is owed and nobody is out of pocket.",
] as const;
