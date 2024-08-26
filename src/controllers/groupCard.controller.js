const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { groupCardService } = require('../services');

const createGroupCard = catchAsync(async (req, res) => {
  const group = await groupCardService.createGroupCard(req.body, req.params.boardId);
  res.status(httpStatus.CREATED).send(group);
});


const getGroupCards = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'role']);
  filter = { ...filter, board: req.params.boardId };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await groupCardService.queryGroupCard(filter, options);
  res.send(result);
});

module.exports = {
  getGroupCards,
  createGroupCard
};
