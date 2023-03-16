const Car = require('../models/Car');
const User = require('../models/User');
const Bcrypt = require('bcrypt');
let message = "";
let userName = "";


const home = (req, res) =>{
    message = "";
    return res.render('login',{message});
}

const login = async (req, res) => {
    const log = req.body;
    User.findOne({user: userName}).then(user => {
        userName = log.user; 
        if(user != undefined){
            let correct = Bcrypt.compareSync(log.password, user.password);
            if(correct){
                res.redirect('/carPage')
            }else{
                message = 'Usúario ou senha inválidos!';
                res.render('login', {message});
            }
        }else{
            message = 'Usúario ou senha inválidos!';
            res.render('login', {message});
        }    
    });

}
const getById = async (req, res) => {
    try{
        const carList = await Car.find();
        
    }catch (err) {
        res.status(500).send({error: err.message})
    }

}

const getAllCars = async (req, res) => {
    try{
        const carList = await Car.find();
        return res.render('index', {carList, userName});
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

const createUser = async (req, res) => {
    const log = req.body;
    log.password = await Bcrypt.hash(log.password, 8);
    try{
        await User.create({
            user: log.user,
            password: log.password,
            func: log.func,
        })
        return res.redirect('/carPage');
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
    home,
    getAllCars,  
    createCar,
    login,
    createUser,
    getById,
} 
