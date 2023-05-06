const newUser = document.querySelector(".newUser");
const addUser = document.querySelector(".addUser");
const btnMenu = document.querySelector("#btnMenu");
const togle = document.querySelector(".togle");
const body = document.querySelector("body");
togle.style.display = 'none';
btnMenu.addEventListener("click", () =>{
        if(togle.style.display == 'none'){
            togle.style.display = 'flex';
        }else{
            togle.style.display = 'none';
        }
});

body.addEventListener("click", (e) =>{
    if(e.target.id != 'btnMenu' && e.target.id != 'togle'){
        togle.style.display = 'none';
    }
});

newUser.addEventListener("click", () =>{
    addUser.style.display = 'flex';
});
