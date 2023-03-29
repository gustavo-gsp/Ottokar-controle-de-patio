const Car = require('../models/Car');
const User = require('../models/User');
const Bcrypt = require('bcrypt');
const moment = require('moment');

let message = "";
let userName = "";
let userFunc = "";
let status = "";
let details = false;
let conclude = false;
let addCar = false;
let dateToday = moment().format("DD/MM/YYYY");
let date1 = moment().add(1, 'days').format("DD/MM/YYYY");
let date2 = moment().add(2, 'days').format("DD/MM/YYYY");
let date3 = moment().add(3, 'days').format("DD/MM/YYYY");
let date4 = moment().add(4, 'days').format("DD/MM/YYYY");

const home = (req, res) =>{
    message = "";
    return res.render('login',{message});
}

const login = async (req, res) => {
    const log = req.body;
    const name = log.user;
    User.findOne({user: name}).then(user => {
        if(user != undefined){
            let correct = Bcrypt.compareSync(log.password, user.password);
            if(correct){
                userName = name; 
                userFunc = user.func;
                res.redirect('/carPage/hoje/a')
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
            res.render("index", 
            {
                conclude: true, car, status, carList, userName, userFunc,
                details: false, addCar, date1, date2, date3,date4,
            });
        }else if(req.params.method == "details"){
            res.render('index', {
                userName, userFunc,status, car, carList,conclude:false, 
                addCar, date1, date2, date3, date4,
                details: true,
                model: car.carName, 
                plate: car.plate,
                complaint: car.complaint,
                forecast: car.forecast,
                date: car.date,
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

        if(userName){
            const carListAll = await Car.find();
            const today = `/^${dateToday.substring(0,2)}/`
            const carList = await Car.find({date: `${today}`});
            console.log(today);
            // if(req.params.day == "hoje"){
            //     carList = await Car.find({date: dateToday})
            // }
            if(req.params.show == 'addCar'){
                details = false;
                addCar = true;
                return res.render('index', {
                carList, userName, userFunc, status,
                details, conclude, addCar,
                date1, date2, date3, date4,
            });
        }else{
            if(req.params.show == 'logout'){
                userName = "";
                res.redirect('/home');
            }else{

                return res.render('index',
                {
                    carList, userName, status, details, conclude,
                    addCar: false, date1, date2, date3, date4,
                    userFunc,
                });
            }
        }
    }else{
        return res.redirect('/home');
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
        return res.redirect('/carPage/hoje/a');
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
            forecast: moment(car.date).format("DD/MM/YYYY HH:mm"),
            date:  moment(car.forecast).format("DD/MM/YYYY HH:mm"),
            complaint: car.complaint,
            services: car.services,
            parts: car.parts,
            responsible: car.userName,
            specialty: car.specialty,
            historic: `Agendado - (${userName} | ${moment().format("DD/MM/YYYY HH:mm")})`,
        });
        addCar = false;
        return res.redirect('/carPage/hoje/a');
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
        res.redirect('/carPage/hoje/a')
        }else if(status == "Aguardando"){
            stages = 'Analisando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');
        }else if(status == "Analisando"){
            stages = 'Aprovando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');
        }else if(status == "Aprovando"){
            stages = 'Comprando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');    
        }else if(status == "Comprando"){
            stages = 'Reparando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');    
        }else if(status == "Reparando"){
            stages = 'Testando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');    
        }else if(status == "Testando"){
            stages = 'Vistoriando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');    
        }else if(status == "Vistoriando"){
            stages = 'Entregando';
            await Car.updateOne({_id: req.params.id}, {$set: {stage: stages}});
        res.redirect('/carPage/hoje/a');    
        }else if(status == "Entregando"){
            stages = '';
            await Car.deleteOne({_id: req.params.id})
        res.redirect('/carPage/hoje/a');    
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
