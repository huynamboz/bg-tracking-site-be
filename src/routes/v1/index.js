const express = require('express');
const authRoute = require('./auth.route');
const boardRoute = require('./board.route');
const userRoute = require('./user.route');
const groupCardRoute = require('./groupCard.route');
const cardRoute = require('./card.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/boards',
    route: boardRoute,
  },
  {
    path: '/boards', // like /boards/:boardId/group-cards
    route: groupCardRoute,
  },
  {
    path: '/boards/group-cards', // like /boards/group-cards/:groupCardId/cards
    route: cardRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
