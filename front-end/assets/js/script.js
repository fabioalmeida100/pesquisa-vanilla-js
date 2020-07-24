let _peopleEndpoint = 'http://localhost:3000/pessoas'
let _peoplesListFromApi = [];
let _peoplesGlobal = [];
let _peoplesFilterGlobal = [];
let peoplePanel = null;
let statisticsPanel = null;
let buttonSearch = null;
let inputSearch = null;
let numberFormat = Intl.NumberFormat('pt-BR');

window.addEventListener('load', () => {
  peoplePanel = document.querySelector('#people-panel');
  statisticsPanel = document.querySelector('#statistics-panel');
  buttonSearch = document.querySelector('#search').addEventListener('click', searchPeople);
  inputSearch = document.querySelector('#term-search');
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
    return item.name.toLowerCase().includes(inputSearch.value);
  })
  console.log(_peoplesFilterGlobal);
}

function doStatistics() {
  let maleCount = 0;
  let femaleCount = 0;

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

}