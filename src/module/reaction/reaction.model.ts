import { model, Schema } from 'mongoose';
import { TReaction } from './reaction.interface';
import { reactionoptiopns } from './reaction.const';

const reactionSchema = new Schema<TReaction>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    reaction: {
      type: String,
      enum: reactionoptiopns,
      required: [true, 'react option is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const Reaction = model<TReaction>('Reaction', reactionSchema);
