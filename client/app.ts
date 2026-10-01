interface ProdutoView { id: number; nome: string; preco: number }

const form = document.querySelector<HTMLFormElement>("#produto-form")!;
const nome = document.querySelector<HTMLInputElement>("#nome")!;
const preco = document.querySelector<HTMLInputElement>("#preco")!;
const salvar = document.querySelector<HTMLButtonElement>("#salvar")!;
const cancelar = document.querySelector<HTMLButtonElement>("#cancelar")!;
const mensagem = document.querySelector<HTMLParagraphElement>("#mensagem")!;
const lista = document.querySelector<HTMLTableSectionElement>("#produtos")!;
let editando: number | null = null;

function avisar(texto: string, erro = false): void {
  mensagem.textContent = texto;
  mensagem.className = erro ? "error" : "success";
}

async function requisitar<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.mensagem ?? "Não foi possível concluir a operação");
  }
  return response.status === 204 ? undefined as T : response.json();
}

function limpar(): void {
  editando = null;
  form.reset();
  salvar.textContent = "Cadastrar";
  cancelar.hidden = true;
  document.querySelector("#form-title")!.textContent = "Novo produto";
}

async function carregar(): Promise<void> {
  const produtos = await requisitar<ProdutoView[]>("/produtos");
  lista.replaceChildren();
  document.querySelector<HTMLParagraphElement>("#vazio")!.hidden = produtos.length > 0;
  for (const produto of produtos) {
    const row = document.createElement("tr");
    for (const texto of [String(produto.id), produto.nome, produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })]) {
      const cell = document.createElement("td");
      cell.textContent = texto;
      row.append(cell);
    }
    const acoes = document.createElement("td");
    const editar = document.createElement("button");
    editar.textContent = "Editar";
    editar.className = "secondary";
    editar.setAttribute("aria-label", `Editar ${produto.nome}`);
    editar.onclick = async () => {
      try {
        const atual = await requisitar<ProdutoView>(`/produtos/${produto.id}`);
        editando = atual.id;
        nome.value = atual.nome;
        preco.value = String(atual.preco);
        salvar.textContent = "Salvar alterações";
        cancelar.hidden = false;
        document.querySelector("#form-title")!.textContent = "Editar produto";
        avisar("");
        nome.focus();
      } catch (error) { avisar((error as Error).message, true); }
    };
    const excluir = document.createElement("button");
    excluir.textContent = "Excluir";
    excluir.className = "danger";
    excluir.setAttribute("aria-label", `Excluir ${produto.nome}`);
    excluir.onclick = async () => {
      if (!confirm(`Excluir o produto “${produto.nome}”?`)) return;
      excluir.disabled = true;
      try {
        await requisitar<void>(`/produtos/${produto.id}`, { method: "DELETE" });
        if (editando === produto.id) limpar();
        await carregar();
        avisar("Produto excluído.");
      } catch (error) { avisar((error as Error).message, true); }
      finally { excluir.disabled = false; }
    };
    acoes.append(editar, excluir);
    row.append(acoes);
    lista.append(row);
  }
}

form.onsubmit = async (event) => {
  event.preventDefault();
  salvar.disabled = true;
  const edicao = editando !== null;
  try {
    await requisitar<ProdutoView>(edicao ? `/produtos/${editando}` : "/produtos", {
      method: edicao ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.value, preco: Number(preco.value) })
    });
    limpar();
    await carregar();
    avisar(edicao ? "Produto atualizado." : "Produto cadastrado.");
  } catch (error) { avisar((error as Error).message, true); }
  finally { salvar.disabled = false; }
};
cancelar.onclick = () => { limpar(); avisar(""); };
document.querySelector<HTMLButtonElement>("#recarregar")!.onclick = () => {
  carregar().then(() => avisar("Lista atualizada.")).catch((error: Error) => avisar(error.message, true));
};
carregar().catch((error: Error) => avisar(error.message, true));
