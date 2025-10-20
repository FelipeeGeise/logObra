"use client";

import React from "react";
import Styles from "./Footer.module.css";
import Image from "next/image";

interface FooterProps {
  observacaoRapida: string;
  setObservacaoRapida: React.Dispatch<React.SetStateAction<string>>;
  observacoes: string[];
  addObservacaoRapida: (descricao: string) => void;
  textarea: string;
  setTextarea: React.Dispatch<React.SetStateAction<string>>;
  textareaList: string[];
  addTextarea: () => void;
  removeObservacao: (index: number) => void;
  removeTextarea: (index: number) => void;
}

export default function Footer({
  observacaoRapida,
  setObservacaoRapida,
  observacoes,
  addObservacaoRapida,
  textarea,
  setTextarea,
  textareaList,
  addTextarea,
  removeObservacao,
  removeTextarea,
}: FooterProps) {
  return (
    <div className={Styles.footer}>
      {/* Observação Rápida */}
      <div className={Styles.observacaoContainer}>
        <label htmlFor="observacaoRapida">Observação rápida:</label>
        <input
          type="text"
          id="observacaoRapida"
          placeholder="Digite uma observação"
          value={observacaoRapida}
          onChange={(e) => setObservacaoRapida(e.target.value)}
        />

        <div className={Styles.buttonGroup}>
          <button
            className={Styles.buttonObs}
            type="button"
            onClick={() => addObservacaoRapida("Não foi faturado")}
          >
            NÃO FOI FATURADO
          </button>
        </div>

        <ul className={Styles.observacoesList}>
          {observacoes.map((obs, i) => (
            <li key={i} className={Styles.observacaoItem}>
              <span>{obs}</span>
              <button
                className={Styles.deleteButton}
                onClick={() => removeObservacao(i)}
              >
                <Image
                  src="/lixeira.png"
                  alt="Excluir"
                  width={16}
                  height={16}
                  unoptimized
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Observação Detalhada */}
      <div className={Styles.textareaContainer}>
        <label htmlFor="textarea">Observação detalhada:</label>
        <textarea
          id="textarea"
          value={textarea}
          onChange={(e) => setTextarea(e.target.value)}
          placeholder="Digite informações detalhadas"
          className={Styles.textarea}
        />

        <button type="button" className={Styles.buttonObs} onClick={addTextarea}>
          ADICIONAR
        </button>

        <ul className={Styles.textareaList}>
          {textareaList.map((item, i) => (
            <li key={i} className={Styles.textareaItem}>
              <span>{item}</span>
              <button
                className={Styles.deleteButton}
                onClick={() => removeTextarea(i)}
              >
                <Image
                  src="/lixeira.png"
                  alt="Excluir"
                  width={16}
                  height={16}
                  unoptimized
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
