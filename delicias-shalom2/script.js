// Dados iniciais do cardápio e gastos
let cardapio = [
    { nome: "PRATO SIMPLES", preco: 20.00 },
    { nome: "PRATO 2", preco: 23.00 },
    { nome: "PRATO 3 COMPLETO", preco: 33.00 },
    { nome: "Tacacá", preco: 25.00 },
    { nome: "Vatapá", preco: 15.00 },
    { nome: "Farofa de camarão", preco: 13.00 },
    { nome: "Torta de banana", preco: 10.00 },
    { nome: "Pirarucu de casaca", preco: 15.00 },
    { nome: "Pudim", preco: 10.00 },
    { nome: "SUCOS NATURAIS (300ml)", preco: 10.00 }
];

const gastosCategorias = [
    "Comidas",
    "Uber",
    "Pessoas Trabalhando",
    "Compras no Evento/Outras Barracas",
    "Outros"
];

// Elementos HTML
const produtoSelect = document.getElementById('produto');
const valorUnitarioInput = document.getElementById('valorUnitario');
const formVenda = document.getElementById('formVenda');
const formGasto = document.getElementById('formGasto');
const gastoCategoriaSelect = document.getElementById('gastoCategoria');

const dataResumoSpan = document.getElementById('dataResumo');
const resumoDiaAnteriorP = document.getElementById('resumoDiaAnterior');
const totalVendasDiaP = document.getElementById('totalVendasDia');
const totalItensVendidosP = document.getElementById('totalItensVendidos');
const vendasDinheiroSpan = document.getElementById('vendasDinheiro');
const vendasCreditoSpan = document.getElementById('vendasCredito');
const vendasDebitoSpan = document.getElementById('vendasDebito');
const vendasPixSpan = document.getElementById('vendasPix');
const totalGastosDiaP = document.getElementById('totalGastosDia');
const gastosUberDiaP = document.getElementById('gastosUberDia');
const lucroLiquidoDiaP = document.getElementById('lucroLiquidoDia');

const btnComecarDia = document.getElementById('btnComecarDia');
const btnFinalizarDia = document.getElementById('btnFinalizarDia');

const relatorioFinalDiaSection = document.getElementById('relatorio-final-dia');
const dataRelatorioFinalSpan = document.getElementById('dataRelatorioFinal');
const relatorioTotalVendasSpan = document.getElementById('relatorioTotalVendas');
const relatorioDinheiroSpan = document.getElementById('relatorioDinheiro');
const relatorioCreditoSpan = document.getElementById('relatorioCredito');
const relatorioDebitoSpan = document.getElementById('relatorioDebito');
const relatorioPixSpan = document.getElementById('relatorioPix');
const relatorioTotalGastosSpan = document.getElementById('relatorioTotalGastos');
const relatorioLucroSpan = document.getElementById('relatorioLucro');
const btnVoltarAoControle = document.getElementById('btnVoltarAoControle');

const formGerenciarCardapio = document.getElementById('formGerenciarCardapio');
const novoPratoNomeInput = document.getElementById('novoPratoNome');
const novoPratoPrecoInput = document.getElementById('novoPratoPreco');
const cardapioList = document.getElementById('cardapioList');

const filtroDataHistoricoInput = document.getElementById('filtroDataHistorico');
const btnLimparFiltroHistorico = document.getElementById('btnLimparFiltroHistorico');
const listaHistoricoVendas = document.getElementById('listaHistoricoVendas');
const listaHistoricoGastos = document.getElementById('listaHistoricoGastos');

const totalGastosAcumuladosSpan = document.getElementById('totalGastosAcumulados');
const primeiroRegistroGastoSpan = document.getElementById('primeiroRegistroGasto');
const gastosPorCategoriaTotalUl = document.getElementById('gastosPorCategoriaTotal');
const listaTodosGastosUl = document.getElementById('listaTodosGastos');

// Elementos do Menu Lateral
const menuIcon = document.getElementById('menuIcon');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('closeMenu');
const menuLinks = document.querySelectorAll('.side-menu a');


// Funções de Inicialização e Atualização
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function carregarCardapio() {
    const cardapioSalvo = localStorage.getItem('cardapio');
    if (cardapioSalvo) {
        cardapio = JSON.parse(cardapioSalvo);
    }
    popularSelectProduto();
    renderizarListaCardapio();
}

function salvarCardapio() {
    localStorage.setItem('cardapio', JSON.stringify(cardapio));
    popularSelectProduto();
    renderizarListaCardapio();
}

function popularSelectProduto() {
    produtoSelect.innerHTML = '<option value="">Selecione o produto</option>';
    cardapio.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nome;
        option.textContent = `${item.nome} (${formatarMoeda(item.preco)})`;
        produtoSelect.appendChild(option);
    });
}

function renderizarListaCardapio() {
    cardapioList.innerHTML = '';
    cardapio.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.nome} - ${formatarMoeda(item.preco)}</span>
            <button data-index="${index}">Remover</button>
        `;
        cardapioList.appendChild(li);
    });

    document.querySelectorAll('#cardapioList button').forEach(button => {
        button.addEventListener('click', (e) => {
            const indexToRemove = e.target.dataset.index;
            removerPrato(indexToRemove);
        });
    });
}

function removerPrato(index) {
    cardapio.splice(index, 1);
    salvarCardapio();
}


function popularSelectGastoCategoria() {
    gastoCategoriaSelect.innerHTML = '<option value="">Selecione a categoria</option>';
    gastosCategorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        gastoCategoriaSelect.appendChild(option);
    });
}

// Converte a data para o formato 'YYYY-MM-DD' para comparação
function converterDataParaFormatoISO(dataStr) {
    const [dia, mes, ano] = dataStr.split('/');
    const diaFormatado = dia.padStart(2, '0');
    const mesFormatado = mes.padStart(2, '0');
    return `${ano}-${mesFormatado}-${diaFormatado}`;
}

// Converte a data para o formato 'DD/MM/YYYY' para exibição
function converterDataParaExibicao(dataStrISO) {
    if (!dataStrISO) return '';
    const [ano, mes, dia] = dataStrISO.split('-');
    return `${dia}/${mes}/${ano}`;
}


function obterDadosDoDia(dataStringExibicao) {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const gastos = JSON.parse(localStorage.getItem('gastos') || '[]');

    const vendasDoDia = vendas.filter(v => v.data === dataStringExibicao);
    const gastosDoDia = gastos.filter(g => g.data === dataStringExibicao);

    let totalVendas = 0;
    let totalItens = 0;
    let vendasPorPagamento = { Dinheiro: 0, Crédito: 0, Débito: 0, Pix: 0 };
    let totalGastos = 0;
    let gastosUber = 0;

    vendasDoDia.forEach(venda => {
        totalVendas += venda.valorTotal;
        totalItens += venda.quantidade;
        vendasPorPagamento[venda.formaPagamento] += venda.valorTotal;
    });

    gastosDoDia.forEach(gasto => {
        totalGastos += gasto.valor;
        if (gasto.categoria === "Uber") {
            gastosUber += gasto.valor;
        }
    });

    const lucroLiquido = totalVendas - totalGastos;

    return {
        totalVendas,
        totalItens,
        vendasPorPagamento,
        totalGastos,
        gastosUber,
        lucroLiquido,
        vendasDoDia,
        gastosDoDia
    };
}

function atualizarResumoDiario() {
    const hoje = new Date();
    const hojeStr = hoje.toLocaleDateString('pt-BR');
    dataResumoSpan.textContent = hojeStr;

    const dadosDoDia = obterDadosDoDia(hojeStr);

    totalVendasDiaP.textContent = formatarMoeda(dadosDoDia.totalVendas);
    totalItensVendidosP.textContent = `${dadosDoDia.totalItens} unidades`;
    vendasDinheiroSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Dinheiro);
    vendasCreditoSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Crédito);
    vendasDebitoSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Débito);
    vendasPixSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Pix);
    totalGastosDiaP.textContent = formatarMoeda(dadosDoDia.totalGastos);
    gastosUberDiaP.textContent = formatarMoeda(dadosDoDia.gastosUber);
    lucroLiquidoDiaP.textContent = formatarMoeda(dadosDoDia.lucroLiquido);

    // Lógica para mostrar o resumo do dia anterior ou aviso de novo dia
    const ultimaDataRegistrada = localStorage.getItem('ultimaDataVendas');
    if (ultimaDataRegistrada && ultimaDataRegistrada !== hojeStr) {
        const dadosDiaAnterior = obterDadosDoDia(ultimaDataRegistrada);
        resumoDiaAnteriorP.textContent = `Resumo do dia ${ultimaDataRegistrada} (último dia finalizado): Total de Vendas: ${formatarMoeda(dadosDiaAnterior.totalVendas)}, Lucro: ${formatarMoeda(dadosDiaAnterior.lucroLiquido)}`;
        resumoDiaAnteriorP.style.display = 'block';
    } else if (ultimaDataRegistrada === hojeStr && dadosDoDia.totalVendas === 0 && dadosDoDia.totalGastos === 0) {
        resumoDiaAnteriorP.textContent = 'Novo dia iniciado. Comece a registrar suas vendas!';
        resumoDiaAnteriorP.style.display = 'block';
    } else {
         resumoDiaAnteriorP.style.display = 'none';
    }
}

function exibirHistorico(dataFiltroISO = null) {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const gastos = JSON.parse(localStorage.getItem('gastos') || '[]');

    listaHistoricoVendas.innerHTML = '';
    listaHistoricoGastos.innerHTML = '';

    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);
    umMesAtras.setHours(0, 0, 0, 0);

    const vendasComIndex = vendas.map(v => ({...v, id: v.id || new Date(converterDataParaFormatoISO(v.data)).getTime() + Math.random()}));
    const gastosComIndex = gastos.map(g => ({...g, id: g.id || new Date(converterDataParaFormatoISO(g.data)).getTime() + Math.random()}));

    const vendasFiltradas = vendasComIndex.filter(venda => {
        const dataVenda = new Date(converterDataParaFormatoISO(venda.data));
        return dataVenda >= umMesAtras && (dataFiltroISO ? venda.data === converterDataParaExibicao(dataFiltroISO) : true);
    }).sort((a, b) => new Date(converterDataParaFormatoISO(b.data)) - new Date(converterDataParaFormatoISO(a.data)));

    const gastosFiltrados = gastosComIndex.filter(gasto => {
        const dataGasto = new Date(converterDataParaFormatoISO(gasto.data));
        return dataGasto >= umMesAtras && (dataFiltroISO ? gasto.data === converterDataParaExibicao(dataFiltroISO) : true);
    }).sort((a, b) => new Date(converterDataParaFormatoISO(b.data)) - new Date(converterDataParaFormatoISO(a.data)));


    if (vendasFiltradas.length === 0) {
        listaHistoricoVendas.innerHTML = '<li>Nenhuma venda registrada no período.</li>';
    } else {
        vendasFiltradas.forEach(venda => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${venda.data} - ${venda.produto} (${venda.quantidade}x) - ${formatarMoeda(venda.valorTotal)} (${venda.formaPagamento})</span>
                <div class="historico-item-actions">
                    <button class="btn-excluir" data-type="vendas" data-id="${venda.id}">Excluir</button>
                </div>
            `;
            listaHistoricoVendas.appendChild(li);
        });
    }

    if (gastosFiltrados.length === 0) {
        listaHistoricoGastos.innerHTML = '<li>Nenhum gasto registrado no período.</li>';
    } else {
        gastosFiltrados.forEach(gasto => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${gasto.data} - ${gasto.descricao} (${gasto.categoria}) - ${formatarMoeda(gasto.valor)}</span>
                <div class="historico-item-actions">
                    <button class="btn-excluir" data-type="gastos" data-id="${gasto.id}">Excluir</button>
                </div>
            `;
            listaHistoricoGastos.appendChild(li);
        });
    }

    document.querySelectorAll('#historico-registros .btn-excluir').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const idToDelete = parseFloat(e.target.dataset.id);
            if (confirm(`Tem certeza que deseja excluir este ${type === 'vendas' ? 'venda' : 'gasto'}?`)) {
                excluirItem(type, idToDelete);
            }
        });
    });
}

function excluirItem(type, idToDelete) {
    let items = JSON.parse(localStorage.getItem(type) || '[]');
    items = items.filter(item => item.id !== idToDelete); 
    
    localStorage.setItem(type, JSON.stringify(items));
    
    alert(`${type === 'vendas' ? 'Venda' : 'Gasto'} excluído com sucesso!`);
    atualizarResumoDiario();
    exibirHistorico(filtroDataHistoricoInput.value);
    atualizarControleTotalGastos();
}


function atualizarControleTotalGastos() {
    const gastos = JSON.parse(localStorage.getItem('gastos') || '[]');
    let totalAcumulado = 0;
    let dataMaisAntiga = null;
    
    listaTodosGastosUl.innerHTML = ''; // Limpa a lista detalhada antes de renderizar

    if (gastos.length > 0) {
        gastos.sort((a, b) => new Date(converterDataParaFormatoISO(a.data)) - new Date(converterDataParaFormatoISO(b.data)));
        dataMaisAntiga = gastos[0].data;

        gastos.forEach(gasto => {
            totalAcumulado += gasto.valor;
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${gasto.data} - ${gasto.descricao} (${gasto.categoria}) - ${formatarMoeda(gasto.valor)}</span>
                <div class="historico-item-actions">
                    <button class="btn-excluir" data-type="gastos" data-id="${gasto.id}">Excluir</button>
                    <button class="btn-ver-resumo-dia" data-date="${gasto.data}">Ver Resumo do Dia</button>
                </div>
            `;
            listaTodosGastosUl.appendChild(li);
        });
    } else {
        listaTodosGastosUl.innerHTML = '<li>Nenhum gasto registrado.</li>';
    }

    totalGastosAcumuladosSpan.textContent = formatarMoeda(totalAcumulado);
    primeiroRegistroGastoSpan.textContent = dataMaisAntiga || 'Nenhum gasto registrado.';

    document.querySelectorAll('#controle-gastos-total .btn-excluir').forEach(button => {
        button.addEventListener('click', (e) => {
            const idToDelete = parseFloat(e.target.dataset.id);
            if (confirm('Tem certeza que deseja excluir este gasto?')) {
                excluirItem('gastos', idToDelete);
            }
        });
    });

    document.querySelectorAll('#controle-gastos-total .btn-ver-resumo-dia').forEach(button => {
        button.addEventListener('click', (e) => {
            const dataGasto = e.target.dataset.date;
            mostrarRelatorioFinalDia(dataGasto);
            document.getElementById('relatorio-final-dia').scrollIntoView({ behavior: 'smooth' });
        });
    });
}


// Função para mostrar o relatório final do dia, adaptada para uma data específica
function mostrarRelatorioFinalDia(dataStrExibicao) {
    const dadosDoDia = obterDadosDoDia(dataStrExibicao);

    dataRelatorioFinalSpan.textContent = dataStrExibicao;
    relatorioTotalVendasSpan.textContent = formatarMoeda(dadosDoDia.totalVendas);
    relatorioDinheiroSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Dinheiro);
    relatorioCreditoSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Crédito);
    relatorioDebitoSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Débito);
    relatorioPixSpan.textContent = formatarMoeda(dadosDoDia.vendasPorPagamento.Pix);
    relatorioTotalGastosSpan.textContent = formatarMoeda(dadosDoDia.totalGastos);
    relatorioLucroSpan.textContent = formatarMoeda(dadosDoDia.lucroLiquido);

    // Esconde o controle principal e mostra o relatório
    document.getElementById('registrar-venda').style.display = 'none';
    document.getElementById('registrar-gasto').style.display = 'none';
    document.getElementById('gerenciar-cardapio').style.display = 'none';
    document.getElementById('resumo-diario').style.display = 'none';
    document.getElementById('historico-registros').style.display = 'none';
    document.getElementById('dia-status').style.display = 'none';
    document.getElementById('controle-gastos-total').style.display = 'none';
    
    relatorioFinalDiaSection.style.display = 'block';
}


// Event Listeners para formulários
formVenda.addEventListener('submit', (e) => {
    e.preventDefault();
    const agora = new Date();
    const hoje = agora.toLocaleDateString('pt-BR');
    const timestampUnico = agora.getTime(); 

    const produtoNome = produtoSelect.value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const formaPagamento = document.getElementById('pagamento').value;
    const valorUnitario = parseFloat(valorUnitarioInput.value);
    const valorTotal = valorUnitario * quantidade;

    if (!produtoNome || !formaPagamento || isNaN(quantidade) || isNaN(valorUnitario) || quantidade <= 0 || valorUnitario <= 0) {
        alert('Por favor, preencha todos os campos da venda corretamente.');
        return;
    }

    const venda = {
        id: timestampUnico,
        data: hoje,
        produto: produtoNome,
        quantidade: quantidade,
        formaPagamento: formaPagamento,
        valorUnitario: valorUnitario,
        valorTotal: valorTotal
    };

    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    vendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(vendas));

    alert('Venda registrada com sucesso!');
    formVenda.reset();
    produtoSelect.value = '';
    valorUnitarioInput.value = '';
    atualizarResumoDiario();
    exibirHistorico();
    atualizarControleTotalGastos();
});

formGasto.addEventListener('submit', (e) => {
    e.preventDefault();
    const agora = new Date();
    const hoje = agora.toLocaleDateString('pt-BR');
    const timestampUnico = agora.getTime(); 

    const categoria = gastoCategoriaSelect.value;
    const descricao = document.getElementById('gastoDescricao').value;
    const valor = parseFloat(document.getElementById('gastoValor').value);

    if (!categoria || !descricao || isNaN(valor) || valor <= 0) {
        alert('Por favor, preencha todos os campos do gasto corretamente.');
        return;
    }

    const gasto = {
        id: timestampUnico,
        data: hoje,
        categoria: categoria,
        descricao: descricao,
        valor: valor
    };

    const gastos = JSON.parse(localStorage.getItem('gastos') || '[]');
    gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));

    alert('Gasto registrado com sucesso!');
    formGasto.reset();
    gastoCategoriaSelect.value = '';
    atualizarResumoDiario();
    exibirHistorico();
    atualizarControleTotalGastos();
});

formGerenciarCardapio.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = novoPratoNomeInput.value.trim();
    const preco = parseFloat(novoPratoPrecoInput.value);

    if (!nome || isNaN(preco) || preco <= 0) {
        alert('Por favor, preencha o nome e um preço válido para o novo prato.');
        return;
    }

    if (cardapio.some(item => item.nome.toLowerCase() === nome.toLowerCase())) {
        alert('Este prato já existe no cardápio.');
        return;
    }

    cardapio.push({ nome, preco });
    salvarCardapio();
    alert(`Prato "${nome}" adicionado com sucesso!`);
    formGerenciarCardapio.reset();
});


btnFinalizarDia.addEventListener('click', () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const dadosDoDia = obterDadosDoDia(hoje);

    if (dadosDoDia.totalVendas === 0 && dadosDoDia.totalGastos === 0) {
        alert('Não há vendas ou gastos para finalizar o dia de hoje.');
        return;
    }

    mostrarRelatorioFinalDia(hoje);
    alert('Dia de vendas finalizado! Veja o relatório.');
});

btnVoltarAoControle.addEventListener('click', () => {
    document.getElementById('registrar-venda').style.display = 'block';
    document.getElementById('registrar-gasto').style.display = 'block';
    document.getElementById('gerenciar-cardapio').style.display = 'block';
    document.getElementById('resumo-diario').style.display = 'block';
    document.getElementById('historico-registros').style.display = 'block';
    document.getElementById('dia-status').style.display = 'flex';
    document.getElementById('controle-gastos-total').style.display = 'block';
    
    relatorioFinalDiaSection.style.display = 'none';
});

btnComecarDia.addEventListener('click', () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const ultimaDataRegistrada = localStorage.getItem('ultimaDataVendas');

    if (ultimaDataRegistrada && ultimaDataRegistrada === hoje) {
        alert('O dia de hoje já está em andamento. Continue registrando vendas!');
    } else {
        localStorage.setItem('ultimaDataVendas', hoje);
        alert('Novo dia de vendas iniciado! Boas vendas!');
        atualizarResumoDiario();
        exibirHistorico();
        atualizarControleTotalGastos();
    }
});

// Event listeners para o histórico
filtroDataHistoricoInput.addEventListener('change', (e) => {
    exibirHistorico(e.target.value);
});

btnLimparFiltroHistorico.addEventListener('click', () => {
    filtroDataHistoricoInput.value = '';
    exibirHistorico();
});


// Lógica do Menu Lateral
menuIcon.addEventListener('click', () => {
    sideMenu.style.width = '250px';
});

closeMenuBtn.addEventListener('click', () => {
    sideMenu.style.width = '0';
});

// Fecha o menu ao clicar em um link (para rolar para a seção)
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        sideMenu.style.width = '0';
    });
});


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarCardapio();
    popularSelectGastoCategoria();
    atualizarResumoDiario();
    exibirHistorico();
    atualizarControleTotalGastos();
});

// Atualiza o valor unitário ao selecionar um produto
produtoSelect.addEventListener('change', () => {
    const produtoSelecionado = cardapio.find(item => item.nome === produtoSelect.value);
    if (produtoSelecionado) {
        valorUnitarioInput.value = produtoSelecionado.preco.toFixed(2);
    } else {
        valorUnitarioInput.value = '';
    }
});