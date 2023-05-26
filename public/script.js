const newUser = document.querySelector(".newUser");
const addUser = document.querySelector(".addUser");
const btnMenu = document.querySelector("#btnMenu");
const togle = document.querySelector(".togle");
const body = document.querySelector("body");

//const user = JSON.parse('<%= userFunc %>').value;
togle.style.display = 'none';

// if(user != "mec" && user != "fun" && user != "buyer"){

    //alert(user)
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
        document.getElementById("user").value = ""; 
        document.getElementById("password").value = ""; 
        addUser.style.display = 'flex';
    });
    
//  }

const form = document.getElementById('formParts');
const btnSend = document.getElementById('btnSend');
const incPart = document.getElementById("includePart");
const incServ = document.getElementById("includeService");
let pecas = [];
let servicos = [];

incPart.addEventListener('click', (event) => {
    event.preventDefault();
    const parts = document.getElementById("parts");
    const partValue = parts.value.trim();
    
    if (partValue) {
        pecas.push(partValue);
        parts.value = '';
        addItem('listParts', partValue);
    }

});

incServ.addEventListener('click', (event) => {
    event.preventDefault();
    const services = document.getElementById("services");
    const serviceValue = services.value.trim();

    if (serviceValue) {
      servicos.push(serviceValue);
      services.value = '';
      addItem('listServices', serviceValue);
    }
  });


  function addItem(listId, valor) {
    const lista = document.getElementById(listId);
    const itemLista = document.createElement('li');
    itemLista.textContent = valor;
    lista.appendChild(itemLista);
  }



  btnSend.addEventListener('click', (event) => {
    event.preventDefault();

    const data = {
      pecas: pecas,
      servicos: servicos
    };

    fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/carPage/today/a';
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  });
