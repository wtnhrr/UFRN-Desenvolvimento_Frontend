const lista = document.querySelector('#lista');
const input = document.querySelector('#tarefa');
const botao = document.querySelector('#adicionar');

function carregar() {
    fetch('/api/tarefas')
    .then(res => res.json())
    .then(data => {
        lista.innerHTML = '';
        data.forEach(tarefa => {
            let item = document.createElement('li');

            // Texto da tarefa
            let spanTexto = document.createElement('span');
            spanTexto.textContent = tarefa.texto;
            item.appendChild(spanTexto);

            // Botão Excluir
            let btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.onclick = () => deletar(tarefa.id);
            item.appendChild(btnExcluir);

            // Botão Editar
            let btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => {
                const inputEditar = document.createElement('input');
                inputEditar.type = 'text';
                inputEditar.value = tarefa.texto;

                // Substituir o texto pelo input
                item.replaceChild(inputEditar, spanTexto);

                // Salvar a edição ao pressionar Enter
                inputEditar.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const novoTexto = inputEditar.value;
                        if (novoTexto) {
                            fetch('/api/tarefas/' + tarefa.id, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ texto: novoTexto })
                            }).then(() => carregar());
                        }
                    }
                });

                // Voltar texto original
                inputEditar.addEventListener('blur', () => {
                    carregar();
                });
            };
            item.appendChild(btnEditar);

            lista.appendChild(item);
        });
    });
}

function adicionar() {

    const texto = input.value.trim();
    if (texto === '') {
        alert('Digite uma nota!');
        return;
    }

    fetch('/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
    }).then(() => {
        input.value = '';
        carregar();
    });
}

function editar(id, textoAtual) {
    const novoTexto = prompt('Edite a tarefa:', textoAtual);
    if (novoTexto) {
        fetch('/api/tarefas/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: novoTexto })
        }).then(() => carregar());
    }
}

function deletar(id) {
    fetch('/api/tarefas/' + id, { method: 'DELETE' })
    .then(() => carregar());
}

botao.onclick = adicionar;
carregar();
