import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const likeSchema = mongoose.Schema(
    {
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        tweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet',
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    },
    { timestamps: true }
);

const Like = mongoose.model('Like', likeSchema);

likeSchema.plugin(mongooseAggregatePaginate);

export default Like;
