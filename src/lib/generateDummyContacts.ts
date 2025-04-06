import { Contact, Tag, TimeStampedEntry } from "@/types/Contact";
import { v4 as uuidv4 } from "uuid";

// German company name prefixes and suffixes
const companyPrefixes = [
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Hoffmann",
  "Schulz",
  "Koch",
  "Richter",
  "Bauer",
  "Klein",
  "Wolf",
  "Schröder",
  "Neumann",
  "Schwarz",
  "Zimmermann",
  "Braun",
];

const companySuffixes = [
  "GmbH",
  "AG",
  "KG",
  "OHG",
  "GbR",
  "e.K.",
  "UG",
  "GmbH & Co. KG",
  "Holding",
  "Group",
  "Solutions",
  "Systems",
  "Consulting",
  "Services",
  "Logistik",
  "Technik",
  "Bau",
  "Immobilien",
  "Versicherung",
  "Medien",
];

// German first names
const firstNames = [
  "Alexander",
  "Andreas",
  "Bernd",
  "Christian",
  "Daniel",
  "David",
  "Dennis",
  "Erik",
  "Florian",
  "Frank",
  "Hans",
  "Jan",
  "Jens",
  "Johannes",
  "Klaus",
  "Lars",
  "Lukas",
  "Martin",
  "Michael",
  "Nico",
  "Peter",
  "Robert",
  "Stefan",
  "Thomas",
  "Uwe",
  "Wolfgang",
  "Anna",
  "Birgit",
  "Claudia",
  "Daniela",
  "Elena",
  "Franziska",
  "Gabi",
  "Hannah",
  "Ines",
  "Julia",
  "Katharina",
  "Laura",
  "Maria",
  "Nadine",
  "Petra",
  "Sabine",
  "Tanja",
  "Ulrike",
  "Vanessa",
];

// German last names
const lastNames = [
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Hoffmann",
  "Schulz",
  "Koch",
  "Richter",
  "Bauer",
  "Klein",
  "Wolf",
  "Schröder",
  "Neumann",
  "Schwarz",
  "Zimmermann",
  "Braun",
  "Krüger",
  "Hofmann",
  "Hartmann",
  "Lange",
  "Schmitt",
  "Werner",
  "Schmitz",
  "Krause",
  "Meier",
  "Lehmann",
  "Schmid",
  "Schulze",
  "Maier",
  "Köhler",
  "Herrmann",
  "König",
  "Walter",
  "Mayer",
  "Huber",
  "Kaiser",
];

// German salutations
const salutations = ["Herr", "Frau"];

// Sample notes
const notes = [
  "Langjähriger Kunde",
  "Neuer Kontakt aus Messe",
  "Interessent für Produkt A",
  "Rückruf vereinbart",
  "Angebot zugesandt",
  "Vertrag in Vorbereitung",
  "Beschwerde bearbeiten",
  "VIP-Kunde",
  "Zahlungserinnerung senden",
  "Termin vereinbart",
];

// Sample conversation entries
const conversationEntries = [
  "Erstkontakt auf der Fachmesse. Interesse an Produktkategorie A.",
  "Gespräch über neue Produktlinie. Interesse an Erweiterung.",
  "Nachfrage zu Preisen und Lieferzeiten. Angebot zugesandt.",
  "Technisches Briefing zu Anforderungen. Wünscht detaillierte Spezifikation.",
  "Follow-up zu technischen Fragen. Spezifikation zugesandt.",
  "Feedback zur Spezifikation. Einige Anpassungen notwendig.",
  "Vertragsdetails besprochen. Entwurf wird vorbereitet.",
  "Beschwerde über Lieferverzögerung. Kulanzlösung angeboten.",
  "Beratungsgespräch zu neuen Anforderungen. Zusätzliches Angebot folgt.",
  "Zahlungserinnerung besprochen. Zahlung wird veranlasst.",
];

// Generate a random phone number in German format
const generatePhoneNumber = (): string => {
  const areaCode = Math.floor(Math.random() * 900) + 100; // 3-digit area code
  const firstPart = Math.floor(Math.random() * 9000) + 1000; // 4-digit
  const secondPart = Math.floor(Math.random() * 90000) + 10000; // 5-digit
  return `+49 ${areaCode} ${firstPart}${Math.random() > 0.5 ? secondPart.toString().substring(0, 3) : secondPart}`;
};

// Generate a random email based on name and company
const generateEmail = (
  firstName: string,
  lastName: string,
  companyName: string,
): string => {
  const domains = [
    "beispiel.de",
    "firma.de",
    "mail.de",
    "web.de",
    "gmx.de",
    "t-online.de",
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  // Remove spaces and special characters from company name
  const companySlug = companyName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  const emailFormats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase().charAt(0)}.${lastName.toLowerCase()}@${domain}`,
    `${lastName.toLowerCase()}.${firstName.toLowerCase().charAt(0)}@${domain}`,
    `${firstName.toLowerCase()}@${companySlug}.de`,
    `${lastName.toLowerCase()}@${companySlug}.de`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companySlug}.de`,
  ];

  return emailFormats[Math.floor(Math.random() * emailFormats.length)];
};

// Generate random timestamps for the last 2 years
const generateRandomDate = (yearsBack = 2): Date => {
  const now = new Date();
  const twoYearsAgo = new Date(
    now.getFullYear() - yearsBack,
    now.getMonth(),
    now.getDate(),
  );
  const timeDiff = now.getTime() - twoYearsAgo.getTime();
  const randomTime = Math.random() * timeDiff;
  return new Date(twoYearsAgo.getTime() + randomTime);
};

// Generate a random number of conversation entries
const generateConversationEntries = (maxEntries = 3): TimeStampedEntry[] => {
  const numEntries = Math.floor(Math.random() * maxEntries) + 1;
  const entries: TimeStampedEntry[] = [];

  for (let i = 0; i < numEntries; i++) {
    entries.push({
      timestamp: generateRandomDate(),
      text: conversationEntries[
        Math.floor(Math.random() * conversationEntries.length)
      ],
    });
  }

  // Sort by timestamp, oldest first
  return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Generate random tags from available tags
export const generateRandomTags = (
  availableTags: Tag[],
  maxTags = 2,
): Tag[] => {
  const numTags = Math.floor(Math.random() * maxTags) + 1;
  const shuffledTags = [...availableTags].sort(() => 0.5 - Math.random());
  return shuffledTags.slice(0, numTags);
};

// Generate a single random contact
export const generateRandomContact = (availableTags: Tag[]): Contact => {
  const isFemale = Math.random() > 0.5;
  const salutation = isFemale ? salutations[1] : salutations[0];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  const companyPrefix =
    companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
  const companySuffix =
    companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
  const companyName = `${companyPrefix} ${companySuffix}`;

  const createdAt = generateRandomDate();
  const updatedAt = new Date(
    createdAt.getTime() +
      Math.random() * (new Date().getTime() - createdAt.getTime()),
  );

  return {
    id: uuidv4(),
    company_name: companyName,
    salutation,
    first_name: firstName,
    last_name: lastName,
    phone: generatePhoneNumber(),
    email: generateEmail(firstName, lastName, companyName),
    notes: notes[Math.floor(Math.random() * notes.length)],
    gespraechszusammenfassung: generateConversationEntries(),
    tags: generateRandomTags(availableTags),
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

// Generate multiple random contacts
export const generateRandomContacts = (
  count: number,
  availableTags: Tag[],
): Contact[] => {
  const contacts: Contact[] = [];
  for (let i = 0; i < count; i++) {
    contacts.push(generateRandomContact(availableTags));
  }
  return contacts;
};
