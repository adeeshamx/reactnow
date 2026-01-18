import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
  },
  {
    timestamps: true,
  }
);

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
