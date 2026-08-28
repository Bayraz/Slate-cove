// All site copy, lifted verbatim from the Claude Design prototype
// "Slate and Cove Website.dc.html". Keeping it here means the repeated
// sections (services, comparison rows, FAQ, coverage areas) are data rather
// than duplicated markup.

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
] as const;

export const CONTACT = {
  email: "info@slateandcove.com",
  telephone: "+44 7484 646008",
  telephoneHref: "+447484646008",
  addressLines: ["124 City Road", "London EC1V 2NX"],
  hoursLines: ["Office, weekdays 9–6", "Guest line, always"],
} as const;

export const STATS = [
  { figure: "30–40%", label: "More than a long tenancy" },
  { figure: "7 days", label: "Onboarding, at the fastest" },
  { figure: "24/7", label: "Guest cover, every night" },
] as const;

export const SERVICES = [
  {
    title: "Listing optimisation",
    copy: "Titles, descriptions and keywords written for search, then tested and revised.",
  },
  {
    title: "Photography",
    copy: "Professional shoots, staging advice, and refreshed images as the property changes.",
  },
  {
    title: "Dynamic pricing",
    copy: "Rates moved daily against local demand, events, competitors and season.",
  },
  {
    title: "Guest communication",
    copy: "Screening, fast replies at any hour, and every message for the length of the stay.",
  },
  {
    title: "Cleaning & linen",
    copy: "Vetted teams, premium linen, photographed turnarounds and quality checks.",
  },
  {
    title: "Maintenance",
    copy: "Emergency response, trusted trades, and preventive work booked before it bites.",
  },
  {
    title: "Review management",
    copy: "Reviews requested, answered properly, and the feedback acted on.",
  },
  {
    title: "Monthly reporting",
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
      "“The team handled everything — photography, listings, guests, cleaning. I genuinely don't have to do a thing.”",
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

export const HOME_CTA_POINTS = [
  "Free income estimate for your property",
  "No lock-in contracts — cancel any time",
  "Onboarding in as little as 7 days",
  "A dedicated local property manager",
] as const;

export const STEPS = [
  {
    num: "01",
    title: "Consultation",
    copy: "A free consultation to understand the property, your goals and your expectations. We assess its potential, discuss availability, and answer any questions about how we manage.",
  },
  {
    num: "02",
    title: "Onboarding",
    copy: "We handle everything needed to get the property guest-ready: professional photography, listing creation, pricing setup, and coordinating any improvements worth making before launch.",
  },
  {
    num: "03",
    title: "Go live",
    copy: "The listing goes live across Airbnb, Booking.com and Vrbo. Dynamic pricing starts working immediately to attract bookings at the best achievable rates.",
  },
  {
    num: "04",
    title: "Ongoing management",
    copy: "Guest communication, cleaning, maintenance and reviews run from our side. You can be as involved as you like; most owners simply read the monthly report.",
  },
  {
    num: "05",
    title: "Monthly payout",
    copy: "At month end you receive a detailed performance report along with your payout — occupancy, revenue, expenses and our fee, set out in full.",
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

export const FOOTER_SERVICES = [
  "Listing optimisation",
  "Photography",
  "Dynamic pricing",
  "Guest communication",
  "Cleaning & linen",
  "Maintenance",
  "Monthly reporting",
] as const;
