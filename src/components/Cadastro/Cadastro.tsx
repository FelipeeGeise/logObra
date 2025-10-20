"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // importa o useRouter
import { getCadastros, saveCadastros, CadastroData } from "@/utils/storage";
import styles from "./Cadastro.module.css";

export default function Cadastro() {
  const router = useRouter(); // instância do router

  const [isClient, setIsClient] = useState(false); // garante renderização só no cliente
  const [dados, setDados] = useState<CadastroData>({
    coletas: [],
    razoesSociais: [],
    responsaveis: [],
  });
  const [novoItem, setNovoItem] = useState({ tipo: "coletas", valor: "" });

  useEffect(() => {
    setIsClient(true);
    setDados(getCadastros());
  }, []);

  function handleAdd() {
    if (!novoItem.valor.trim()) return;
    const atualizado = { ...dados };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (atualizado[novoItem.tipo].includes(novoItem.valor.trim())) {
      alert("Este valor já foi cadastrado!");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    atualizado[novoItem.tipo] = [...atualizado[novoItem.tipo], novoItem.valor.trim()];
    setDados(atualizado);
    saveCadastros(atualizado);
    setNovoItem({ ...novoItem, valor: "" });
  }

  function handleRemove(tipo: keyof CadastroData, index: number) {
    const atualizado = { ...dados };
    atualizado[tipo] = atualizado[tipo].filter((_, i) => i !== index);
    setDados(atualizado);
    saveCadastros(atualizado);
  }

  // Evita hydration error
  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <h1>Cadastro de Opções</h1>

      <div className={styles.inputArea}>
        <select
          value={novoItem.tipo}
          onChange={(e) => setNovoItem({ ...novoItem, tipo: e.target.value })}
        >
          <option value="coletas">Coleta</option>
          <option value="razoesSociais">Razão Social</option>
          <option value="responsaveis">Responsável</option>
        </select>

        <input
          type="text"
          placeholder="Novo valor"
          value={novoItem.valor}
          onChange={(e) => setNovoItem({ ...novoItem, valor: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
        />

        <button onClick={handleAdd}>Adicionar</button>

        {/* Botão de voltar ao início da coleta */}
        <button onClick={() => router.push("/")}>Voltar à Coleta</button>
      </div>

      <div className={styles.listsContainer}>
        {(["coletas", "razoesSociais", "responsaveis"] as (keyof CadastroData)[]).map((tipo) => (
          <div key={tipo} className={styles.listBox}>
            <h2>
              {tipo === "coletas"
                ? "Coletas"
                : tipo === "razoesSociais"
                ? "Razões Sociais"
                : "Responsáveis"}
            </h2>
            {dados[tipo].length === 0 ? (
              <p>Nenhum item cadastrado</p>
            ) : (
              <ul>
                {dados[tipo].map((item, i) => (
                  <li key={i}>
                    {item} <button onClick={() => handleRemove(tipo, i)}>Excluir</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
