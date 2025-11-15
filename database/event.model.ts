import mongoose, { Schema, Document, Model, Types, SchemaDefinition } from "mongoose";

// Strongly-typed Event interface
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string
  time: string; // normalized HH:MM (24h) string
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper: simple slugifier
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

// Helper: normalize time to HH:MM (24-hour) format.
function normalizeTime(time: string): string {
  const t = time.trim();
  // Match 24h HH:MM
  const hhmm24 = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  const ampm = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i;

  if (hhmm24.test(t)) {
    const m = t.match(hhmm24)!;
    const hh = m[1].padStart(2, "0");
    const mm = m[2];
    return `${hh}:${mm}`;
  }

  const ampmMatch = t.match(ampm);
  if (ampmMatch) {
    let hh = parseInt(ampmMatch[1], 10);
    const mm = ampmMatch[2];
    const part = ampmMatch[3].toLowerCase();
    if (part === "pm" && hh !== 12) hh += 12;
    if (part === "am" && hh === 12) hh = 0;
    return `${hh.toString().padStart(2, "0")}:${mm}`;
  }

  // Try Date parsing as a last resort
  const parsed = new Date(`1970-01-01T${t}`);
  if (!Number.isNaN(parsed.getTime())) {
    const hh = parsed.getHours().toString().padStart(2, "0");
    const mm = parsed.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  throw new Error(`Invalid time format: ${time}`);
}

const EventSchemaFields: SchemaDefinition = {
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  overview: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  venue: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  mode: { type: String, required: true, trim: true },
  audience: { type: String, required: true, trim: true },
  agenda: { type: [String], required: true },
  organizer: { type: String, required: true, trim: true },
  tags: { type: [String], required: true },
};

const EventSchema = new Schema(EventSchemaFields, {
  timestamps: true,
});

// Ensure unique index on slug
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook: generate slug from title (only if title changed),
// and normalize date/time fields.
EventSchema.pre<IEvent>("save", function (next: (err?: Error) => void) {
  // Validate required string fields are non-empty
  const requiredStrings: Array<keyof IEvent> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];
  for (const key of requiredStrings) {
    const val = (this as unknown as Record<string, unknown>)[key as string];
    if (typeof val !== "string" || (val as string).trim().length === 0) {
      return next(new Error(`${String(key)} is required and must be non-empty`));
    }
  }

  // Generate slug only when title modified or on new document
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Normalize date to ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
  try {
    const parsedDate = new Date(this.date);
    if (Number.isNaN(parsedDate.getTime())) {
      return next(new Error("Invalid date format; expected a parsable date string"));
    }
    this.date = parsedDate.toISOString();
  } catch (err) {
    return next(err as Error);
  }

  // Normalize time to HH:MM 24-hour
  try {
    this.time = normalizeTime(this.time);
  } catch (err) {
    return next(err as Error);
  }

  next();
});

// Use existing model if already compiled (avoids OverwriteModelError in dev)
const Event: Model<IEvent> = (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
export { EventSchema };
