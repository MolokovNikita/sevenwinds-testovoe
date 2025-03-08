import Layout from "../../components/layouts/Layout.tsx";
import styles from "./Dashboard.module.scss";
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { API_URL } from "../../config/config.ts";
import { E_ID } from "../../constants/constants.ts";
import axios from "axios";
import { JSX } from "react";

type Row = {
  id: number;
  child: Row[];
  equipmentCosts: number | null;
  estimatedProfit: number | null;
  machineOperatorSalary: number | null;
  mainCosts: number | null;
  materials: number | null;
  mimExploitation: number | null;
  overheads: number | null;
  rowName: string | null;
  salary: number | null;
  supportCosts: number | null;
  total: number | null;
};

export default function Dashboard(): JSX.Element {
  const cellRefs = useRef<Map<number, HTMLTableCellElement>>(new Map());
  const [cellHeights, setCellHeights] = useState<Map<number, number>>(
    new Map(),
  );
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/v1/outlay-rows/entity/${E_ID}/row/list`)
      .then((res) => {
        console.log(res.data);
        setRows(res.data);
      });
  }, []);

  useEffect(() => {
    const newHeights = new Map<number, number>();
    cellRefs.current.forEach((cell, id) => {
      if (cell) newHeights.set(id, cell.offsetHeight);
    });
    setCellHeights(newHeights);
  }, [rows]);

  //Children
  const getTotalChildrenHeight = (row: Row): number => {
    if (!hasChildren(row)) return 0;
    return (row.child as Row[]).reduce((acc: number, child: Row): number => {
      const childHeight = cellHeights.get(child.id) || 0;
      return acc + childHeight + getTotalChildrenHeight(child);
    }, 0);
  };

  const hasChildren = (row: Row): boolean => {
    return row.child && row.child.length > 0 && row.child[0] !== null;
  };

  const countDirectChildren = (row: Row): number => {
    return hasChildren(row) ? row.child.length : 0;
  };

  //handlers
  const handleChange = (id: number, field: keyof Row, value: string) => {
    // setRows((prevRows) =>
    //   prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    // );
    console.log(id, field, value);
  };
  const handleDelete = (id: number) => {
    const deleteRowRecursively = (rows: Row[]): Row[] => {
      return rows
        .filter((row) => row.id !== id) // Удаляем элемент на текущем уровне
        .map((row) => ({ ...row, child: deleteRowRecursively(row.child) })); // Проверяем вложенные
    };

    setRows((prevRows) => deleteRowRecursively(prevRows));
  };

  const handleAdd = (id: number) => {
    const newRow: Row = {
      id: Date.now(),
      child: [],
      equipmentCosts: null,
      estimatedProfit: null,
      machineOperatorSalary: null,
      mainCosts: null,
      materials: null,
      mimExploitation: null,
      overheads: null,
      rowName: null,
      salary: null,
      supportCosts: null,
      total: null,
    };

    const addRowRecursively = (rows: Row[]): Row[] => {
      return rows.map(
        (row) =>
          row.id === id
            ? { ...row, child: [...row.child, newRow] }
            : { ...row, child: addRowRecursively(row.child) }, // Рекурсивно ищем нужный элемент
      );
    };

    setRows((prevRows) => addRowRecursively(prevRows));
  };

  const getPadding = (level: number) => ({
    paddingLeft: `${level * 15 + 5}px`,
  });

  const renderRows = (items: Row[], level = 0): JSX.Element[] => {
    return items.map((row: Row): JSX.Element => {
      const children: Row[] = hasChildren(row) ? (row.child as Row[]) : [];
      let totalHeight: number =
        row.child.length > 1
          ? getTotalChildrenHeight(row)
          : (cellHeights.get(row.id) || 0) * countDirectChildren(row);
      if (row.child.length > 1) {
        const lastChild: Row = row.child[row.child.length - 1];
        if (lastChild) {
          if (hasChildren(lastChild)) {
            const lastChildChildrenHeight: number =
              getTotalChildrenHeight(lastChild);
            totalHeight -= lastChildChildrenHeight + 1;
          }
        }
      }
      const isRoot: boolean = level === 0;

      return (
        <React.Fragment key={row.id}>
          <tr className={styles.row}>
            <td
              className={styles.layer_num}
              style={getPadding(level)}
              ref={(el: HTMLTableDataCellElement | null): void => {
                if (el) cellRefs.current.set(row.id, el);
              }}
            >
              <div className={styles.layer_container}>
                <img
                  className={styles.document_logo}
                  src="/document.svg"
                  alt="Логотип документа"
                  onClick={() => handleAdd(row.id)}
                />
                <img
                  className={styles.trashfill_logo}
                  src="/TrashFill.svg"
                  alt="Логотип удаления"
                  onClick={() => handleDelete(row.id)}
                />
                {!isRoot && <div className={styles.vertical_line} />}
                {hasChildren(row) && (
                  <div
                    className={styles.horizontal_line}
                    style={{
                      height: `${totalHeight - 9}px`,
                    }}
                  />
                )}
              </div>
            </td>
            <td>
              <div className={styles.inputWrapper}>
                <input
                  className={styles.editableInput}
                  defaultValue={row.rowName ?? ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(row.id, "rowName", e.target.value)
                  }
                />
              </div>
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="number"
                defaultValue={row.salary ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(row.id, "salary", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="number"
                defaultValue={row.equipmentCosts ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(row.id, "equipmentCosts", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="number"
                defaultValue={row.overheads ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(row.id, "overheads", e.target.value)
                }
              />
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="number"
                defaultValue={row.estimatedProfit ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(row.id, "estimatedProfit", e.target.value)
                }
              />
            </td>
          </tr>
          {hasChildren(row) && renderRows(children, level + 1)}
        </React.Fragment>
      );
    });
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
        <tbody>{renderRows(rows)}</tbody>
      </table>
    </Layout>
  );
}
