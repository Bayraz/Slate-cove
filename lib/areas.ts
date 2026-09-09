// The per-area landing pages.
//
// Each area carries its own copy. That is the whole point: 38 near-identical
// pages would be thin content and would rank for nothing, so `intro`, `stock`
// and `guests` are written for the specific place — the property it actually
// has, and who actually stays there. No invented figures anywhere; the claims
// here are the sort a local manager would make from knowing the area.

export type Area = {
  slug: string;
  name: string;
  group: string;
  /** Why short lets work here. */
  intro: string;
  /** The housing stock we typically take on. */
  stock: string;
  /** Who books, and what that means for how the property is run. */
  guests: string;
};

export const AREA_PAGES: Area[] = [
  {
    slug: "central-london",
    name: "Central London",
    group: "Central London",
    intro:
      "Central London is the densest short-let market in the country, and the most competitive. Nightly rates are high, but so is supply, which means a listing lives or dies on its photography, its review score and how sharply it is priced against the week ahead.",
    stock:
      "Mostly flats: mansion-block conversions, purpose-built apartments above shops and offices, and new-build units in mixed-use schemes. Space is tight and storage matters, so we furnish for the room rather than filling it.",
    guests:
      "A constant mix of leisure visitors, business travellers and people in town for a few nights of theatre or shopping. Arrivals run late and often the same day they book, which is why guest messaging around the clock matters more here than almost anywhere.",
  },
  {
    slug: "kensington",
    name: "Kensington",
    group: "Central London",
    intro:
      "Kensington draws a steady, year-round audience — the museums, Kensington Gardens and the Royal Albert Hall keep demand from collapsing out of season the way it does in more purely business districts.",
    stock:
      "Stucco-fronted terraces divided into flats, red-brick mansion blocks, and garden-square apartments. Period features are the selling point and the maintenance burden in equal measure — sash windows, high ceilings, older heating systems.",
    guests:
      "Families visiting the V&A and Natural History Museum, longer corporate stays, and international visitors who expect a certain standard of finish. Stays skew longer than the London average, which suits owners who would rather have fewer changeovers.",
  },
  {
    slug: "notting-hill",
    name: "Notting Hill",
    group: "Central London",
    intro:
      "Notting Hill has one of the strongest brand pulls of any London postcode, which brings a large volume of searches by name. Demand spikes hard around Carnival and through the summer, and pricing has to move with it.",
    stock:
      "Pastel terraces split into maisonettes and garden flats, plus period conversions around Portobello and Ladbroke Grove. Character sells the listing; the practical work is in noise, stairs and the state of shared entrances.",
    guests:
      "Couples and small groups, a lot of first-time London visitors, and repeat guests who book the same street. Portobello Market pulls weekend traffic, so Friday and Saturday nights price very differently from midweek.",
  },
  {
    slug: "paddington",
    name: "Paddington",
    group: "Central London",
    intro:
      "Paddington is a transport hub first, and that shapes everything. The Heathrow Express and the Elizabeth line put a flat here within easy reach of the airport and the City, which supports short one and two-night stays that would not work elsewhere.",
    stock:
      "Georgian and Victorian terraces converted into flats around the station and Sussex Gardens, plus newer apartments in the basin developments. Compact units are the norm and they let well.",
    guests:
      "Business travellers, people connecting through Heathrow, and visitors who want to drop bags and get moving. Self check-in is close to essential — arrivals land at every hour.",
  },
  {
    slug: "little-venice-maida-vale",
    name: "Little Venice & Maida Vale",
    group: "Central London",
    intro:
      "Quieter than the postcodes around it, and priced accordingly — guests choose here when they want central access without central noise. That makes it a reliable rather than spectacular short-let market, which many owners prefer.",
    stock:
      "Large mansion-block flats with generous room sizes, plus canal-side apartments around the basin. Ceiling heights and floor plates are better than most of central London, so these listings photograph well.",
    guests:
      "Longer stays: relocations, people between homes, and families who want space rather than a location to brag about. Fewer changeovers, lower wear, steadier occupancy.",
  },
  {
    slug: "earls-court",
    name: "Earls Court",
    group: "Central London",
    intro:
      "Earls Court has long been a landing point for people arriving in London, and the short-let demand reflects that — a lot of medium-length stays from people who have not yet found somewhere permanent.",
    stock:
      "Dense period conversions, studios and one-beds, with a good supply of purpose-built blocks. Units are small, turn over quickly, and reward efficient furnishing over statement pieces.",
    guests:
      "Relocators, students' families, and budget-conscious international visitors. Price sensitivity is real here, so dynamic pricing does more work than in the neighbouring postcodes.",
  },
  {
    slug: "chelsea",
    name: "Chelsea",
    group: "Central London",
    intro:
      "Chelsea sits at the premium end of the London short-let market. Guests expect the finish to match the address, and a listing that under-delivers on presentation gets punished in reviews rather than in bookings.",
    stock:
      "Period terraces off the King's Road, garden-square flats, and mansion blocks near the river. Interiors carry the listing, and photography is the single highest-return thing an owner can invest in here.",
    guests:
      "Affluent leisure travellers, longer corporate lets, and visitors in town for events at the Design Centre or Stamford Bridge. Expectations around linen, cleanliness and responsiveness are the highest we deal with.",
  },
  {
    slug: "southbank",
    name: "Southbank",
    group: "Central London",
    intro:
      "Southbank runs on culture and proximity. Guests are booking to walk to the National Theatre, the Tate or a concert at the Royal Festival Hall, and they will pay for the ten-minute walk rather than the tube ride.",
    stock:
      "Modern apartments in riverside blocks, plus converted warehouse and office space set back from the water. Newer stock means fewer maintenance surprises and better sound insulation.",
    guests:
      "Theatre and concert audiences, weekend city breaks, and business travellers working near Waterloo. Short stays dominate, so turnaround speed and cleaning reliability decide whether the calendar fills.",
  },
  {
    slug: "farringdon",
    name: "Farringdon",
    group: "Central London",
    intro:
      "Farringdon has been reshaped by the Elizabeth line, and short-let demand has followed. It is one of the few places where a guest can reach Heathrow, the City and the West End without changing trains.",
    stock:
      "Converted warehouses and print works, loft-style apartments, and newer blocks around Clerkenwell. Exposed brick and industrial detail set these listings apart in search results.",
    guests:
      "Business travellers, design and tech visitors, and weekend guests drawn by the restaurant scene. Midweek occupancy is unusually strong, which balances a calendar that elsewhere depends on weekends.",
  },
  {
    slug: "elephant-and-castle",
    name: "Elephant & Castle",
    group: "Central London",
    intro:
      "Elephant & Castle offers genuine Zone 1 access at a lower entry price than the postcodes across the river, and the regeneration has brought a lot of new stock to market. Competition is rising, so pricing discipline matters.",
    stock:
      "Predominantly new-build apartments with lifts, concierge and modern services — straightforward to run, and guests know what they are getting. Some period conversions towards Kennington and Walworth.",
    guests:
      "Value-conscious visitors who want central access, contractors on medium-length assignments, and people visiting nearby hospitals and universities. Length of stay is longer than the central average.",
  },
  {
    slug: "hammersmith",
    name: "Hammersmith",
    group: "London zones 2–4",
    intro:
      "Hammersmith works as a short-let location because of its transport: four tube lines and a straight run to Heathrow. It draws steady business demand that does not depend on tourism holding up.",
    stock:
      "Victorian terraces converted into flats, mansion blocks near the river, and purpose-built apartments around the broadway. Riverside units command a clear premium.",
    guests:
      "Corporate stays tied to the offices around the flyover, visitors to the Apollo, and travellers using Heathrow. Weekday occupancy is the backbone of the calendar here.",
  },
  {
    slug: "barons-court",
    name: "Barons Court",
    group: "London zones 2–4",
    intro:
      "Barons Court is a quiet residential pocket with two tube lines, and it benefits from spillover whenever Kensington and Hammersmith price guests out. Bookings are steady rather than seasonal.",
    stock:
      "Handsome Edwardian mansion blocks and terraced conversions, with better room proportions than the price suggests. Well-kept communal areas make a visible difference to reviews.",
    guests:
      "Longer stays, relocations, and visitors to the Queen's Club tournament in early summer, which is the one week the area prices like the postcode next door.",
  },
  {
    slug: "fulham",
    name: "Fulham",
    group: "London zones 2–4",
    intro:
      "Fulham is residential in character, which suits guests who want a neighbourhood rather than a hotel district. Demand is reliable and less exposed to the swings that hit central London.",
    stock:
      "Rows of Victorian terraces, many split into upper and lower maisonettes, plus riverside apartments towards Imperial Wharf. Gardens and outside space are a real differentiator in listings.",
    guests:
      "Families, longer corporate lets, and match-day demand around Craven Cottage and Stamford Bridge. Fixture lists are worth pricing against — they move nightly rates sharply.",
  },
  {
    slug: "shepherds-bush",
    name: "Shepherd's Bush",
    group: "London zones 2–4",
    intro:
      "Shepherd's Bush combines Westfield, the Central line and a strong live-music scene, which produces a broad and fairly resilient mix of demand across the week.",
    stock:
      "Period conversions around the green, ex-local-authority flats offering good space for the money, and newer blocks near the shopping centre. A wide range of price points in a small area.",
    guests:
      "Shoppers, concert and event audiences, and business travellers using the Central line. Event nights at the Empire and O2 Academy visibly lift rates.",
  },
  {
    slug: "chiswick",
    name: "Chiswick",
    group: "London zones 2–4",
    intro:
      "Chiswick behaves more like a town than a London suburb, and guests book it deliberately for that. The High Road, the river and the green space support longer, calmer stays.",
    stock:
      "Victorian and Edwardian family houses, many still whole rather than converted, plus flats on the High Road and towards Turnham Green. Whole houses are the standout listings here.",
    guests:
      "Families, relocating professionals, and film and media visitors working nearby. Stays are longer than the London average, which means fewer changeovers and lower running costs.",
  },
  {
    slug: "brentford",
    name: "Brentford",
    group: "London zones 2–4",
    intro:
      "Brentford has changed considerably with the waterside development and the stadium, and short-let demand has grown with it. It is well placed for Heathrow without being under the flight path.",
    stock:
      "Mostly modern apartments along the Grand Union Canal and the Thames, with lifts, parking and low maintenance overhead. Some Victorian terraces towards the high street.",
    guests:
      "Match-day visitors, business travellers heading to the Golden Mile offices, and Heathrow traffic. Parking availability is a genuine selling point that many London listings cannot offer.",
  },
  {
    slug: "kew",
    name: "Kew",
    group: "London zones 2–4",
    intro:
      "Kew is a destination in itself. The Gardens and the National Archives generate visitor demand that has nothing to do with central London, which makes the calendar behave differently from the rest of the city.",
    stock:
      "Edwardian terraces and semi-detached houses, generously proportioned, often with gardens. Larger properties suit groups and families who cannot find comparable space closer in.",
    guests:
      "Garden visitors across the whole year, researchers using the Archives, and families wanting green space. Spring and early summer are the strongest weeks.",
  },
  {
    slug: "acton",
    name: "Acton",
    group: "London zones 2–4",
    intro:
      "Acton is exceptionally well connected — Central, District, Piccadilly, Overground and now the Elizabeth line — while remaining cheaper to buy into than the areas either side. That combination works well for short lets.",
    stock:
      "Victorian terraces divided into flats, ex-local-authority stock offering strong space per pound, and new development around the Elizabeth line stations.",
    guests:
      "Contractors on medium-length assignments, Heathrow travellers, and visitors who want fast central access on a budget. Occupancy is steady rather than seasonal.",
  },
  {
    slug: "ealing",
    name: "Ealing",
    group: "London zones 2–4",
    intro:
      "Ealing has always been a family suburb, and the Elizabeth line has made it a viable base for visitors too — Bond Street is a short ride, Heathrow shorter still.",
    stock:
      "Large Edwardian and Victorian houses, many converted into good-sized flats, plus mansion blocks near the common. Space is the advantage over anything closer to the centre.",
    guests:
      "Families, relocations, and business travellers using the Elizabeth line. Longer stays are common, and the local demand for corporate housing is steadier than most outer boroughs.",
  },
  {
    slug: "wembley",
    name: "Wembley",
    group: "London zones 2–4",
    intro:
      "Wembley is the clearest event-driven short-let market in London. Stadium and Arena dates transform nightly rates, and a calendar priced without reference to the fixture list leaves a great deal on the table.",
    stock:
      "Overwhelmingly new-build apartments in the Park development — modern, low-maintenance, well suited to short stays. Some older terraces towards Alperton and Sudbury.",
    guests:
      "Concert and match audiences booking in bursts, plus outlet shoppers and business visitors midweek. Demand is spiky, which makes daily repricing the single most valuable thing we do here.",
  },
  {
    slug: "hounslow",
    name: "Hounslow",
    group: "London zones 2–4",
    intro:
      "Hounslow's short-let market is built on Heathrow. Airline crews, delayed passengers and airport-adjacent business generate demand every night of the year, largely independent of tourist seasons.",
    stock:
      "Terraced houses and low-rise flats, with newer blocks near the town centre. Practical, hard-wearing furnishing matters more than styling for this guest mix.",
    guests:
      "Airport staff and crew, travellers with early departures, and families visiting relatives. Very short stays dominate, so smooth self check-in and fast turnarounds are everything.",
  },
  {
    slug: "canary-wharf",
    name: "Canary Wharf",
    group: "London zones 2–4",
    intro:
      "Canary Wharf is a corporate market with a weekday rhythm. Rates hold up well Monday to Thursday and soften at weekends — close to the inverse of most of London, which makes it a useful thing to own alongside a central property.",
    stock:
      "High-specification tower apartments with concierge, gyms and river views. Building management handles much of the fabric, so the operational work is concentrated in guest experience.",
    guests:
      "Finance and professional-services travellers, project teams on multi-week assignments, and relocating employees. Corporate bookers expect fast, businesslike communication and reliable invoicing.",
  },
  {
    slug: "whitechapel",
    name: "Whitechapel",
    group: "London zones 2–4",
    intro:
      "Whitechapel gained an Elizabeth line station and with it a genuinely central position. It offers City access at East London prices, and the short-let market has responded quickly.",
    stock:
      "Converted warehouses, new-build blocks around the station, and Victorian terraces towards Stepney. Considerable variety, and listings need to be clear about which they are.",
    guests:
      "Business travellers working in the City, visitors to the Royal London Hospital, and weekend guests drawn by Brick Lane and Spitalfields. Midweek and weekend demand are both solid.",
  },
  {
    slug: "battersea",
    name: "Battersea",
    group: "London zones 2–4",
    intro:
      "Battersea has been transformed by the Power Station development and its Northern line extension. It is now a destination rather than a place people pass through, and nightly rates reflect that.",
    stock:
      "New-build riverside apartments with strong amenity provision, plus Victorian terraces in the streets behind. The new stock is easy to run and photographs extremely well.",
    guests:
      "Leisure visitors to the Power Station and the park, corporate stays tied to nearby offices and the US Embassy, and weekend city breaks. Demand is broad rather than concentrated.",
  },
  {
    slug: "wandsworth",
    name: "Wandsworth",
    group: "London zones 2–4",
    intro:
      "Wandsworth is residential and family-oriented, and short lets here tend to be longer and steadier than the London norm. It rewards owners who want reliability over peak nightly rates.",
    stock:
      "Victorian terraces in the grid streets, many with gardens, plus riverside apartments towards the bridge. Family-sized properties are the strongest performers.",
    guests:
      "Relocating families, people between property purchases, and visitors staying with family nearby. Multi-week bookings are common, which keeps cleaning and changeover costs low.",
  },
  {
    slug: "harrow",
    name: "Harrow",
    group: "Greater London",
    intro:
      "Harrow generates its own demand rather than borrowing central London's — the school, the hospital and a substantial local business base all bring visitors who need somewhere to stay nearby.",
    stock:
      "Semi-detached and detached houses with driveways and gardens, plus flats near the station. Parking is standard here, which is a genuine advantage in listings.",
    guests:
      "School visits and term dates, hospital patients and their families, and business travellers. Demand is less seasonal than central London and holds up through the winter.",
  },
  {
    slug: "hayes",
    name: "Hayes",
    group: "Greater London",
    intro:
      "Hayes sits between Heathrow and the Elizabeth line, and its short-let demand is overwhelmingly practical: people who need to be near the airport or a nearby industrial employer.",
    stock:
      "Terraced and semi-detached houses, plus new apartments around the station and the old Old Vinyl Factory site. Robust, straightforward properties.",
    guests:
      "Contractors, airport workers and crew, and families visiting relatives. Long midweek stays are common and turnover is low, which keeps running costs down.",
  },
  {
    slug: "yeading",
    name: "Yeading",
    group: "Greater London",
    intro:
      "Yeading is a quiet residential area with very little hotel provision, which is precisely why short lets do well — visitors to the area often have no real alternative.",
    stock:
      "Post-war semis and terraces, typically with gardens and off-street parking, offering considerably more space than anything at a comparable price closer in.",
    guests:
      "Contractors working nearby, families visiting relatives, and Heathrow-related stays. Bookings run long, and guests value space and parking over location.",
  },
  {
    slug: "uxbridge",
    name: "Uxbridge",
    group: "Greater London",
    intro:
      "Uxbridge combines a university, a large business park presence and the end of two tube lines. That produces year-round demand tied to term dates and corporate calendars rather than tourism.",
    stock:
      "Family houses and modern flats near the town centre, most with parking. Practical properties that suit longer stays.",
    guests:
      "University visitors and open days, corporate travellers, and RAF Northolt-related stays. Occupancy is steady and lightly seasonal.",
  },
  {
    slug: "slough",
    name: "Slough",
    group: "Berkshire",
    intro:
      "Slough is a corporate short-let market. The trading estate hosts a large concentration of company headquarters, and the Elizabeth line has made the town far easier to reach from central London and Heathrow.",
    stock:
      "New apartment blocks near the station, plus terraced and semi-detached houses across the town. Parking and reliable broadband matter more to these guests than styling.",
    guests:
      "Contractors and project teams on multi-week bookings, corporate relocations, and Heathrow travellers. Weekday demand is strong and stays are long, which is about as efficient as short lets get.",
  },
  {
    slug: "windsor",
    name: "Windsor",
    group: "Berkshire",
    intro:
      "Windsor is a genuine tourist destination with the visitor numbers to match. The Castle, Legoland and the racecourse produce demand that peaks hard in summer and around events, and prices accordingly.",
    stock:
      "Period cottages and townhouses in the centre, plus riverside apartments and family homes towards Eton and Dedworth. Character properties near the Castle command the strongest rates.",
    guests:
      "Families visiting Legoland, international tourists, wedding and racing parties, and Heathrow travellers wanting somewhere pleasanter than an airport hotel. Weekend and school-holiday pricing does the heavy lifting.",
  },
  {
    slug: "maidenhead",
    name: "Maidenhead",
    group: "Berkshire",
    intro:
      "Maidenhead has benefited enormously from the Elizabeth line, and its short-let demand is a mix of Thames Valley corporate business and leisure visitors using it as a base for Windsor and the river.",
    stock:
      "Modern apartments near the station following the town-centre regeneration, plus family houses in the surrounding streets. Newer stock is easy to manage remotely.",
    guests:
      "Business travellers working across the Thames Valley, Henley and Ascot event visitors, and families exploring the river. Weekday corporate and weekend leisure balance the calendar well.",
  },
  {
    slug: "reading",
    name: "Reading",
    group: "Berkshire",
    intro:
      "Reading is the commercial centre of the Thames Valley and one of the strongest corporate short-let markets outside London. Technology employers and a major rail interchange keep demand consistent through the year.",
    stock:
      "Apartments in the central developments and around the station, plus Victorian terraces in the surrounding neighbourhoods. Central flats let best to the corporate market.",
    guests:
      "Contractors and consultants on multi-week stays, conference and event visitors, and university-related demand. Reading Festival week is the single strongest pricing event of the year.",
  },
  {
    slug: "bracknell",
    name: "Bracknell",
    group: "Berkshire",
    intro:
      "Bracknell's short-let demand comes almost entirely from business. The town hosts a significant technology and corporate presence, and visiting teams need somewhere better suited to a fortnight than a hotel room.",
    stock:
      "Modern houses and apartments, most with parking, many built as part of the town-centre regeneration. Uniform, well-specified stock that is straightforward to run.",
    guests:
      "Project teams, contractors and relocating employees. Bookings are long, weekday-weighted and repeat often, which makes for unusually predictable occupancy.",
  },
  {
    slug: "ascot",
    name: "Ascot",
    group: "Berkshire",
    intro:
      "Ascot is an event market above all else. Royal Ascot and the racing calendar produce demand at rates that no ordinary week comes close to, and the rest of the year runs on corporate and leisure visitors.",
    stock:
      "Detached houses and substantial family homes with gardens and parking, plus apartments near the high street. Larger properties suit the group bookings that racing weeks bring.",
    guests:
      "Racegoers and hospitality groups, golf visitors, and Thames Valley business travellers. Pricing around the racing calendar is where most of the year's upside sits.",
  },
  {
    slug: "watford",
    name: "Watford",
    group: "Hertfordshire, Surrey & Buckinghamshire",
    intro:
      "Watford has two distinct sources of short-let demand: the Warner Bros. Studio Tour, which draws visitors from around the world year-round, and a substantial local corporate base.",
    stock:
      "Victorian terraces near the centre, semi-detached family houses, and newer apartments by the station. Family-sized properties do best against the studio-tour audience.",
    guests:
      "Families visiting the Studio Tour, business travellers, and football and concert visitors. Studio Tour demand is remarkably steady across the year, which smooths the calendar.",
  },
  {
    slug: "staines",
    name: "Staines",
    group: "Hertfordshire, Surrey & Buckinghamshire",
    intro:
      "Staines-upon-Thames sits close to Heathrow with a strong corporate presence of its own, and it offers riverside surroundings that airport-adjacent towns generally do not.",
    stock:
      "Modern apartments near the river and the station, plus family houses in the surrounding streets. Parking is usual, and valued by this guest mix.",
    guests:
      "Corporate travellers working locally, Heathrow passengers and crew, and leisure visitors using it as a base for Windsor and Thorpe Park. Long weekday stays dominate.",
  },
  {
    slug: "beaconsfield",
    name: "Beaconsfield",
    group: "Hertfordshire, Surrey & Buckinghamshire",
    intro:
      "Beaconsfield is affluent, well connected to London by rail and the M40, and short on hotel provision. That shortage is exactly what makes a well-presented short let perform here.",
    stock:
      "Period properties in the Old Town and substantial detached houses in the New Town, most with gardens and parking. Presentation expectations are high.",
    guests:
      "Business travellers, film industry visitors working at nearby studios, and families visiting locally. Stays are longer and guests expect a standard closer to Chelsea than to the Home Counties average.",
  },
];

export const AREA_BY_SLUG = new Map(AREA_PAGES.map((a) => [a.slug, a]));

/** Other areas in the same group, for internal linking. */
export function nearbyAreas(area: Area, count = 4): Area[] {
  const sameGroup = AREA_PAGES.filter(
    (a) => a.group === area.group && a.slug !== area.slug,
  );
  const others = AREA_PAGES.filter(
    (a) => a.group !== area.group && a.slug !== area.slug,
  );
  return [...sameGroup, ...others].slice(0, count);
}

/**
 * The areas worth linking from the footer — highest search demand, so they
 * appear on every page rather than only on /locations.
 */
export const FOOTER_AREAS = [
  "kensington",
  "chelsea",
  "notting-hill",
  "chiswick",
  "ealing",
  "canary-wharf",
  "windsor",
  "reading",
].map((slug) => AREA_BY_SLUG.get(slug)!);
