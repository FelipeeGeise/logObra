"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Styles from "./ListaDeDestino.module.css";

interface Registro {
  obra: string;
  responsavel: string;
  observacao: string;
  imagem?: string;
  dataHora: string;
}

export default function ListaDeDestino() {
  const router = useRouter();

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [registroSelecionado, setRegistroSelecionado] = useState<number | null>(null);
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState<"idle" | "senha" | "sucesso" | "erro">("idle");
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

  // ✅ Carrega registros do localStorage ao iniciar
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("registrosDestino") || "[]");
    setRegistros(dados);
  }, []);

  // ✅ Abre modal de confirmação de exclusão
  const abrirModal = (index: number) => {
    setRegistroSelecionado(index);
    setSenha("");
    setStatus("senha");
  };

  // ✅ Confirma exclusão do registro
  const confirmarExclusao = () => {
    if (senha === "FT2025" && registroSelecionado !== null) {
      const novosRegistros = registros.filter((_, i) => i !== registroSelecionado);
      localStorage.setItem("registrosDestino", JSON.stringify(novosRegistros));
      setRegistros(novosRegistros);
      setStatus("sucesso");
    } else {
      setStatus("erro");
    }
  };

  return (
    <div className={Styles.lista}>
      <h2 className={Styles.titulo}>Lista de Destinos Registrados</h2>

      <button className={Styles.voltarButton} onClick={() => router.push("/")}>
        ⬅ Voltar para Destino
      </button>

      {registros.length === 0 ? (
        <p className={Styles.mensagem}>Nenhum registro encontrado.</p>
      ) : (
        <table className={Styles.table}>
          <thead>
            <tr>
              <th>Obra</th>
              <th>Responsável</th>
              <th>Observação</th>
              <th>Imagem</th>
              <th>Data/Hora</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i}>
                <td>{r.obra}</td>
                <td>{r.responsavel}</td>
                <td>{r.observacao || "-"}</td>
                <td className={Styles.imageCell} onClick={() => r.imagem && setImagemSelecionada(r.imagem)}>
                  {r.imagem ? (
                    <Image
                      src={r.imagem}
                      alt="preview"
                      fill
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                      unoptimized
                    />
                  ) : (
                    "-"
                  )}
                  {r.imagem && <div className={Styles.lupaOverlay}></div>}
                </td>
                <td>{r.dataHora}</td>
                <td>
                  <button className={Styles.excluir} onClick={() => abrirModal(i)}>
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
        <div className={Styles.modal}>
          <div className={Styles.modalContent}>
            {status === "senha" && (
              <>
                <button className={Styles.fecharModal} onClick={() => setStatus("idle")}>×</button>
                <Image src="/informacao.png" alt="informacao" width={50} height={50} />
                <p>Digite a senha para excluir:</p>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha"
                  className={Styles.inputSenha}
                />
                <button className={Styles.buttonOk} onClick={confirmarExclusao}>OK</button>
              </>
            )}
            {status === "sucesso" && (
              <>
                <Image src="/correto.png" alt="correto" width={50} height={50} />
                <p>Cadastro excluído com sucesso!</p>
                <button className={Styles.buttonFechar} onClick={() => setStatus("idle")}>Fechar</button>
              </>
            )}
            {status === "erro" && (
              <>
                <Image src="/incorreto.png" alt="incorreto" width={50} height={50} />
                <p>Senha incorreta!</p>
                <button className={Styles.buttonTentarNovamente} onClick={() => setStatus("senha")}>Tentar novamente</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de visualização da imagem */}
      {imagemSelecionada && (
        <div className={Styles.modal} onClick={() => setImagemSelecionada(null)}>
          <div className={Styles.modalImagemContent}>
            <button className={Styles.fecharModal} onClick={() => setImagemSelecionada(null)}>×</button>
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
