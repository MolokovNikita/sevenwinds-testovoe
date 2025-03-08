import styles from "./SideBar.module.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ReactNode } from "react";
import { JSX } from "react";

type MenuItem = {
  text: string;
  icon?: ReactNode;
};
const menuItems: MenuItem[] = [
  { text: "По проекту", icon: <DashboardIcon /> },
  { text: "Объекты", icon: <DashboardIcon /> },
  { text: "РД", icon: <DashboardIcon /> },
  { text: "МТО", icon: <DashboardIcon /> },
  { text: "СМР", icon: <DashboardIcon /> },
  { text: "График", icon: <DashboardIcon /> },
  { text: "МиМ", icon: <DashboardIcon /> },
  { text: "Рабочие", icon: <DashboardIcon /> },
  { text: "Капвложения", icon: <DashboardIcon /> },
  { text: "Бюджет", icon: <DashboardIcon /> },
  { text: "Финансирование", icon: <DashboardIcon /> },
  { text: "Панорамы", icon: <DashboardIcon /> },
  { text: "Камеры", icon: <DashboardIcon /> },
  { text: "Поручения", icon: <DashboardIcon /> },
  { text: "Контрагенты", icon: <DashboardIcon /> },
];

export default function SideBar(): JSX.Element {
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menu}>
        {menuItems.map(
          ({ text, icon }: MenuItem): JSX.Element => (
            <li
              key={text}
              className={`${text === "СМР" ? `${styles.menu_item} ${styles.selected}` : styles.menu_item}`}
            >
              <div className={styles.item_icon}>{icon}</div>
              <span>{text}</span>
            </li>
          ),
        )}
      </ul>
    </aside>
  );
}
