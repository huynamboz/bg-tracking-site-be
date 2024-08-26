const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { groupCardService } = require('../services');

const createGroupCard = catchAsync(async (req, res) => {
  const group = await groupCardService.createGroupCard(req.body);
  res.status(httpStatus.CREATED).send(group);
});


const getGroupCards = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await groupCardService.queryGroupCard(filter, options);
  res.send(result);
});

module.exports = {
  getGroupCards,
  createGroupCard
};
