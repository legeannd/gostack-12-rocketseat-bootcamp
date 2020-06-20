//Requisição do Express, utilizado para manipular as rotas criadas na aplicação, e do UUID, utilizado para criar um ID único para os cadastros

const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];

//Função logRequests é um middleware utilizado para mostarar no console qual rota está sendo chamada e qual foi o status code retornado

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`
  
  console.log(logLabel);

  return next();
}

//Função validateProjectId é um middleware que verifica se o ID passado nas rotas é válido, através da função 'isUuid'

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' })
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

//Rota que lista todos os projetos cadastrados, podendo ter o filtro de título do projeto adicionado na rota para ser verificado

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results)
});

//Rota que cadastra um novo projeto com o título e dono do projeto que foram passados pelo body da aplicação, além de um ID único

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project)
});

//Rota que altera os dados de um determinado projeto com o ID especificado no seu parâmetro 

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: 'Project not found.'});
  }

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project;


  return response.json(project);
});

//Rota que deleta um determinado projeto com o ID especificado no seu parâmetro

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({error: 'Project not found.'})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
})


//Inicia o servidor back-end

app.listen(3333, () => {
  console.log('Back-end started!');
});