import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li><Link href="/">Coleta</Link></li>
        <li><Link href="/servico">Destino</Link></li>
        <li><Link href="/cadastro">Cadastro</Link></li>
      </ul>
    </nav>
  );
}
