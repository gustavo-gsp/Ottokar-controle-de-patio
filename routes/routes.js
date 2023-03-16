const routes = require('express').Router();
const CarController = require("../controller/CarController");

routes.get('/home', CarController.home );
routes.post('/login', CarController.login);
routes.post('/getByid/:id/:method', CarController.getById)
routes.get('/carPage', CarController.getAllCars);
routes.post('/createCar', CarController.createCar);
routes.post('/createUser', CarController.createUser);

module.exports = routes;