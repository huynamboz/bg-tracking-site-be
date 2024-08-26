const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const groupTaskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
groupTaskSchema.plugin(toJSON);
groupTaskSchema.plugin(paginate);

/**
 * @typedef GroupCard
 */
const GroupCard = mongoose.model('GroupCard', groupTaskSchema);

module.exports = GroupCard;
