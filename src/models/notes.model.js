import mongoose, { Schema, SchemaTypeOptions } from "mongoose";

const notesSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: trusted,
    },
    isDeleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
export const Notes = mongoose.model("Notes", notesSchema);
