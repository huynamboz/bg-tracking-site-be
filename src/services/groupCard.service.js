const httpStatus = require('http-status');
const { GroupCard } = require('../models');
const ApiError = require('../utils/ApiError');

const createGroupCard = async (groupBody, boardId) => {
  return GroupCard.create({
    ...groupBody,
    board: boardId
  });
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

module.exports = {
  queryGroupCard,
  createGroupCard
};
