let _pessoasEndpoint = 'http://localhost:3000/pessoas'
let _pessoasList = [];

window.addEventListener('load', () => {
  loadPeople();
})

async function loadPeople() {
   let response = await fetch(_pessoasEndpoint); 
   _pessoasList = await response.json(response);
   
}
