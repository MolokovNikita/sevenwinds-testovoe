import Layout from "../../components/layouts/Layout.tsx";
import styles from "./Dashboard.module.scss";
import React from "react";

const initialRows = [
  { id: 1, name: "Item1", sum1: 313, sum2: 5, sum3: 318, parentId: null },
  { id: 2, name: "Item2", sum1: 313, sum2: 5, sum3: 318, parentId: 1 },
  { id: 3, name: "Item3", sum1: 313, sum2: 5, sum3: 318, parentId: 2 },
  { id: 4, name: "Item4", sum1: 313, sum2: 5, sum3: 318, parentId: 2 },
  { id: 5, name: "Item5", sum1: 313, sum2: 5, sum3: 318, parentId: null },
];

export default function Dashboard() {
  const getPadding = (level) => ({ paddingLeft: `${level * 15 + 5}px` });

  const renderRows = (parentId = null, level = 0) => {
    return initialRows
      .filter((row) => row.parentId === parentId)
      .map((row) => (
        <React.Fragment key={row.id}>
          <tr className={styles.row}>
            <td style={getPadding(level)}>
              <span>{row.name}</span>
            </td>
            <td>{row.sum1}</td>
            <td>{row.sum2}</td>
            <td>{row.sum3}</td>
          </tr>
          {renderRows(row.id, level + 1)}
        </React.Fragment>
      ));
  };

  return (
    <Layout>
      <table>
        <thead>
          <tr>
            <th>Уровень</th>
            <th>Наименование работ</th>
            <th>Основная з/п</th>
            <th>Оборудование</th>
            <th>Накладные расходы</th>
            <th>Сметная прибыль</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </Layout>
  );
}
