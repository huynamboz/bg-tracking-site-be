const httpStatus = require('http-status');
const { Board } = require('../models');
const ApiError = require('../utils/ApiError');

const createBoard = async (boardBody, user_id) => {
  return Board.create({
    ...boardBody,
    user: user_id
  });
};

const queryBoards = async (filter, options, user_id) => {
  // const boards = await Board.paginate(filter, options);
  
  // find all boards by user
  const boards = await Board.paginate(filter, options);
  return boards;
};

module.exports = {
  createBoard,
  queryBoards
};
