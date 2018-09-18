import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  characterId: {
    type: Number,
    required: true
  },
  characterName: {
    type: String,
    required: true
  },
  corporation: {
    type: Number,
    required: true
  },
  alliance: {
    type: Number,
    required: true
  }
});

export default mongoose.model("user", userSchema);
