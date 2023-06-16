const Car = require('../models/Car');
const User = require('../models/User');
const Historic = require('../models/Historic');
const Bcrypt = require('bcrypt');
const moment = require('moment');
const passport = require('passport');
const { format, addDays } = require('date-fns');
const session = require('express-session');
const { trusted } = require('mongoose');

let users = [];
let carList = [];
let responsibles = [];
let message = "";
let userName = "";
let userFunc = "";
let status = "";
let details = false;
let conclude = false;
let part = false;
let addCar = "addCar";
let history = false;
let togle = false;
let week = [];
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
    return res.redirect('/');
}

const login = passport.authenticate('local', {
    successRedirect: '/carPage/today/a',
    failureRedirect: '/?fail=true',
    
});
const getById = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.user});
        const carListAll = await Car.find();
        userName = user.user.toUpperCase();
        userFunc = user.func;
        status = req.params.stage;
        let car = await Car.findOne({ _id: req.params.id });;
        setTimeout(() => {
            message = "";
          }, 2000);

        if(req.params.method == "conclude"){
            togle = false;
            res.render("index", 
            {
                conclude: true, car, status, carList, userName, userFunc,message,
                details, addCar, date1, date2, date3,date4, part: false,users,
                history: false, week, togle, responsibles, carListAll,
            });
        }else if(req.params.method == "details"){
            addCar = "addCarNone";
            togle = false;
            
            if(history == true){
                // carList = await Historic.find();
                car = await Historic.findOne({ _id: req.params.id });
            }
            return res.render('index', {
                userName, userFunc,status, car, carList,conclude:false, week,
                addCar, date1, date2, date3, date4, part: false, history, togle,
                responsibles, carListAll, message, users,
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
                priority: car.priority,
            });
        }else if(req.params.method == "assumed"){
            let carDetails = await Car.findOne({_id: req.params.id})
            let carUpdate = await Car.find({responsible: carDetails.responsible});
            const data = (carDetails.date).substring(0,10);
            const date = moment(data, "DD/MM/YYYY");
            const today = moment(dateToday, "DD/MM/YYYY");

            let historic = [...car.historic];
            let history = "";
        
            if(userName != car.responsible){
                history = `${moment().format("HH:mm DD/MM")} - ${userName} assumiu como responsável.`;
                historic.push(history)

                carUpdate.forEach(async(carResponsible)=>{
                    const carData = (carResponsible.date).substring(0,10);
                    const carDate = moment(carData, "DD/MM/YYYY");
                    if(date.isSameOrBefore(today) && carDate.isSameOrBefore(today)){
                        if(carResponsible.plate !== carDetails.plate && carResponsible.priority > carDetails.priority){
                            let newPriority = carResponsible.priority-1;
                            await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}});
                        }
                    }else if(date.isSame(carDate)){
                        if(carResponsible.plate !== carDetails.plate && carResponsible.priority > carDetails.priority){
                            let newPriority = carResponsible.priority-1;
                            await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}});
                        }
                    }
                });

                await Car.updateMany({_id: req.params.id},{$set: {responsible: userName.toLowerCase(), historic: historic, priority: 1}});

                carDetails = await Car.findOne({_id: req.params.id});
                carUpdate = await Car.find({responsible: carDetails.responsible});

                carUpdate.forEach(async(carResponsible)=>{
                    const carData = (carResponsible.date).substring(0,10);
                    const carDate = moment(carData, "DD/MM/YYYY");
                    if(date.isSameOrBefore(today) && carDate.isSameOrBefore(today)){
                        if(carResponsible.plate !== carDetails.plate){
                            let newPriority = carResponsible.priority+1;
                            await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}});
                        }
                    }else if(date.isSame(carDate)){
                        if(carResponsible.plate !== carDetails.plate){
                            let newPriority = carResponsible.priority+1;
                            await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}});
                        }
                    }
                });
                
                togle = false;
                message = 'Troca realizada com sucesso!'
                return res.redirect('/carPage/today/a')
            }else{
                message = 'Erro, você ja é responsavel por esse veículo.'
                return res.redirect('/carPage/today/a')
            }
        }else if(req.params.method == "parts"){
            togle = false;
            if(car.stage != "Agendado" && car.stage != "Aguardando" && car.responsible){
            res.render("index", 
            {
                conclude, car, status, carList, userName, userFunc, message,
                details, addCar, date1, date2, date3,date4, part: true,users,
                history: false, week, togle, responsibles, carListAll,
            });
        }else{
            message = "O veículo ainda não esta em fase de pedir peças";
            res.redirect('/carPage/today/a');
        }
        
        }else if(req.params.method == "concludePart"){
            const stageIndex = parseInt(req.params.stage);
            let conclude = false;
            let historic = [...car.historic];
            let history = "";
            if(!car.parts[stageIndex].conclude){
                history = `${moment().format("HH:mm DD/MM")} - ${userName} Concluiu o/a (${car.parts[stageIndex].part}).`;
                conclude = true;
            }else{
                history = `${moment().format("HH:mm DD/MM")} - ${userName} Revogou a conclusão do/a (${car.parts[stageIndex].part}).`;
                conclude = false;
            }
            historic.push(history)
            await Car.updateMany(
                    { _id: car._id },
                    { $set: { [`parts.${stageIndex}.conclude`]: conclude, historic: historic } }
                    );
            return res.redirect(`/getById/${car._id}/details/${car.stage}`) 
        }else if(req.params.method == "concludeService"){
            const stageIndex = parseInt(req.params.stage);
            let conclude = false;
            let historic = [...car.historic];
            let history = "";
            if(!car.services[stageIndex].conclude){
                history = `${moment().format("HH:mm DD/MM")} - ${userName} Concluiu o/a (${car.services[stageIndex].service}).`;
                conclude = true;
            }else{
                history = `${moment().format("HH:mm DD/MM")} - ${userName} Revogou a conclusão do/a (${car.services[stageIndex].service}).`;
                conclude = false;
            }
            historic.push(history)
            await Car.updateMany(
                    { _id: car._id },
                    { $set: { [`services.${stageIndex}.conclude`]: conclude, historic: historic } }
                    );
            return res.redirect(`/getById/${car._id}/details/${car.stage}`)   
        }
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}
// Falta deletar os carros e os usuarios, para gravar o video
const getAllCars = async (req, res) => {
    try{
            users = await User.find();
            const user = await User.findOne({_id: req.user});
            const carListAll = await Car.find();
            responsibles = await User.find({func: {$in:["mec", "fun"]} });
            userName = user.user.toUpperCase();
            userFunc = user.func;
            const yourCars = [{modelo: "corsa", placa:"GFF5T44"}]
            const today =  new RegExp(`^${dateToday.substring(0,2)}`);
            const dateone =  new RegExp(`^${date1.substring(0,2)}`);
            const datetwo =  new RegExp(`^${date2.substring(0,2)}`);
            const datethree =  new RegExp(`^${date3.substring(0,2)}`);
            const datefour =  new RegExp(`^${date4.substring(0,2)}`);
            const hoje = new Date();
            let func = userFunc == "mec"? "Mecanica" : "Funilaria";
            setTimeout(() => {
                message = "";
              }, 2000);
            
            for (let i = 1; i <= 4; i++) {
                const nextDate = addDays(hoje, i);
                const dayWeek = format(nextDate, 'eeee', { locale: require('date-fns/locale/pt-BR') });
                week.push(dayWeek);
            }
            users.forEach(user => {
                if(user.func == "mec"){
                    user.func = "Mecanico";
                }else if(user.func == "fun"){
                    user.func = "Funileiro";
                }else if(user.func == "buyer"){
                    user.func = "Comprador";
                }else if(user.func == "seller"){
                    user.func = "Vendedor";
                }else if(user.func == "manager"){
                    user.func = "Gerente";
                }
            })
            if(req.params.day == "historic"){
                let list = await Historic.find();
                let list2 = [];
                for(let i = list.length; i >0; i--){
                    list2.push(list[i-1]);
                }
                carList = list2.slice();
                history = true;
                addCar = "addCarNone";
            }else{ 
            if (req.params.day == "today"){
                history = false;
                if(userFunc == "fun" || userFunc == "mec" ){
                    carList = await Car.find({
                        date: {$regex: today}, specialty: func, $and: [
                            { $or: [
                              { stage: "Analisando" },
                              { stage: "Reparando" },
                              { stage: "Entregando" }
                            ]},
                            { responsible: userName.toLowerCase() }
                          ]});
                        carListAll.forEach((car)=>{
                            const data = car.date.substring(0,10);
                            const date = moment(data, "DD/MM/YYYY");
                            const today = moment(dateToday, "DD/MM/YYYY");
                            
                        if(date.isBefore(today)){
                            if(car.stage == "Analisando" || car.stage == "Reparando" || car.stage == "Entregando"){
                                if(car.responsible == userName.toLowerCase()){
                                    if(car.specialty == "Mecanica" && userFunc == "mec"){
                                        carList.push(car);
                                    }else if(car.specialty == "Funilaria" && userFunc == "fun"){
                                        carList.push(car);
                                    }
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
                if(userFunc == "fun" || userFunc == "mec" ){
                    carList = await Car.find({
                        date: {$regex: dateone},  specialty: func, responsible: userName.toLowerCase(),
                        stage: { $in: ["Analisando", "Reparando", "Entregando"] }
                    });
                }else carList = await Car.find({date: {$regex: dateone}});

            }else if (req.params.day == "date2"){
                carList = await Car.find({date: {$regex: datetwo}});
            }else if (req.params.day == "date3"){
                carList = await Car.find({date: {$regex: datethree}});
            }else if (req.params.day == "date4"){
                carList = await Car.find({date: {$regex: datefour}});
            }
            carList.sort((a, b) => a.priority - b.priority);

        }
            if(req.params.show == 'a' || req.params.show == 'addCar'){
                details = false;
                togle = false;
                if(req.params.show == 'addCar'){
                    addCar = 'addCarPhone'
                }else{
                    addCar = "addCar";
                }
                return res.render('index', {
                carList, userName, userFunc, status, week, responsibles,users,
                details, conclude, addCar,part: false, togle,carListAll,
                date1, date2, date3, date4, history: false, yourCars,message
            });
            }else if(req.params.show == 'logout'){
                togle = false;
                userName = "";
                res.redirect('/');
            }else if (req.params.show == 'togle') {
                if(!togle){
                    togle = true;
                }else{
                    togle = false;
                }
                return res.render('index',
                {
                    carList, userName, status, details, conclude, message,users,
                    addCar, date1, date2, date3, date4, part, responsibles,
                    userFunc, history, week, togle, yourCars, carListAll,
                });
            }else if(req.params.show == "all"){
                carList = await Car.find({
                    date: {$regex: today}, specialty: func, stage: { $in: ["Analisando", "Reparando", "Entregando"] 
                }})
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
            carList.sort((a, b) => a.priority - b.priority);
                return res.render('index',
                {
                    carList, userName, status, details, conclude, message,users,
                    addCar, date1, date2, date3, date4, part, responsibles,
                    userFunc, history, week, togle, yourCars, carListAll,
                });
            }else if(req.params.show == "responsible"){
                const responsibleList = req.query.responsibleList;
                if(responsibleList != "all"){
                    carList = carList.filter((car) => car.responsible == req.query.responsibleList);
                }
                carList.sort((a, b) => a.priority - b.priority);
                    return res.render('index',
                    {
                        carList, userName, status, details, conclude, message,users,
                        addCar, date1, date2, date3, date4, part, responsibles,
                        userFunc, history, week, togle, yourCars, carListAll,
                    });
                
            }else if(req.params.show == "plate"){  
                console.log('0')
                if(req.query.plateFilter){
                    console.log('1')
                carList = await Historic.find({plate: new RegExp(`^${req.query.plateFilter.toUpperCase()}`)});
                return res.render('index', {
                    carList, userName, userFunc, status, togle, carListAll,
                    details, conclude, addCar,part: false, responsibles,
                    date1, date2, date3, date4, history, week, message,users,
                });
                }else{
                    return res.render('index', {
                        carList, userName, userFunc, status, togle, carListAll,
                        details, conclude, addCar,part: false, responsibles,users,
                        date1, date2, date3, date4, history, week, message
                    });
                    
                }
            }else{
                return res.redirect('/');
            }
        
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

const createUser = async (req, res) => {
    try{
        const log = req.body;
        
        log.newPassword = await Bcrypt.hash(log.newPassword, 8);
        
        await User.create({
            user: log.newUser.toLowerCase,
            password: log.newPassword,
            func: log.func,
        });
        message = 'Usuário criado com sucesso!';
        return res.redirect('/carPage/today/a');
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}

const createCar = async (req, res) =>{
    const car = req.body;
    const resp = (car.responsible).split('|');

    if(!car.carName){
        return res.redirect('/');
    }
    try{
        await Car.create({
            carName: car.carName.toUpperCase(),
            plate: car.plate.toUpperCase(),
            forecast: moment(car.forecast).format("DD/MM HH:mm"),
            date: moment(car.date).format("DD/MM/YYYY HH:mm"),
            complaint: car.complaint,
            services: car.services,
            parts: car.parts,
            responsible: resp[0],
            specialty: car.specialty,
            historic: `${moment().format("HH:mm DD/MM")} - ${userName} Agendou o veículo para ${moment(car.date).format("DD/MM/YYYY HH:mm")}`,
            priority: car.priority
        });       
        
        const carDetails = await Car.findOne({plate: car.plate.toUpperCase()});
        const cars = await Car.find({responsible: carDetails.responsible});
        console.log(carDetails)
        const data = (carDetails.date).substring(0,10);
        const date = moment(data, "DD/MM/YYYY");
        const today = moment(dateToday, "DD/MM/YYYY");

        cars.forEach(async(carResponsible)=>{
            const carData = (carResponsible.date).substring(0,10);
            const carDate = moment(carData, "DD/MM/YYYY");
            console.log(date+" | "+today)
            if(date.isSameOrBefore(today) && carDate.isSameOrBefore(today)){
                console.log("today")//esta com erro ao entrar nesse if, não sei por que não esta entrando
                if(carResponsible.plate !== carDetails.plate){
                    console.log("plate")
                    if(carResponsible.priority >= carDetails.priority){
                        console.log("cl >= cd")
                        let newPriority = carResponsible.priority+1;
                        await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}})
                        }    
                }
            }else if(date.isSame(carDate)){
                console.log("outra data")
                if(carResponsible.plate !== carDetails.plate){
                    if(carResponsible.priority >= carDetails.priority){
                        let newPriority = carResponsible.priority+1;
                        await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}})
                        }    
                }
            }else{
                console.log("não entrou")
            }
        });
        message = 'Veículo adicionado com sucesso!'
        if(addCar == "addCarPhone") addCar = "addCarNone";
        return res.redirect('/carPage/today/a');
    }catch (err) {
        res.status(500).send({error: err.message})
    }
}
const orderParts = async (req, res) =>{
    try{

        const car = await Car.findOne({ _id: req.params.id });
        let services = [];
        let parts = [];
        let servicesUpd = [];
        let partsUpd = [];
        let historic = [...car.historic];
        let history = ""; 

        if (car.services) {
            services = [...car.services];
        }
        if (car.parts) {
            parts = [...car.parts];
        }
        if (req.body.servicos) {
            req.body.servicos.forEach((serv, index) =>{
                servicesUpd[index] = {
                    service: serv,
                    conclude: false
                }
            })
            services.push(...servicesUpd);
        }
        if (req.body.pecas) {
            req.body.pecas.forEach((part, index) =>{
                partsUpd[index] = {
                    part: part,
                    conclude: false
                }
            })
            parts.push(...partsUpd);
        }
        history =`${moment().format("HH:mm DD/MM")} - ${userName} pediu: ${req.body.pecas}; ${req.body.servicos}`;
        historic.push(history)
        await Car.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    services: services,
                    parts: parts,
                    historic: historic,
                    stage: "Aprovando",
                }
            }
            );
            message = 'Peças e/ou serviços adicionados com sucesso!'
            res.redirect('/carPage/today/a');
        }catch (err){
            res.status(500).send({error: err.message})
        }
}
const updatePriority = async (req, res) =>{
    try{
        const cars = await Car.find({responsible: req.params.resp});
        const carDetails = await Car.findOne({_id: req.params.id});
        //preciso da data do carro, preciso fazer a busca e alterar os que tem a mesma data do carro alterado
        const data = (carDetails.date).substring(0,10);
        const date = moment(data, "DD/MM/YYYY");
        const today = moment(dateToday, "DD/MM/YYYY");
        const priority = parseInt(req.body.priorityValue);
        
        cars.forEach(async(carResponsible)=>{
            const carData = (carResponsible.date).substring(0,10);
            const carDate = moment(carData, "DD/MM/YYYY");
            if(date.isSameOrBefore(today) && carDate.isSameOrBefore(today)){
                if(carResponsible.plate !== carDetails.plate){
                    if(carDetails.priority < priority){
                        if(carResponsible.priority > carDetails.priority && carResponsible.priority <= priority){ 
                            let newPriority = carResponsible.priority-1;
                            await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}})
                        }
                    }else if(carResponsible.priority < carDetails.priority && carResponsible.priority >= priority){ 
                        let newPriority = carResponsible.priority+1;
                        await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}})
                        }    
                }
            }else if(date.isSame(carDate)){
                if(carResponsible.plate !== carDetails.plate){
                    if(carDetails.priority < priority){
                        if(carResponsible.priority > carDetails.priority && carResponsible.priority <= priority){ 
                            let newPriority = carResponsible.priority-1;
                            await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}})
                        }
                    }else if(carResponsible.priority < carDetails.priority && carResponsible.priority >= priority){ 
                        let newPriority = carResponsible.priority+1;
                        await Car.updateOne({_id: carResponsible._id}, {$set: {priority: newPriority}})
                    }    
                }
            }
        });
        await Car.updateOne({_id: carDetails._id}, {$set: {priority: priority}})
        message = 'Prioridade alterada com sucesso!';
        return res.redirect(`/carPage/today/responsible?responsibleList=${carDetails.responsible}`)
    }catch(err){
    res.status(500).send({error: err.message})
    }
}

const concludeCar = async (req, res) =>{
    try{
        let car = await Car.findOne({_id: req.params.id});
        status = req.params.stage;
        let stages = "";
        let historic = [...car.historic];
        let history = "";
        message = 'Etapa concluida com sucesso!';
        if(status == "Agendado"){
            stages = 'Aguardando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a')
        }else if(status == "Aguardando"){
            stages = 'Analisando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');
        }else if(status == "Analisando"){
            stages = 'Aprovando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');
        }else if(status == "Aprovando"){
            stages = 'Comprando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Comprando"){
            stages = 'Reparando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Reparando"){
            stages = 'Testando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Testando"){
            stages = 'Vistoriando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Vistoriando"){
            stages = 'Entregando';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
        res.redirect('/carPage/today/a');    
        }else if(status == "Entregando" || status == "forced"){
            stages= 'Entregue';
            history = `${moment().format("HH:mm DD/MM")} - ${userName} concluiu para ${stages}.`;
            historic.push(history)
            await Car.updateMany({_id: req.params.id}, {$set: {stage: stages, historic: historic}});
            stages = '';
            car = await Car.findOne({_id: req.params.id});
            car.forecast = moment().format("DD/MM/YYYY HH:mm");
            const newHistoric = new Historic(car.toObject());
            await newHistoric.save();
            await Car.deleteOne({_id: req.params.id});
            
        res.redirect('/carPage/today/a');    
        }else{
            res.redirect("/")
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
    updatePriority
} 
