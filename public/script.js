const newUser = document.querySelector(".newUser");
const addUser = document.querySelector(".addUser");
const btnMenu = document.querySelector("#btnMenu");
const togle = document.querySelector(".togle");
const body = document.querySelector("body");


const  dateInput = document.getElementById('date');
let currentDate = new Date(); 
currentDate.setHours(currentDate.getHours() + 1);
const year = currentDate.getFullYear();
const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
const day = ('0' + currentDate.getDate()).slice(-2);
const hour = ('0' + currentDate.getHours()).slice(-2);
const minutes = ('0' + currentDate.getMinutes()).slice(-2);
const closeMessage = document.querySelector("#close-message");
const message = document.querySelector(".message");
const loadingCircle = document.querySelector('.circle');

togle.style.display = 'none';

if(dateInput) dateInput.value = `${year}-${month}-${day}T${hour}:${minutes}`;


if (closeMessage){
  closeMessage.addEventListener("click", () =>{
    message.style.display = 'none';
  });
  setTimeout(()=>{
    message.style.display = 'none';
  },5000);
}

function showLoading() {
  loadingCircle.style.display = 'flex';
}

function hideLoading() {
  loadingCircle.style.display = 'none';
}  
hideLoading();

if(userFunc != "mec" && userFunc != "fun" && userFunc != "buyer"){

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
      document.getElementById("password").value = ""; 
      addUser.style.display = 'flex';
      document.getElementById("user").value = ""; 
      document.getElementById("user").setAttribute('readonly', 'true');

      setTimeout(() => {
        document.getElementById("user").removeAttribute('readonly');
        document.getElementById("user").value = "";
      }, 1500);

    });
    function close (element) {
      document.querySelector(element).style.display = 'none';
    }
    
    document.getElementById('user').addEventListener('input', function() {
      let inputUser = this.value;
      if(inputUser == "ottokar"){
        inputUser = "";
      }
      console.log(inputUser)
      const userExists = users.some(name => name.user === inputUser.toLowerCase());
      const errorMessage = document.getElementById('errorMessage');

      errorMessage.style.display = inputUser && userExists ? 'block' : 'none';
    });
    document.querySelector('.openControl').addEventListener("click", ()=>{
      document.getElementById('modalUser').style.display = "flex";
    })
} 

if(part){

  const form = document.getElementById('formParts');
  const btnSend = document.getElementById('btnSend');
  const incPart = document.getElementById("includePart");
  const incServ = document.getElementById("includeService");
  let pecas = [];
  let servicos = [];

  incPart.addEventListener('click', (event) => {
      event.preventDefault();
      const parts = document.getElementById("parts");
      const partValue = parts.value.trim()
      
      if (partValue) {
          pecas.push(partValue);
          parts.value = '';
          addItem('listParts', partValue);
      }
      console.log(pecas)
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
    document.querySelector('.loading').style.display = "flex";
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
        document.querySelector('.loading').style.display = "none=";
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  });

}
  
  async function showPriority() {
    const nameSelect = document.getElementById('responsible');
    const priority = document.getElementById('priority');
    const idSelect = nameSelect.options[nameSelect.selectedIndex].value;
    const resp = idSelect.split('|');
    const dateMarked = `${dateInput.value.substring(8,10)}/${dateInput.value.substring(5,7)}/${dateInput.value.substring(0,4)}`;
    const today = new Date();
    const cars = [];

    carList.forEach((car) => {
      const carDateParts = car.date.substring(0, 10).split('/');
      const carDate = new Date(carDateParts[2], carDateParts[1] - 1, carDateParts[0]);
      
      if (car.responsible == resp[0]) {
        if (car.date.substring(0, 10) == dateMarked) {
          cars.push(car);
        }
        
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        if (dateMarked == currentDate.toLocaleDateString('pt-BR')) {
          if (carDate < currentDate) {
            cars.push(car);
          }
        }
      }
    });

    priority.innerHTML= '';

      for (let i = -1; i < cars.length; i++) {
        const option = document.createElement('option');
        option.text = (i + 2).toString();
        option.value = (i + 2).toString();
        priority.appendChild(option);
      }
  }

if(details){

  function updatePriority(){
    const select = document.getElementById("detailPriority");
    const cars = [];
    const detailDateParts = carDetails.date.substring(0, 10).split('/');
    const detailsDate = new Date(detailDateParts[2], detailDateParts[1] - 1, detailDateParts[0]);

    carList.forEach((car) => {
      const carDateParts = car.date.substring(0, 10).split('/');
      const carDate = new Date(carDateParts[2], carDateParts[1] - 1, carDateParts[0]);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (car.responsible == carDetails.responsible) {
        if(detailsDate <= currentDate){
          if (carDate <= currentDate) {
            cars.push(car);
          }
        }else if (car.date.substring(0, 10) == carDetails.date.substring(0, 10)){
            cars.push(car);
        }
      }
    });


      for (let i = 0; i < cars.length; i++) {
        const option = document.createElement('option');
        option.text = (i + 1).toString();
        option.value = (i + 1).toString();
        select.appendChild(option);
      }
  }
  updatePriority();

  document.getElementById("detailPriority").addEventListener("change", function() {
    const selectedValue = this.value;
    document.querySelector('.loading').style.display = "flex";
    fetch(`/priority/${carDetails._id}/${carDetails.responsible}`,{
      method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ priorityValue: selectedValue })
    })
    .then(response=>{
      window.location.href = `/carPage/today/responsible?responsibleList=${carDetails.responsible}`;
      document.querySelector('.loading').style.display = "none";
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  });

  document.querySelector(".close").addEventListener("click",  () =>{

    document.querySelector(".modalPriority").style.display = "none";

  })
  if(carDetails.documentDetails == undefined) {
    const consultLink = document.getElementById('consultDetails');
    consultLink.addEventListener('click', (event) => {
      event.preventDefault(); 
      showLoading(); 
      window.location.href = event.target.href; // Redireciona para a rota
    });
  }
}

function updatePassword(id){
  document.querySelector(".modalPassword").style.display = "flex";
  document.querySelector(".cardPassword").style.display = "flex";
  document.querySelector("#formPassword").action = `/updateUser/${id}/password`;
}
function deleteUser(id, userName){
  document.querySelector(".modalDeleteUser").style.display = "flex";
  document.querySelector(".cardDeleteUser").style.display = "flex";
  document.querySelector(".nameUser").innerHTML = (userName).toUpperCase();
  document.querySelector("#btnDelete").href = `/updateUser/${id}/delete`;
}

const plateInput = document.getElementById('plate');

plateInput.addEventListener('blur',()=> {
  plate = plateInput.value;

  if(plate.length == 7){
    $('#carName').val('Buscando...');
    $.ajax({
      url: `/getCarModel/${plate}`,
      type: 'GET',
      success: function (response) {
        $('#carName').val(response.carModel); 
      },
      error: function (error) {
        console.error(error);
      }
    })
  }
  })


function documentDetails (option){
  if(option == "open"){
    document.querySelector(".detailsDocument").style.display = "flex";
  }else{
    document.querySelector(".detailsDocument").style.display = "none";
  }
}