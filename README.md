# Ottokar-controle-de-patio

if(user != undefined){
    let correct = Bcrypt.compareSync(log.password, user.password);
    if(correct){
        userName = name; 
        userFunc = user.func; 
        
        res.redirect('/carPage/today/a')
    }else{
        message = 'Usúario ou senha inválidos!';
        res.render('login', {message});
    }
}else{
    message = 'Usúario ou senha inválidos!';
    res.render('login', {message});
}    
});