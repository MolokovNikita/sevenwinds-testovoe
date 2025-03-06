import styles from "./ProjectNavBar.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { JSX } from "react";

export default function ProjectNavBar(): JSX.Element {
  return (
    <div className={styles.title}>
      <div className={styles.project_info}>
        <h5 className={styles.project_name}>Название проекта</h5>
        <h6 className={styles.project_abbreviation}>Аббревиатура</h6>
        <KeyboardArrowDownIcon className={styles.project_menu} />
      </div>
      <div className={styles.selected_project}>
        Строительно-монтажные работы
      </div>
    </div>
  );
}
