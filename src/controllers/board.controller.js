const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { boardService } = require('../services');

const createBoard = catchAsync(async (req, res) => {
  const board = await boardService.createBoard(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(board);
});

// get all boards by user
const getBoards = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name']);
  filter = { ...filter, user: req.user.id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await boardService.queryBoards(filter, options);
  res.send(result);
});

module.exports = {
  getBoards,
  createBoard
};
