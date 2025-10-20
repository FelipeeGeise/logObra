"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Lista.module.css";

// Interface que define os campos do cadastro
interface Registro {
  coleta: string;
  razaoSocial: string;
  responsavel: string;
  galpao?: string;
  imagem?: string;
  dataHora: string;
}

export default function Lista() {
  const router = useRouter();

  // Estado que guarda todos os registros cadastrados
  const [registros, setRegistros] = useState<Registro[]>([]);

  // Guarda o índice do registro selecionado para exclusão
  const [registroSelecionado, setRegistroSelecionado] = useState<number | null>(null);

  // Estado da senha digitada no modal
  const [senha, setSenha] = useState("");

  // Estado do modal de exclusão: 
  // idle = fechado | senha = pedindo senha | sucesso = excluído | erro = senha incorreta
  const [status, setStatus] = useState<"idle" | "senha" | "sucesso" | "erro">("idle");

  // Estado para armazenar a imagem que será visualizada em tela cheia
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

  // Carregar registros salvos no localStorage quando o componente iniciar
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("registros") || "[]");
    setRegistros(data);
  }, []);

  // Abrir modal pedindo senha para excluir um registro
  const abrirModal = (index: number) => {
    setRegistroSelecionado(index);
    setSenha("");
    setStatus("senha");
  };

  // Confirmar exclusão do registro
  const confirmarExclusao = () => {
    if (senha === "FT2025" && registroSelecionado !== null) {
      // Remove o registro selecionado
      const novosRegistros = registros.filter((_, i) => i !== registroSelecionado);

      // Atualiza no localStorage
      localStorage.setItem("registros", JSON.stringify(novosRegistros));

      // Atualiza o estado
      setRegistros(novosRegistros);

      // Exibe mensagem de sucesso
      setStatus("sucesso");
    } else {
      // Se a senha estiver incorreta
      setStatus("erro");
    }
  };

  return (
    <div className={styles.lista}>
      {/* Título da página */}
      <h2 className={styles.titulo}>Lista de Cadastros</h2>

      {/* Botão para voltar para tela principal */}
      <button
        className={styles.voltarButton}
        onClick={() => router.push("/")}
      >
        Voltar para tela principal
      </button>

      {/* Se não houver registros, mostra mensagem */}
      {registros.length === 0 ? (
        <p className={styles.mensagem}>Nenhum cadastro encontrado.</p>
      ) : (
        /* Caso tenha registros, exibe a tabela */
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Coleta</th>
              <th>Razão Social</th>
              <th>Responsável</th>
              <th>Galpão</th>
              <th>Imagem</th>
              <th>Data/Hora</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i}>
                <td>{r.coleta}</td>
                <td>{r.razaoSocial}</td>
                <td>{r.responsavel}</td>
                <td>{r.galpao || "-"}</td>

                {/* Se houver imagem, mostra miniatura clicável */}
                <td
                  className={styles.imageCell}
                  onClick={() => r.imagem && setImagemSelecionada(r.imagem)} // abre modal de visualização
                  style={{ cursor: r.imagem ? "pointer" : "default" }}
                >
                  {r.imagem ? (
                    <Image
                      src={r.imagem}
                      alt="preview"
                      fill
                      style={{ objectFit: "contain", borderRadius: "8px" }}
                      unoptimized
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>{r.dataHora}</td>

                {/* Botão para excluir registro */}
                <td>
                  <button className={styles.excluir} onClick={() => abrirModal(i)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de senha / sucesso / erro */}
      {status !== "idle" && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {status === "senha" && (
              <>
                {/* Botão X para fechar o modal */}
                <button 
                  className={styles.fecharModal} 
                  onClick={() => setStatus("idle")}
                >
                  X
                </button>

                <Image src="/informacao.png" alt="informacao" width={50} height={50} />
                <p>Digite a senha para excluir:</p>

                {/* Campo para digitar a senha */}
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha"
                  className={styles.inputSenha}
                />

                {/* Botão confirmar exclusão */}
                <button className={styles.buttonOk} onClick={confirmarExclusao}>OK</button>
              </>
            )}

            {status === "sucesso" && (
              <>
                <Image src="/correto.png" alt="correto" width={50} height={50} />
                <p>Cadastro excluído com sucesso!</p>
                <button className={styles.buttonFechar} onClick={() => setStatus("idle")}>Fechar</button>
              </>
            )}

            {status === "erro" && (
              <>
                <Image src="/incorreto.png" alt="incorreto" width={50} height={50} />
                <p>Senha incorreta!</p>
                <button className={styles.buttonTentarNovamente} onClick={() => setStatus("senha")}>Tentar novamente</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de visualização da imagem em tamanho maior */}
      {imagemSelecionada && (
        <div className={styles.modal} onClick={() => setImagemSelecionada(null)}>
          <div className={styles.modalContent}>
            {/* Botão X para fechar modal */}
            <button 
              className={styles.fecharModal} 
              onClick={() => setImagemSelecionada(null)}
            >
              ×
            </button>

            {/* Exibe imagem em tamanho maior */}
            <Image 
              src={imagemSelecionada} 
              alt="Visualização" 
              width={400} 
              height={400} 
              style={{ objectFit: "contain" }} 
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
