const Car = require('../models/Car');
const User = require('../models/User');
const Bcrypt = require('bcrypt');
const moment = require('moment');

let message = "";
let userName = "";
let status = "";
let details = false;
let conclude = false;
let addCar = false;
const home = (req, res) =>{
    message = "";
    return res.render('login',{message});
}

const login = async (req, res) => {
    const log = req.body;
    userName = log.user; 
    User.findOne({user: userName}).then(user => {
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
        status = req.params.stage;
        const car = await Car.findOne({ _id: req.params.id });
        if(req.params.method == "conclude"){
            res.render("index", {conclude: true, car, status, carList, userName, details: false, addCar});
        }else{
            res.render('index', {
                userName, status, car, carList,conclude:false, addCar,
                details: true,
                model: car.carName, 
                plate: car.plate,
                complaint: car.complaint,
                forecast: car.forecast,
                stage: car.stage,
                services: car.services,
                parts: car.parts,
                historic: car.historic,
            });
        }
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

const getAllCars = async (req, res) => {
    try{
        const carList = await Car.find();
        if(req.params.show == 'addCar'){
            details = false;
            addCar = true;
            return res.render('index', {carList, userName, status, details, conclude, addCar});
        }else{
            return res.render('index', {carList, userName, status, details, conclude, addCar: false});
        }
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
            plate: car.plate.toUpperCase(),
            forecast: car.forecast.substring(0,17),
            complaint: car.complaint,
            services: car.services,
            parts: car.parts,
            responsible: car.userName,
            specialty: car.specialty,
            historic: `Agendado - (${userName} | ${moment().format("DD/MM/YYYY hh:mm")})`,
        });
        addCar = false;
        return res.redirect('/carPage/a');
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

const concludeCar = async (req, res) =>{
    try{
        
        status = req.params.stage;
        let stages = "";
        const carList = await Car.find();
        if(status == "Agendado"){
            stages = 'Aguardando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage')
        }else if(status == "Aguardando"){
            stages = 'Analisando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');
        }else if(status == "Analisando"){
            stages = 'Aprovando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');
        }else if(status == "Aprovando"){
            stages = 'Comprando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');    
        }else if(status == "Comprando"){
            stages = 'Reparando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');    
        }else if(status == "Reparando"){
            stages = 'Testando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');    
        }else if(status == "Testando"){
            stages = 'Vistoriando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');    
        }else if(status == "Vistoriando"){
            stages = 'Entregando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage');    
        }else if(status == "Entregando"){
            stages = '';
            await Car.deleteOne({_id: req.params.id})
        res.redirect('/carPage/a');    
        }
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
    concludeCar,
} 
