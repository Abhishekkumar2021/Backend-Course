import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const playlistSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxLength: [500, 'Description can not be more than 500 characters'],
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const Playlist = mongoose.model('Playlist', playlistSchema);

playlistSchema.plugin(mongooseAggregatePaginate);

export default Playlist;
