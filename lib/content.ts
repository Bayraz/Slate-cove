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
