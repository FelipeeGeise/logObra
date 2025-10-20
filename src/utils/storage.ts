export type CadastroData = {
  coletas: string[];
  razoesSociais: string[];
  responsaveis: string[];
};

const STORAGE_KEY = "cadastros";

export function getCadastros(): CadastroData {
  if (typeof window === "undefined") return { coletas: [], razoesSociais: [], responsaveis: [] };
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { coletas: [], razoesSociais: [], responsaveis: [] };
}

export function saveCadastros(data: CadastroData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// Função para limpar um tipo específico (coletas, razoesSociais ou responsaveis)
export function clearCadastro(tipo: keyof CadastroData) {
  if (typeof window === "undefined") return;
  const dados = getCadastros();
  dados[tipo] = []; // limpa o array selecionado
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}
