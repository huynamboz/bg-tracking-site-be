const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cardService } = require('../services');

const createCard = catchAsync(async (req, res) => {
  const cardBody = {
    ...req.body,
    group: req.params.groupId,
  }

  const cards = await cardService.getCardsByGroup(req.params.groupId);

  if (cards.length > 0) {
    // find max position
    const maxPosition = Math.max(...cards.map(card => card.position));
    cardBody.position = maxPosition + 1;
  } else {
    cardBody.position = 1;
  }

  const board = await cardService.createCard(cardBody);
  res.status(httpStatus.CREATED).send(board);
});

// get all cards by group sorted by position desc
const getCards = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name']);
  filter = { ...filter, group: req.params.groupId };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  options.sortBy = '-position'; // Sắp xếp theo vị trí giảm dần

  // Xử lý nếu một item không có position
  const cards = await cardService.queryCards(filter, options);

  // Truy vấn các labels liên quan đến từng card
  const results = await Promise.all(cards.results.map(async card => {
    const labels = await cardService.getLabelsByCard(card._id);
    return {
      ...card.toJSON(),
      position: card.toJSON().position ? card.toJSON().position : 0,
      labels
    };
  }));

  res.send({
    ...cards,
    results,
  });
});

const changeCardPosition = catchAsync(async (req, res) => {
  const { cardId, groupId } = req.params;
  const { previousCardId, newGroupId } = req.body;

  const card = await cardService.getCardById(cardId);

  const cardPrevious = await cardService.getCardById(previousCardId);

  if (!card) {

    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');

  }

  const cards = await cardService.getCardsByGroup(newGroupId);

  card.group = newGroupId;

 
    if (cards.length > 0) {
      if (!cardPrevious) {
        card.position = 0;
        const cardsUpdate = cards.map(card => ({
          _id: card._doc._id,
          position: card.position + 1,
        }));
  
        await cardService.updatePositions(cardsUpdate);
  
        await card.save();
      } else {
        // find all card in cards have position > cardPrevious.position and increase 1
        const cardsIncrease = cards.filter(card => card.position > cardPrevious.position);
        const cardsUpdate = cardsIncrease.map(card => ({
          _id: card._doc._id,
          position: card.position + 1,
        }));

        await cardService.updatePositions(cardsUpdate);
        card.position = cardPrevious.position + 1;

        await card.save();
      }
    } else {
    card.position = 1;

    await card.save();
  }

  res.send(card);
});

const addLabel = catchAsync(async (req, res) => {
  const { cardId } = req.params;
  const cardBody = req.body;
  const label = await cardService.addLabel(cardId, cardBody);
  res.send(label);
});

const removeLabel = catchAsync(async (req, res) => {
  const { labelId } = req.params;
  const label = await cardService.removeLabel(labelId);
  res.send(label);
});

const updateCard = catchAsync(async (req, res) => {
  const { cardId } = req.params;
  const card = await cardService.updateCard(cardId, req.body);
  res.send(card);
});


module.exports = {
  getCards,
  createCard,
  changeCardPosition,
  addLabel,
  removeLabel,
  updateCard,
};
