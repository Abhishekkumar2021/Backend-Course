import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
        maxLength: [100, "Title can not be more than 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        maxLength: [500, "Description can not be more than 500 characters"]
    },
    thumbnail: {
        type: String, // cloudinary image url
        required: [true, "Please provide a thumbnail"]
    },
    videoUrl: {
        type: String, // cloudinary video url
        required: [true, "Please provide a video url"]
    },
    duration: {
        type: Number, // will get from cloudinary
        required: [true, "Please provide a duration"]
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    isPublished: {
        type: Boolean,
        default: true
    },
}, {timestamps: true});

const Video = mongoose.model("Video", videoSchema);

videoSchema.plugin(mongooseAggregatePaginate);

export default Video;