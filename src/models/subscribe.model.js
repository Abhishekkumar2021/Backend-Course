import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;