const Car = require('../models/Car');
const User = require('../models/User');
const Historic = require('../models/Historic');
const Bcrypt = require('bcrypt');
const moment = require('moment');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { trusted } = require('mongoose');

let carList = [];
let message = "";
let userName = "";
let userFunc = "";
let status = "";
let details = false;
let conclude = false;
let part = false;
let addCar = "addCar";
let history = false;
let dateToday = moment().format("DD/MM/YYYY");
let date1 = moment().add(1, 'days').format("DD/MM/YYYY");
let date2 = moment().add(2, 'days').format("DD/MM/YYYY");
let date3 = moment().add(3, 'days').format("DD/MM/YYYY");
let date4 = moment().add(4, 'days').format("DD/MM/YYYY");
const home = (req, res, next) =>{
    if(req.query.fail){
        return res.render('login',{message: 'Usúario ou senha inválidos'});
    }else{
        return res.render('login',{message: null});
    }
}
const authent = (req, res, next)=>{
    if(req.isAuthenticated()) return next();
    return res.redirect('/home');
}

const login = passport.authenticate('local', {
    successRedirect: '/carPage/today/a',
    failureRedirect: '/home?fail=true',
    
});
const getById = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.user});
        userName = user.user.toUpperCase();
        userFunc = user.func;
        status = req.params.stage;
        let car = await Car.findOne({ _id: req.params.id });;
        if(req.params.method == "conclude"){
            res.render("index", 
            {
                conclude: true, car, status, carList, userName, userFunc,
                details, addCar, date1, date2, date3,date4, part: false,
                history: false,
            });
        }else if(req.params.method == "details"){
            addCar = "addCarNone";
            if(history == true){
                carList = await Historic.find();
                car = await Historic.findOne({ _id: req.params.id });
            }
            return res.render('index', {
                userName, userFunc,status, car, carList,conclude:false, 
                addCar, date1, date2, date3, date4, part: false, history,
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
                id: car._id,
            });
        }else if(req.params.method == "assumed"){
                if(car.responsible == "" ){
                    await Car.updateOne({_id: req.params.id},{$set: {responsible: userName}});
                    return res.redirect('/carPage/today/a')
                }else{
                    return res.redirect('/carPage/today/a');
                }
        }else if(req.params.method == "parts"){
            if(car.stage != "Agendado" && car.stage != "Aguardando" && car.responsible){
                
            res.render("index", 
            {
                conclude, car, status, carList, userName, userFunc,
                details, addCar, date1, date2, date3,date4, part: true,
                history: false,
            });
        }else{
            res.redirect('/carPage/today/a');
        }
        
    }
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

const getAllCars = async (req, res) => {
    try{
            const user = await User.findOne({_id: req.user});
            const carListAll = await Car.find();
            userName = user.user.toUpperCase();
            userFunc = user.func;
            let func = userFunc == "mec"? "Mecanica" : "Funilaria";
            const today =  new RegExp(`^${dateToday.substring(0,2)}`);
            const dateone =  new RegExp(`^${date1.substring(0,2)}`);
            const datetwo =  new RegExp(`^${date2.substring(0,2)}`);
            const datethree =  new RegExp(`^${date3.substring(0,2)}`);
            const datefour =  new RegExp(`^${date4.substring(0,2)}`);
            
            if(req.params.show == "historic"){
                let list = await Historic.find();
                let list2 = [];
                for(let i = list.length; i >0; i--){
                    list2.push(list[i-1]);
                }
                carList = list2.slice();
                history = true;
                addCar = "addCarNone";
                return res.render('index', {
                    carList, userName, userFunc, status,
                    details, conclude, addCar,part: false,
                    date1, date2, date3, date4, history,
                });
            }else{ 
                

            if (req.params.day == "today"){
                history = false;
                if(userFunc == "fun" || userFunc == "mec" ){
                    carList = await Car.find({
                        date: {$regex: today}, specialty: func, stage: { $in: ["Analisando", "Reparando", "Entregando"] }});
                    carListAll.forEach((car)=>{
                        const data = car.date.substring(0,10);
                        const date = moment(data, "DD/MM/YYYY");
                        const today = moment(dateToday, "DD/MM/YYYY");
                        if(date.isBefore(today)){
                            if(car.stage == "Analisando" || car.stage == "Reparando" || car.stage == "Entregando"){
                                if(car.specialty == "Mecanica" && userFunc == "mec"){
                                    carList.push(car);
                                }else if(car.specialty == "Funilaria" && userFunc == "fun"){
                                    carList.push(car);
                                }
                            }
                        }
                    });
                }else if(userFunc == "buyer"){
                    carList = await Car.find({
                        date: {$regex: today}, specialty: func, stage: { $in: ["Aprovando", "Comprando", "Analisando"] }});
                        carListAll.forEach((car)=>{
                            const data = car.date.substring(0,10);
                            const date = moment(data, "DD/MM/YYYY");
                            const today = moment(dateToday, "DD/MM/YYYY");
                            if(date.isBefore(today)){
                                if(car.stage == "Analisando" || car.stage == "Aprovando" || car.stage == "Comprando"){
                                        carList.push(car);
                                }
                            }
                        });
                }else{
                    carList = await Car.find({date: {$regex: today}});
                    carListAll.forEach((car)=>{
                        const data = car.date.substring(0,10);
                        const date = moment(data, "DD/MM/YYYY");
                        const today = moment(dateToday, "DD/MM/YYYY");
                        if(date.isBefore(today)){
                            carList.push(car);
                        }
                    });
                }
            }else if (req.params.day == "date1"){
                carList = await Car.find({date: {$regex: dateone}});
            }else if (req.params.day == "date2"){
                carList = await Car.find({date: {$regex: datetwo}});
            }else if (req.params.day == "date3"){
                carList = await Car.find({date: {$regex: datethree}});
            }else if (req.params.day == "date4"){
                carList = await Car.find({date: {$regex: datefour}});
            }
        }
            if(req.params.show == 'a' || req.params.show == 'addCar'){
                details = false;
                addCar = "addCar";
                return res.render('index', {
                carList, userName, userFunc, status,
                details, conclude, addCar,part: false,
                date1, date2, date3, date4, history: false,
            });
            }else if(req.params.show == 'logout'){
                userName = "";
                res.redirect('/home');
            }else{    
                return res.render('index',
                {
                    carList, userName, status, details, conclude,
                    addCar, date1, date2, date3, date4, part: false,
                    userFunc, history: false,
                });
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
        return res.redirect('/carPage/today/a');
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
            carName: car.carName.toUpperCase(),
            plate: car.plate.toUpperCase(),
            forecast: moment(car.forecast).format("DD/MM/YYYY HH:mm"),
            date: moment(car.date).format("DD/MM/YYYY HH:mm"),
            complaint: car.complaint,
            services: car.services,
            parts: car.parts,
            responsible: car.userName.toUpperCase(),
            specialty: car.specialty,
            historic: `Agendado - (${userName} | ${moment().format("DD/MM/YYYY HH:mm")})`,
        });
        addCar = false;
        return res.redirect('/carPage/today/a');
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}
const orderParts = async (req, res) =>{
    const car = await Car.findOne({_id: req.params.id});
    
    const service = car.services != undefined ? car.services + " | " + req.body.services +" | ": req.body.services +" | ";
    const parts = car.parts != undefined ? car.parts+ " | " + req.body.parts +" | ": req.body.parts +" | ";
            
     let history = car.historic;
    history = history + ` | (${userName} pediu peças ou serviços ${moment().format("DD/MM/YYYY HH:mm")})`;

    await Car.updateMany({_id: req.params.id}, {$set: {services: service, parts: parts, historic: history, stage: "aprovando"}});
    part = false;
    res.redirect('/carPage/today/a');
    
}

const concludeCar = async (req, res) =>{
    try{
        
        let car = await Car.findOne({_id: req.params.id});
        status = req.params.stage;
        let stages = "";
        let history = car.historic;

        if(status == "Agendado"){
            stages = 'Aguardando';
            history = history + ` | (${userName} concluiu para Aguardando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history}});
        res.redirect('/carPage/today/a')
        }else if(status == "Aguardando"){
            stages = 'Analisando';
            history = history + ` | (${userName} concluiu para Analisando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');
        }else if(status == "Analisando"){
            stages = 'Aprovando';
            history = history + ` | (${userName} concluiu para Aprovando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');
        }else if(status == "Aprovando"){
            stages = 'Comprando';
            history = history + ` | (${userName} concluiu para Comprando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Comprando"){
            stages = 'Reparando';
            history = history + ` | (${userName} concluiu para Reparando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Reparando"){
            stages = 'Testando';
            history = history + ` | (${userName} concluiu para Testando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Testando"){
            stages = 'Vistoriando';
            history = history + ` | (${userName} concluiu para Vistoriando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Vistoriando"){
            stages = 'Entregando';
            history = history + ` | (${userName} concluiu para Entregando ${moment().format("DD/MM/YYYY HH:mm")})`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history, responsible: ""}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Entregando" || status == "forced"){
            stages= 'Entregue';
            history = history + ` | (${userName} concluiu para Entregue ${moment().format("DD/MM/YYYY HH:mm")}) *`;
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: history}});
            stages = '';
            car = await Car.findOne({_id: req.params.id});
            car.forecast = moment().format("DD/MM/YYYY HH:mm");
            const newHistoric = new Historic(car.toObject());
            await newHistoric.save();
            await Car.deleteOne({_id: req.params.id});
            
        res.redirect('/carPage/today/a');    
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
    authent,
    orderParts,
} 
