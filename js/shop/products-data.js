/**
 * POWERZONE : GYM & SPORTS STORE
 * Official Sports Gear, Cricket, Football & Gym Equipment Catalog Data
 */

const POWERZONE_PRODUCTS = [
  {
    id: 'pz-1',
    name: 'Pro Turf Studs / Football Shoes (Multi-Ground)',
    category: 'football',
    price: 2499,
    oldPrice: 3200,
    rating: 4.9,
    reviews: 164,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80',
    desc: 'High-traction TPU molded studs for artificial turf & grass grounds. Reinforced heel counter and breathable mesh upper for explosive speed.'
  },
  {
    id: 'pz-2',
    name: 'Grade 1 Kashmir Willow Cricket Bat (Full Size)',
    category: 'cricket',
    price: 2899,
    oldPrice: 3800,
    rating: 5.0,
    reviews: 198,
    badge: 'Pro Choice',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
    desc: 'Handcrafted premium Kashmir Willow with 38-40mm massive edges, thick sweet spot, cane handle with chevron rubber grip for powerful boundary hitting.'
  },
  {
    id: 'pz-3',
    name: 'Custom Tournament Brass/Gold Trophy Set',
    category: 'trophies',
    price: 3999,
    oldPrice: 4999,
    rating: 4.9,
    reviews: 82,
    badge: 'Club Special',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    desc: 'Customizable championship gold cup trophy (18-inch) + 20 tournament brass medals with ribbon neckbands for local sports tournaments & leagues.'
  },
  {
    id: 'pz-4',
    name: '10mm Heavy Duty Leather Powerlifting Lever Belt',
    category: 'gym',
    price: 2199,
    oldPrice: 2899,
    rating: 4.9,
    reviews: 210,
    badge: 'IPF Spec',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&auto=format&fit=crop&q=80',
    desc: 'Top-grain 10mm non-slip suede leather with zinc-alloy chrome quick-release lever. Uncompromising intra-abdominal support for heavy squats & deadlifts.'
  },
  {
    id: 'pz-5',
    name: 'Pro Carbon Graphite Badminton Rackets Set (Pack of 2)',
    category: 'badminton',
    price: 1899,
    oldPrice: 2499,
    rating: 4.8,
    reviews: 145,
    badge: 'High Tension',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
    desc: 'Isometric high-modulus graphite frame pre-strung at 28 lbs tension with full padded carry bag and 3 nylon shuttles included.'
  },
  {
    id: 'pz-6',
    name: 'Latex Resistance Bands Set (Set of 5 Levels)',
    category: 'accessories',
    price: 799,
    oldPrice: 1199,
    rating: 4.9,
    reviews: 320,
    badge: 'Essential',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80',
    desc: '100% natural Malaysian latex bands (Extra Light to Extra Heavy) with door anchor, workout guide booklet, and compact travel pouch.'
  },
  {
    id: 'pz-7',
    name: 'Commercial Hex Dumbbells (15kg pair)',
    category: 'gym',
    price: 3499,
    oldPrice: 4400,
    rating: 4.9,
    reviews: 115,
    badge: 'Heavy Iron',
    image: 'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=600&auto=format&fit=crop&q=80',
    desc: 'Solid cast iron core encased in heavy-duty anti-crack rubber with knurled ergonomic chrome grip. Zero floor damage and minimal bounce.'
  },
  {
    id: 'pz-8',
    name: 'Match Quality Synthetic Volleyball & Net Kit',
    category: 'football',
    price: 1299,
    oldPrice: 1799,
    rating: 4.8,
    reviews: 94,
    badge: 'Official Size',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=80',
    desc: 'Soft-touch PU composite leather 18-panel volleyball with official size braided nylon net and inflating hand pump with needle.'
  },
  {
    id: 'pz-9',
    name: 'Club Match Leather Cricket Balls (Pack of 2)',
    category: 'cricket',
    price: 699,
    oldPrice: 999,
    rating: 4.8,
    reviews: 112,
    badge: 'Match Grade',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
    desc: 'Four-piece alum tanned top grain leather balls with hand-stitched seam for genuine swing and seam retention on Shirdi turf pitches.'
  },
  {
    id: 'pz-10',
    name: 'Premium Athlete Medal Set (Pack of 5)',
    category: 'trophies',
    price: 849,
    oldPrice: 1200,
    rating: 4.9,
    reviews: 76,
    badge: 'Tournament Set',
    image: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=600&auto=format&fit=crop&q=80',
    desc: 'Heavy cast alloy 70mm gold/silver/bronze medallions with patriotic tricolor ribbon straps and customizable event backings.'
  },
  {
    id: 'pz-11',
    name: 'Professional Fast-Dry Liquid Chalk Bottle (250ml)',
    category: 'gym',
    price: 349,
    oldPrice: 499,
    rating: 4.9,
    reviews: 204,
    badge: 'Grip Tech',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    desc: 'Mess-free magnesium carbonate liquid grip formula. Dries in seconds, eliminates sweat slip on heavy deadlifts, pull-ups, and Olympic bars.'
  },
  {
    id: 'pz-12',
    name: 'PowerZone Shaker Bottle 700ml (Leak Proof)',
    category: 'accessories',
    price: 299,
    oldPrice: 499,
    rating: 4.8,
    reviews: 310,
    badge: 'BPA Free',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80',
    desc: 'Durable leak-proof 700ml shaker with internal blender wire whisk ball, embossed milliliter markings, and ergonomic carry loop.'
  },
  {
    id: 'pz-13',
    name: 'Tournament Duck Feather Shuttlecocks (Pack of 12)',
    category: 'badminton',
    price: 649,
    oldPrice: 899,
    rating: 4.8,
    reviews: 128,
    badge: 'Speed 77',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
    desc: 'Selected natural duck feather shuttles with solid composite cork base for consistent flight stability and crisp smashes.'
  },
  {
    id: 'pz-bndl-1',
    name: '6-Month Elite Gym Pass + 10mm Lever Belt + Shaker Combo',
    category: 'gym',
    price: 8499,
    oldPrice: 11200,
    rating: 5.0,
    reviews: 64,
    badge: 'Member Combo',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&auto=format&fit=crop&q=80',
    desc: 'PowerZone Shirdi 6-Month Elite Gym Floor Pass bundled with an IPF-spec 10mm Leather Powerlifting Lever Belt (Custom Size) and 700ml Stainless Shaker Bottle.'
  },
  {
    id: 'pz-bndl-2',
    name: 'Shirdi Student Semester Gym & Turf Access Pass',
    category: 'gym',
    price: 3299,
    oldPrice: 4500,
    rating: 4.9,
    reviews: 82,
    badge: 'Student Perk',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    desc: '3-Month all-inclusive student gym and agility turf pass. Includes free locker, monthly fitness assessment, and student community access.'
  },
  {
    id: 'pz-bndl-3',
    name: 'PowerZone Black Card Annual Membership Tier & Kit',
    category: 'gym',
    price: 14999,
    oldPrice: 22000,
    rating: 5.0,
    reviews: 43,
    badge: 'VIP Annual',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    desc: '365 Days Unlimited Gym, Turf Conditioning, Unlimited Infrared Steam Sauna, 2 Guest Passes/Month, Official PowerZone Performance Tee, and 1-on-1 PT coaching starter.'
  },
  {
    id: 'pz-bndl-4',
    name: 'Pre-Season Turf Agility + Kashmir Willow Cricket Bundle',
    category: 'cricket',
    price: 5499,
    oldPrice: 7800,
    rating: 4.9,
    reviews: 38,
    badge: 'Cricket Bundle',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
    desc: '3-Month Velocity 30 Turf Speed & Conditioning Camp combined with a Grade 1 Full Size Kashmir Willow Cricket Bat and 2 Leather Match Balls.'
  },
  {
    id: 'pz-bndl-5',
    name: '3-Month Post-Work Mobility & Infrared Steam Pass',
    category: 'accessories',
    price: 3999,
    oldPrice: 5500,
    rating: 4.9,
    reviews: 51,
    badge: 'Wellness Pass',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    desc: 'Quarterly all-inclusive access to Reset & Rebuild mobility sessions, thermal eucalyptus steam suite, and myofascial therapy stations.'
  }
];
