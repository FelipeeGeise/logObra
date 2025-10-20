"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Styles from "./Aside.module.css";
import { getCadastros, CadastroData } from "@/utils/storage";

interface FormData {
  obra: string;
  responsavel: string;
  observacao: string;
  imagem: string;
}

export default function Aside() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    obra: "",
    responsavel: "",
    observacao: "",
    imagem: "",
  });

  const [cadastros, setCadastros] = useState<CadastroData>({
    coletas: [],
    razoesSociais: [],
    responsaveis: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCadastros(getCadastros());
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Selecionar imagem do dispositivo
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  // ✅ Quando o usuário escolhe uma imagem
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagem: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // ✅ Tirar foto com a câmera
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      setFormData((prev) => ({ ...prev, imagem: dataUrl }));

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      alert("Não foi possível acessar a câmera.");
      console.error(err);
    }
  };

  // ✅ Salvar registro e redirecionar
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.obra || !formData.responsavel) {
      alert("Preencha Obra e Responsável!");
      return;
    }

    const registros = JSON.parse(localStorage.getItem("registrosDestino") || "[]");
    const dataHora = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    registros.push({ ...formData, dataHora });
    localStorage.setItem("registrosDestino", JSON.stringify(registros));

    alert("Destino salvo com sucesso!");
    setFormData({ obra: "", responsavel: "", observacao: "", imagem: "" });

    // Redireciona para lista de destino
    router.push("/listaDeDestino");
  };

  return (
    <div className={Styles.caixaAside}>
      <section className={Styles.sectionAside}>
        <form className={Styles.formAside} onSubmit={handleSubmit}>
          {/* Seletor Obra + Responsável */}
          <div className={Styles.selectGroup}>
            <div className={Styles.selectContainer}>
              <label htmlFor="obra">Obra:</label>
              <select
                id="obra"
                name="obra"
                className={Styles.selectAside}
                value={formData.obra}
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
                  <option disabled>Nenhuma obra cadastrada</option>
                )}
              </select>
            </div>

            <div className={Styles.selectContainer}>
              <label htmlFor="responsavel">Responsável:</label>
              <select
                id="responsavel"
                name="responsavel"
                className={Styles.select}
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
          </div>

          {/* Imagem + Observação */}
          <div className={Styles.imgObs}>
            <div className={Styles.divImgAside}>
              <h2>Imagem</h2>
              <div className={Styles.imgAside}>
                {formData.imagem ? (
                  <Image
                    src={formData.imagem}
                    alt="Imagem selecionada"
                    width={120}
                    height={120}
                  />
                ) : (
                  <Image
                    src="/fotografica.png"
                    alt="Imagem ilustrativa"
                    width={120}
                    height={120}
                  />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <div className={Styles.buttonFoto}>
                <button type="button" className={Styles.selecionar} onClick={handleSelectImage}>
                  Selecionar Imagem
                </button>
                <button type="button" className={Styles.tirarFoto} onClick={handleTakePhoto}>
                  Foto
                </button>
              </div>
            </div>

            <div className={Styles.texto}>
              <label htmlFor="observacao">Obs:</label>
              <textarea
                id="observacao"
                name="observacao"
                placeholder="Digite sua observação..."
                className={Styles.textearea}
                value={formData.observacao}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Botões */}
          <div className={Styles.salvaLista}>
            <button type="submit" className={Styles.buttonSalvar}>
              Salvar
            </button>
            <button
              type="button"
              className={Styles.buttonLista}
              onClick={() => router.push("/listaDeDestino")}
            >
              Lista
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
