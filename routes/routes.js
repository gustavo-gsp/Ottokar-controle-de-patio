const routes = require('express').Router();
const CarController = require("../controller/CarController");

routes.get('/', CarController.home );
routes.post('/login', CarController.login);
routes.get('/getByid/:id/:method/:stage',CarController.authent, CarController.getById);
routes.get('/carPage/:day/:show',CarController.authent, CarController.getAllCars);
routes.post('/createCar', CarController.createCar);
routes.post('/createUser', CarController.createUser);
routes.get('/updateUser/:id/:method', CarController.authent, CarController.updateUser);
routes.post('/parts/:id', CarController.orderParts);
routes.get('/conclude/:id/:stage',CarController.authent, CarController.concludeCar);
routes.post('/priority/:id/:resp',CarController.updatePriority);

module.exports = routes;