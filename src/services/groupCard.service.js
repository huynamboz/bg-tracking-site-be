const httpStatus = require('http-status');
const { GroupCard } = require('../models');
const ApiError = require('../utils/ApiError');

const createGroupCard = async (groupBody) => {
  return GroupCard.create(groupBody);
};


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGroupCard = async (filter, options) => {
  const groupCard = await GroupCard.paginate(filter, options);
  return groupCard;
};

const updatePositions = async (cards) => {
  const bulkOps = cards.map((card, index) => ({
    updateOne: {
      filter: { _id: card._id },
      update: { $set: { position: card.position } }, // Gán vị trí mới theo thứ tự
    }
  }));

  await GroupCard.bulkWrite(bulkOps);
};

const getGroupCardsByBoard = async (boardId) => {
  const groups = await GroupCard.find({ board: boardId }).sort({ position: -1 });
  return groups;
}

const getGroupCardById = async (id) => {
  return GroupCard.findById(id);
}


module.exports = {
  queryGroupCard,
  createGroupCard,
  updatePositions,
  getGroupCardsByBoard,
  getGroupCardById
};
