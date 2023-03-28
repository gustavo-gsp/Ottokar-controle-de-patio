const routes = require('express').Router();
const CarController = require("../controller/CarController");

routes.get('/home', CarController.home );
routes.post('/login', CarController.login);
routes.get('/getByid/:id/:method/:stage', CarController.getById);
routes.get('/carPage/:show', CarController.getAllCars);
routes.post('/createCar', CarController.createCar);
routes.post('/createUser', CarController.createUser);
routes.get('/conclude/:id/:stage', CarController.concludeCar);

module.exports = routes;