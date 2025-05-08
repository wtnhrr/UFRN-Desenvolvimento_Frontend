const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Corrija o caminho para a pasta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

let tarefas = [];

// Serve o arquivo index.html na rota raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/tarefas', (req, res) => {
    res.json(tarefas);
});

app.post('/api/tarefas', (req, res) => {
    const { texto } = req.body;
    tarefas.push({ id: Date.now(), texto });
    res.status(201).json({ message: 'Tarefa adicionada' });
});

app.put('/api/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;

    const tarefa = tarefas.find(t => t.id == id);
    if (tarefa) {
        tarefa.texto = texto;
        res.json({ message: 'Tarefa atualizada' });
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

app.delete('/api/tarefas/:id', (req, res) => {
    tarefas = tarefas.filter(t => t.id != req.params.id);
    res.json({ message: 'Tarefa removida' });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
