const routes = require('express').Router();
const CarController = require("../controller/CarController");

routes.get('/home', CarController.getAllCars);
routes.post('/create', CarController.createCar);



module.exports = routes;