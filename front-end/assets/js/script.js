let _peopleEndpoint = 'http://localhost:3000/pessoas'
let _peoplesListFromApi = [];
let _peoplesGlobal = [];
let _peoplesFilterGlobal = [];
let peoplePanel = null;
let statisticsPanel = null;
let buttonSearch = null;
let inputSearch = null;
let numberFormat = Intl.NumberFormat('pt-BR');
let panelNoPeople = null;
let panelNoStatistics = null;
let peoplePanelDiv = null;
let statisticsPanelDiv = null;
let _countResult = 0;
let maleCount = 0;
let femaleCount = 0;
let agesTotal = 0;
let ageAverage = 0;

window.addEventListener('load', () => {
  peoplePanel = document.querySelector('#people-panel');
  statisticsPanel = document.querySelector('#statistics-panel');
  
  buttonSearch = document.querySelector('#search');
  buttonSearch.addEventListener('click', searchPeople);
  inputSearch = document.querySelector('#term-search');
  inputSearch.addEventListener('keyup', serchPeopleEnter)

  panelNoPeople = document.querySelector('#panel-no-people');
  panelNoStatistics = document.querySelector('#panel-no-statistics');
  peoplePanelDiv = document.querySelector('#people-panel');
  statisticsPanelDiv = document.querySelector('#statistics-panel');
  inputSearch.focus();

  loadPeople();
})

async function loadPeople() {
   let response = await fetch(_peopleEndpoint); 
   _peoplesListFromApi = await response.json(response);
   _peoplesGlobal = _peoplesListFromApi.map(person => {
      const { name, picture, dob, gender } = person;
      return {
        name: `${name.first} ${name.last}`,
        picture: picture.thumbnail,
        age: dob.age,
        gender: gender
      }
   }); 
}

function searchPeople() {
  doListPeoples();
  doStatistics();
  render();
}

function serchPeopleEnter(event) {
  buttonSearch.disabled = (event.target.value.length == 0);
  if (event.target.value.length > 0) {
    if (event.keyCode === 13) {
      searchPeople();
    }
  }   
}

function doListPeoples() {
  _peoplesFilterGlobal = _peoplesGlobal.filter((item) => {
    return item.name.toLowerCase().includes(inputSearch.value.toLowerCase());
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
}

function doStatistics() {
  maleCount = 0;
  femaleCount = 0;
  _countResult = _peoplesFilterGlobal.length;

  agesTotal = _peoplesFilterGlobal.reduce((accumulator, current) => {
    return accumulator + current.age
  }, 0);

  _peoplesFilterGlobal.forEach((item) => {
      if (item.gender.toLowerCase() === 'male') 
        maleCount++;      

      if (item.gender.toLowerCase() === 'female') 
        femaleCount++;      
  });

  ageAverage = agesTotal/_peoplesFilterGlobal.length;
}

function render() {
  handleShowNoResult();
  renderPeoplePanel();
  renderStatisticsPanel();
}

function handleShowNoResult() {
  if (_countResult > 0) {    
    panelNoPeople.classList.add('d-none');
    panelNoStatistics.classList.add('d-none');
  } else {
    panelNoPeople.classList.remove('d-none');
    panelNoStatistics.classList.remove('d-none');
  }
}

function renderPeoplePanel() {
  if (_countResult > 0) {
    peoplePanelDiv.innerHTML = `<h4 class="m-4"><span> ${ _countResult } </span> usuário(s) encontrado(s)</h4>`;
    _peoplesFilterGlobal.forEach((item, i) => {
        let div = `
            <div class="col-12 mb-2">
              <img class="rounded-circle mr-2" src="${ item.picture }" /> ${ item.name }, ${ item.age }  anos
            </div>
        `
        peoplePanelDiv.innerHTML = peoplePanelDiv.innerHTML + div;
    });
  } else {
    peoplePanelDiv.innerHTML = '';
    statisticsPanelDiv.innerHTML = '';
  }
}

function renderStatisticsPanel() {
  if (_countResult > 0) {
    statisticsPanelDiv.innerHTML = `<div class="row">
        <h4 class="m-4">Estatísticas</h4>
        <div class="col-12 ml-2 mb-2">
          <strong>Masculino</strong>: ${ maleCount } <br />
          <strong>Feminino</strong>: ${ femaleCount } <br />
          <strong>Soma das idades</strong>: ${ numberFormat.format(agesTotal) } <br />
          <strong>Média das idades</strong>: ${ Math.round(ageAverage * 100) / 100 }
        </div>
      </div>
    `;
  } else {
    statisticsPanelDiv.innerHTML = '';
  }
}