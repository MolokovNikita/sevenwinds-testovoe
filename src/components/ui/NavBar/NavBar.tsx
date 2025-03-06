import ReplyIcon from "@mui/icons-material/Reply";
import AppsIcon from "@mui/icons-material/Apps";
import styles from "./NavBar.module.scss";
import { JSX } from "react";

export default function NavBar(): JSX.Element {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <ul className={styles.nav_list}>
          <li className={styles.nav_item}>
            <AppsIcon />
          </li>
          <li className={styles.nav_item}>
            <ReplyIcon />
          </li>
          <li className={` ${styles.nav_item} ${styles.selected}`}>Просмотр</li>
          <li className={styles.nav_item}>Управление</li>
        </ul>
      </nav>
    </header>
  );
}
