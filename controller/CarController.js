const Car = require('../models/Car')

const getAllCars = async (req, res) => {
    try{
        const carList = await Car.find();
        return res.render('index', {carList});
    }catch (err) {
        res.status(500).send({error: err.message})
    }

}

const createCar = async (req, res) =>{
    const car = req.body;

    if(!car.carName){
        return res.redirect('/home');
    }

    try{
        await Car.create({
            carName: car.carName,
            plate: car.plate,
            forecast: car.forecast.substring(0,17),
            complaint: car.complaint,
            services: car.services,
            parts: car.parts,
        });
        return res.redirect('/home');
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

module.exports = {
  getAllCars,  
  createCar,
} 
