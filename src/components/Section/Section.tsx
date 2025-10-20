"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Styles from "./Section.module.css";
import Article, { ArticleRef } from "@/components/Article/Article";
import Footer from "@/components/Footer/Footer";
import { getCadastros, CadastroData } from "@/utils/storage";

export default function Section() {
  const router = useRouter();
  const articleRef = useRef<ArticleRef | null>(null);

  const [formData, setFormData] = useState({
    coleta: "",
    razaoSocial: "",
    responsavel: "",
    galpao: "",
    imagem: "",
  });

  const [cadastros, setCadastros] = useState<CadastroData>({
    coletas: [],
    razoesSociais: [],
    responsaveis: [],
  });

  const [observacaoRapida, setObservacaoRapida] = useState("");
  const [observacoes, setObservacoes] = useState<string[]>([]);
  const [textarea, setTextarea] = useState("");
  const [textareaList, setTextareaList] = useState<string[]>([]);

  useEffect(() => {
    setCadastros(getCadastros());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (base64: string) => {
    setFormData((prev) => ({ ...prev, imagem: base64 }));
  };

  // Adiciona observação rápida
  const addObservacaoRapida = (descricao: string) => {
    if (!observacaoRapida.trim()) return;
    setObservacoes([...observacoes, `${observacaoRapida} - ${descricao}`]);
    setObservacaoRapida("");
  };

  // Remove observação rápida pelo índice
  const removeObservacao = (index: number) => {
    setObservacoes((prev) => prev.filter((_, i) => i !== index));
  };

  // Adiciona observação detalhada
  const addTextarea = () => {
    if (!textarea.trim()) return;
    setTextareaList([...textareaList, textarea]);
    setTextarea("");
  };

  // Remove observação detalhada pelo índice
  const removeTextarea = (index: number) => {
    setTextareaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.coleta || !formData.razaoSocial || !formData.responsavel) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const registros = JSON.parse(localStorage.getItem("registros") || "[]");

    if (formData.imagem.length > 500000) {
      alert("Imagem muito grande, selecione outra menor.");
      return;
    }

    const dataHora = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    registros.push({ ...formData, dataHora });
    localStorage.setItem("registros", JSON.stringify(registros));
    alert("Cadastro realizado!");

    setFormData({
      coleta: "",
      razaoSocial: "",
      responsavel: "",
      galpao: "",
      imagem: "",
    });
  };

  return (
    <section className={Styles.section}>
      <form className={Styles.form} onSubmit={handleSubmit}>
        {/* Linha 1: Coleta + Razão Social */}
        <div className={Styles.linha1}>
          <div className={Styles.dropdownContainer}>
            <label htmlFor="coleta">Coleta:</label>
            <select
              id="coleta"
              name="coleta"
              value={formData.coleta}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              {cadastros.coletas.length > 0 ? (
                cadastros.coletas.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))
              ) : (
                <option disabled>Nenhuma coleta cadastrada</option>
              )}
            </select>
          </div>

          <div className={Styles.dropdownContainerDois}>
            <label htmlFor="razaoSocial">Razão Social:</label>
            <select
              id="razaoSocial"
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              {cadastros.razoesSociais.length > 0 ? (
                cadastros.razoesSociais.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))
              ) : (
                <option disabled>Nenhuma razão social cadastrada</option>
              )}
            </select>
          </div>
        </div>

        {/* Linha 2: Responsável + Galpão */}
        <div className={Styles.linha2}>
          <div className={Styles.dropdownContainerTres}>
            <label htmlFor="responsavel">Responsável:</label>
            <select
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              {cadastros.responsaveis.length > 0 ? (
                cadastros.responsaveis.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))
              ) : (
                <option disabled>Nenhum responsável cadastrado</option>
              )}
            </select>
          </div>

          <div className={Styles.inputContainer}>
            <label htmlFor="galpao">Galpão:</label>
            <input
              type="text"
              id="galpao"
              name="galpao"
              placeholder="Digite o fornecedor"
              value={formData.galpao}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Coluna de botões + Article */}
        <div className={Styles.buttonsArticleContainer}>
          <div className={Styles.buttonsColumn}>
            <button
              type="submit"
              className={`${Styles.button} ${Styles.cadastrarBtn}`}
            >
              CADASTRAR
            </button>

            <button
              type="button"
              className={`${Styles.button} ${Styles.listaBtn}`}
              onClick={() => router.push("/lista")}
            >
              LISTA
            </button>
            <button
              type="button"
              className={Styles.button}
              onClick={() => articleRef.current?.selectImage()}
            >
              SELECIONAR IMAGEM
            </button>
            <button
              type="button"
              className={Styles.button}
              onClick={() => articleRef.current?.takePhoto()}
            >
              FOTO
            </button>
          </div>

          <Article ref={articleRef} onImageSelect={handleImageSelect} />
        </div>

        {/* Linha 3: Observações (Footer) */}
        <footer>
          <Footer
            observacaoRapida={observacaoRapida}
            setObservacaoRapida={setObservacaoRapida}
            observacoes={observacoes}
            addObservacaoRapida={addObservacaoRapida}
            textarea={textarea}
            setTextarea={setTextarea}
            textareaList={textareaList}
            addTextarea={addTextarea}
            removeObservacao={removeObservacao} // ✅ função passada
            removeTextarea={removeTextarea}   // ✅ função passada
          />
        </footer>
      </form>
    </section>
  );
}
