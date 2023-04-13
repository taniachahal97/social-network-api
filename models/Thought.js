const { Schema, Types, model } = require('mongoose');
const moment = require('moment');

//Schema for reaction
const reactionSchema = new Schema({
  reactionId: { type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
     required: true },
  reactionBody: { type: String, required: true, maxlength: 280 },
  username: {type: String, required: true},
  createdAt: {type: Date, default: Date.now,  get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')}
},
{
  toJSON: {
      getters: true
  }
});

// Schema for what makes up a comment
const thoughtSchema = new Schema({
  thoughtText: { type: String, required: true, minlength: 1, maxlength: 280},
  createdAt: {type: Date, default: Date.now, get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')},
  username: { type: String, required: true},
  reactions: [reactionSchema],
},

  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false,
  }
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Initialize the Comment model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
