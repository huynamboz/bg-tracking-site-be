const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const labelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
labelSchema.plugin(toJSON);
labelSchema.plugin(paginate);

/**
 * @typedef board
 */
const board = mongoose.model('Label', labelSchema);

module.exports = board;
