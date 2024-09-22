const routes = require('express').Router();
const lesson1Controller = require('../controllers/lesson1');

routes.get('/', lesson1Controller.mainRoute);
routes.get('/2', lesson1Controller.secondaryRoute);

module.exports = routes;