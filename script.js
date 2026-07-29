const STORAGE_KEY = 'carrinhoCafe';

function obterCarrinho() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao ler carrinho:', error);
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, preco) {
  const carrinho = obterCarrinho();
  const itemExistente = carrinho.find((item) => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

function removerDoCarrinho(nome) {
  const carrinho = obterCarrinho();
  const novoCarrinho = carrinho.filter((item) => item.nome !== nome);
  salvarCarrinho(novoCarrinho);
  return novoCarrinho;
}

function renderizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  const totalElemento = document.getElementById('total');
  const botaoPagar = document.getElementById('botao-pagar');

  if (!lista) return;

  const carrinho = obterCarrinho();
  lista.innerHTML = '';

  let soma = 0;

  if (carrinho.length === 0) {
    const vazio = document.createElement('li');
    vazio.textContent = 'Carrinho vazio';
    lista.appendChild(vazio);
  } else {
    carrinho.forEach((item) => {
      const li = document.createElement('li');
      const subtotal = item.preco * item.quantidade;
      soma += subtotal;

      const info = document.createElement('span');
      info.textContent = `${item.nome} x${item.quantidade} - ${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

      const botaoRemover = document.createElement('button');
      botaoRemover.type = 'button';
      botaoRemover.className = 'remover-item';
      botaoRemover.dataset.nome = item.nome;
      botaoRemover.textContent = 'Remover';

      li.appendChild(info);
      li.appendChild(botaoRemover);
      lista.appendChild(li);
    });
  }

  if (totalElemento) {
    totalElemento.textContent = `Total: ${soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  }

  if (botaoPagar) {
    botaoPagar.disabled = carrinho.length === 0;
    botaoPagar.textContent = carrinho.length === 0 ? 'Pagar' : 'Pagar';
  }
}

function configurarBotaoAdicionar() {
  const botoes = document.querySelectorAll('.adicionar');

  botoes.forEach((botao) => {
    botao.addEventListener('click', (evento) => {
      evento.preventDefault();

      const nome = botao.dataset.nome;
      const preco = Number(botao.dataset.preco);

      adicionarAoCarrinho(nome, preco);
      renderizarCarrinho();

      botao.textContent = 'Adicionado';
      botao.disabled = true;

      setTimeout(() => {
        botao.textContent = 'Adicionar ao Carrinho';
        botao.disabled = false;
      }, 1500);
    });
  });
}

document.addEventListener('click', (evento) => {
  if (evento.target.classList.contains('remover-item')) {
    const nome = evento.target.dataset.nome;
    removerDoCarrinho(nome);
    renderizarCarrinho();
  }

  if (evento.target.id === 'botao-pagar') {
    window.alert('Pagamento em desenvolvimento.');
  }
});

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[^\p{ASCII}]/gu, '')
    .toLowerCase();
}

function configurarBusca() {
  const campoBusca = document.getElementById('buscar-pedido');
  const searchBox = document.getElementById('search-box');
  const botaoBusca = document.querySelector('.search-toggle');

  if (!campoBusca || !searchBox || !botaoBusca) return;

  botaoBusca.addEventListener('click', () => {
    const estaAtivo = searchBox.classList.toggle('ativo');

    if (estaAtivo) {
      campoBusca.focus();
      const menu = document.getElementById('menu');
      if (menu) {
        menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      campoBusca.value = '';
      const cards = document.querySelectorAll('.menu .box');
      cards.forEach((card) => {
        card.style.display = 'block';
      });
    }
  });

  campoBusca.addEventListener('input', (evento) => {
    const termo = normalizarTexto(evento.target.value.trim());
    const cards = document.querySelectorAll('.menu .box');

    cards.forEach((card) => {
      const nome = normalizarTexto(card.querySelector('h3')?.textContent || '');
      const deveMostrar = nome.includes(termo);
      card.style.display = deveMostrar ? 'block' : 'none';
    });
  });
}

function configurarMenuMobile() {
  const botaoMenu = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');

  if (!botaoMenu || !navbar) return;

  botaoMenu.addEventListener('click', () => {
    navbar.classList.toggle('ativo');
    botaoMenu.setAttribute('aria-expanded', navbar.classList.contains('ativo'));
  });

  navbar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('ativo');
      botaoMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCarrinho();
  configurarBotaoAdicionar();
  configurarBusca();
  configurarMenuMobile();
});
