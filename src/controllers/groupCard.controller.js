const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { groupCardService } = require('../services');

const createGroupCard = catchAsync(async (req, res) => {

  const groupCardBody = {
    ...req.body,
    board: req.params.boardId,
  };
  const groups = await groupCardService.getGroupCardsByBoard(req.params.boardId);

  if (groups.length > 0) {
    const maxPosition = Math.max(...groups.map(card => card.position));
    groupCardBody.position = maxPosition + 1;
  } else {
    groupCardBody.position = 1;
  }
  const group = await groupCardService.createGroupCard(groupCardBody);
  res.status(httpStatus.CREATED).send(group);
});


const getGroupCards = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'role']);
  filter = { ...filter, board: req.params.boardId };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = '-position'; // Sắp xếp theo vị trí giảm dần

  const result = await groupCardService.queryGroupCard(filter, options);
  res.send(result);
});

const changeGroupCardPosition = catchAsync(async (req, res) => {
  const { groupId, boardId } = req.params;
  const { previousGroupId } = req.body;

  const group = await groupCardService.getGroupCardById(groupId);

  const groupPrevious = await groupCardService.getGroupCardById(previousGroupId);

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const groups = await groupCardService.getGroupCardsByBoard(boardId);

  if (groups.length > 0) {
    if (!groupPrevious) {
      group.position = 0;

      const groupsUpdate = groups.map(group => ({
        _id: group._doc._id,
        position: group.position ? group.position + 1 : 1,
      }));

      await groupCardService.updatePositions(groupsUpdate);
  
      await group.save();
    } else {
       // find all card in cards have position > cardPrevious.position and increase 1
       const cardsIncrease = groups.filter(group => group.position > groupPrevious.position);
       const cardsUpdate = cardsIncrease.map(group => ({
         _id: group._doc._id,
         position: group.position + 1,
       }));

       await groupCardService.updatePositions(cardsUpdate);
       group.position = groupPrevious.position + 1;

       await group.save();
    }
  } else {
    group.position = 1;

    await group.save();
  }

  res.send(group);
})

module.exports = {
  getGroupCards,
  createGroupCard,
  changeGroupCardPosition
};
