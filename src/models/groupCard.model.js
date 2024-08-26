const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const groupCardSchema = mongoose.Schema(
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
    board: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Board',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
groupCardSchema.plugin(toJSON);
groupCardSchema.plugin(paginate);

/**
 * @typedef GroupCard
 */
const GroupCard = mongoose.model('GroupCard', groupCardSchema);

module.exports = GroupCard;
