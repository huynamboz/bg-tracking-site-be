const httpStatus = require('http-status');
const { Card, Label } = require('../models');
const ApiError = require('../utils/ApiError');

const createCard = async (cardBody) => {
  return Card.create(cardBody);
};

const queryCards = async (filter, options) => {
  const cards = await Card.paginate(filter, options);
  return cards;
};

// get all cards by group sorted by position desc
const getCardsByGroup = async (group_id) => {
  const cards = await Card.find({ group: group_id }).sort({ position: -1 });
  return cards;
};

const getCardById = async (id) => {
  return Card.findById(id);
}

const deleteCard = async (cardId) => {
  const card = await getCardById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  await card.remove();
  return card;
};

const updateCard = async (cardId, updateBody) => {
  const card = await getCardById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  Object.assign(card, updateBody);
  await card.save();
  return card;
};

const updatePositions = async (cards) => {
  const bulkOps = cards.map((card, index) => ({
    updateOne: {
      filter: { _id: card._id },
      update: { $set: { position: card.position } }, // Gán vị trí mới theo thứ tự
    }
  }));

  await Card.bulkWrite(bulkOps);
};

const addLabel = async (cardId, cardBody) => {
  const card = await getCardById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  cardBody.card = cardId;
  const label = await Label.create(cardBody);
  
  return label;
};

const getLabelsByCard = async (cardId) => {
  const labels = await Label.find({ card: cardId });
  return labels;
}

const removeLabel = async (labelId) => {
  const label = await Label.findById(labelId);
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  await label.remove();
  return label;
}

module.exports = {
  createCard,
  queryCards,
  getCardsByGroup,
  getCardById,
  updateCard,
  updatePositions,
  addLabel,
  getLabelsByCard,
  removeLabel,
  deleteCard,
};
