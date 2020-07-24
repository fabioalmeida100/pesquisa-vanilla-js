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
let countResult = 0;

window.addEventListener('load', () => {
  peoplePanel = document.querySelector('#people-panel');
  statisticsPanel = document.querySelector('#statistics-panel');
  buttonSearch = document.querySelector('#search').addEventListener('click', searchPeople);
  inputSearch = document.querySelector('#term-search');
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

function doListPeoples() {
  _peoplesFilterGlobal = _peoplesGlobal.filter((item) => {
    return item.name.toLowerCase().includes(inputSearch.value.toLowerCase());
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
}

function doStatistics() {
  let maleCount = 0;
  let femaleCount = 0;
  countResult = _peoplesFilterGlobal.length;

  let agesTotal = _peoplesFilterGlobal.reduce((accumulator, current) => {
    return accumulator + current.age
  }, 0);

  _peoplesFilterGlobal.forEach((item) => {
      if (item.gender.toLowerCase() === 'male') 
        maleCount++;      

      if (item.gender.toLowerCase() === 'female') 
        femaleCount++;      
  });

  let ageAverage = agesTotal/_peoplesFilterGlobal.length;

  console.log(`Masculino: ${ maleCount }`);
  console.log(`Feminino: ${ femaleCount }`);
  console.log(`Soma das idades: ${ numberFormat.format(agesTotal) }`);
  console.log(`Média das idades: ${ Math.round(ageAverage * 100) / 100 }`);
}

function render() {
  handleShowNoResult();
  renderPeoplePanel();
}

function handleShowNoResult() {
  if (countResult > 0) {    
    panelNoPeople.classList.add('d-none');
    panelNoStatistics.classList.add('d-none');
  } else {
    panelNoPeople.classList.remove('d-none');
    panelNoStatistics.classList.remove('d-none');
  }
}

function renderPeoplePanel() {
  if (countResult > 0) {
    peoplePanelDiv.innerHTML = `<h4 class="m-4"><span> ${ countResult } </span> usuário(s) encontrado(s)</h4>`;
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