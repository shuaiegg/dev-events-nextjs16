import mongoose, { Schema, Document, Model, Types } from "mongoose";
import Event from "./event.model";

// Strongly-typed Booking interface
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid email`,
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook: ensure referenced Event exists
BookingSchema.pre<IBooking>("save", async function (next: (err?: Error) => void) {
  // Only check when eventId is new/modified
  if (this.isModified("eventId") || this.isNew) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) return next(new Error("Referenced Event not found"));
  }
  next();
});

// Export model (avoid recompilation issues in dev)
const Booking: Model<IBooking> = (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
