import Layout from "../../components/layouts/Layout.tsx";
import styles from "./Dashboard.module.scss";
import React, {
  useEffect,
  useState,
  useRef,
  KeyboardEvent,
  RefObject,
} from "react";
import { API_URL } from "../../config/config.ts";
import { E_ID } from "../../constants/constants.ts";
import axios, { AxiosError, AxiosResponse } from "axios";
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
  parentId?: number | null;
};

type ServerResponse = {
  changed: Row[];
  current: Row;
};

const formatNumber = (value: number | null): string => {
  if (value === null) return "";
  return new Intl.NumberFormat("ru-RU").format(value);
};

export default function Dashboard(): JSX.Element {
  const rowName: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);
  const salary: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);
  const equipmentCosts: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);
  const overheads: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);
  const estimatedProfit: RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);

  const [parentId, setParentId] = useState<number | null>(null);

  const cellRefs = useRef<Map<number, HTMLTableCellElement>>(new Map());
  const [cellHeights, setCellHeights] = useState<Map<number, number>>(
    new Map(),
  );

  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/v1/outlay-rows/entity/${E_ID}/row/list`)
      .then((res) => {
        if (res.data.length > 0) setRows(res.data);
        else {
          const initialRow = createNewRow(null);
          setRows([initialRow]);
          setEditingRow(initialRow.id);
          setIsAdding(true);
        }
      })
      .catch((error: AxiosError) => {
        console.error("Ошибка при загрузке данных:", error.message);
        setErrorText(`Ошибка при загрузке данных: ${error.message}`);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const newHeights = new Map<number, number>();
    cellRefs.current.forEach((cell, id) => {
      if (cell) newHeights.set(id, cell.offsetHeight);
    });
    setCellHeights(newHeights);
  }, [rows]);

  const createNewRow = (parentId: number | null): Row => ({
    id: Date.now(),
    child: [],
    equipmentCosts: null,
    estimatedProfit: null,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    overheads: null,
    rowName: "",
    salary: null,
    supportCosts: 0,
    total: 0,
    parentId: parentId,
  });

  const hasChildren = (row: Row): boolean => {
    return row.child && row.child.length > 0 && row.child[0] !== null;
  };

  const countDirectChildren = (row: Row): number => {
    return hasChildren(row) ? row.child.length : 0;
  };

  const getTotalChildrenHeight = (row: Row): number => {
    if (!hasChildren(row)) return 0;
    return row.child.reduce((acc, child) => {
      const childHeight = cellHeights.get(child.id) || 0;
      return acc + childHeight + getTotalChildrenHeight(child);
    }, 0);
  };

  const handleEdit = (id: number) => {
    if (editingRow && editingRow !== id) {
      alert(
        "Завершите редактирование другой строки, чтобы редактировать новую",
      );
      return;
    }
    setEditingRow(id);
  };

  const handleBlur = (id: number, updatedRow: Row) => {
    if (
      !rowName.current?.value.trim() ||
      !salary.current?.value ||
      !equipmentCosts.current?.value
    ) {
      alert("Строка удалена: не все обязательные поля заполнены");
      const deleteLocalRow = (rows: Row[]): Row[] => {
        return rows
          .filter((row) => row.id !== id)
          .map((row) => ({
            ...row,
            child: deleteLocalRow(row.child),
          }));
      };

      // Обновляем состояние и сбрасываем флаги
      setRows((prev) => deleteLocalRow(prev));
      setIsAdding(false);
      setParentId(null);
      setEditingRow(null);
      return;
    } else {
      if (isAdding) {
        axios
          .post(`${API_URL}/v1/outlay-rows/entity/${E_ID}/row/create`, {
            equipmentCosts: parseFloat(
              equipmentCosts.current.value.replace(/\s/g, ""),
            ),
            estimatedProfit: parseFloat(
              (estimatedProfit.current?.value || "0").replace(/\s/g, ""),
            ),
            machineOperatorSalary: 0,
            mainCosts: 0,
            materials: 0,
            mimExploitation: 0,
            overheads: parseFloat(
              (overheads.current?.value || "0").replace(/\s/g, ""),
            ),
            parentId: parentId ? parentId : null,
            rowName: rowName.current.value,
            salary: parseFloat(salary.current.value.replace(/\s/g, "")),
            supportCosts: 0,
          })
          .then((res: AxiosResponse<ServerResponse>) => {
            console.log(res.data);
            const { current } = res.data;

            // Сохраняем временные дочерние элементы
            const tempRow = rows.find((row) => row.id === id);
            current.child = tempRow?.child || [];

            // Рекурсивная функция для замены ID
            const updateRows = (items: Row[]): Row[] =>
              items.map((item) => {
                if (item.id === id) {
                  return {
                    ...current,
                    child: updateRows(item.child),
                  };
                }
                return {
                  ...item,
                  child: updateRows(item.child),
                };
              });

            setRows((prev) => updateRows(prev));
          })
          .catch((error: AxiosError) => {
            console.log(error.message);
          })
          .finally(() => {
            setIsAdding(false);
            setParentId(null);
          });
      }
      if (!isAdding) {
        // сохранение
        axios
          .post(`${API_URL}/v1/outlay-rows/entity/${E_ID}/row/${id}/update`, {
            ...updatedRow,
            rowName: rowName.current.value,
            salary: parseFloat(salary.current.value.replace(/\s/g, "")),
            equipmentCosts: parseFloat(
              equipmentCosts.current.value.replace(/\s/g, ""),
            ),
            overheads: parseFloat(
              (overheads.current?.value || "0").replace(/\s/g, ""),
            ),
            estimatedProfit: parseFloat(
              (estimatedProfit.current?.value || "0").replace(/\s/g, ""),
            ),
          })
          .then((res: AxiosResponse<ServerResponse>) => {
            console.log("Данные успешно обновлены:", res.data);
          })
          .catch((error: AxiosError) => {
            console.error("Ошибка при обновлении данных:", error.message);
          });
      }
    }
    setEditingRow(null);
  };

  const handleKeyDown = (event: KeyboardEvent, id: number, updatedRow: Row) => {
    if (event.key === "Enter") {
      handleBlur(id, updatedRow);
    }
    if (event.key === "Escape") {
      handleBlur(id, updatedRow);
    }
  };

  const handleChange = (id: number, field: keyof Row, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${API_URL}/v1/outlay-rows/entity/${E_ID}/row/${id}/delete`)
      .then((res: AxiosResponse<ServerResponse>) => {
        if (res.data.changed.length === 0 && res.data.current === null) {
          const initialRow = createNewRow(null);
          setRows([initialRow]);
          setEditingRow(initialRow.id);
          setIsAdding(true);
          return;
        }
        const deleteRowRecursively = (rows: Row[]): Row[] => {
          return rows
            .filter((row) => row.id !== id)
            .map((row) => ({
              ...row,
              child: deleteRowRecursively(row.child),
            }));
        };

        setRows((prevRows) => deleteRowRecursively(prevRows));
      })
      .catch((error: AxiosError) => {
        console.error(error.message);
      });
  };

  const handleAdd = (id: number | null) => {
    if (editingRow) {
      alert("Завершите редактирование строки, чтобы создать новую");
      return;
    }

    setParentId(id);
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

    if (rows.length === 0) {
      setRows([newRow]);
    } else {
      const addRowRecursively = (rows: Row[]): Row[] => {
        return rows.map((row) =>
          row.id === id
            ? { ...row, child: [...row.child, newRow] }
            : { ...row, child: addRowRecursively(row.child) },
        );
      };
      setRows((prevRows) => addRowRecursively(prevRows));
    }
    setEditingRow(newRow.id);
    setIsAdding(true);
  };

  const getPadding = (level: number) => ({
    paddingLeft: `${level * 15 + 5}px`,
  });

  const renderRows = (items: Row[], level = 0): JSX.Element[] => {
    if (!Array.isArray(items)) return [];
    return items?.map((row) => {
      const children = hasChildren(row) ? row.child : [];
      let totalHeight =
        row.child?.length > 1
          ? getTotalChildrenHeight(row)
          : (cellHeights.get(row.id) || 0) * countDirectChildren(row);

      if (row.child?.length > 1) {
        const lastChild = row.child[row.child.length - 1];
        if (lastChild && hasChildren(lastChild)) {
          const lastChildChildrenHeight = getTotalChildrenHeight(lastChild);
          totalHeight -= lastChildChildrenHeight + 1;
        }
      }

      const isRoot = level === 0;
      const isEditing = editingRow === row.id;

      return (
        <React.Fragment key={row.id}>
          <tr className={`${styles.row} ${isEditing ? styles.editingRow : ""}`}>
            <td
              className={styles.layer_num}
              style={getPadding(level)}
              ref={(el) => {
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
                    style={{ height: `${totalHeight - 9}px` }}
                  />
                )}
              </div>
            </td>
            <td>
              <div className={styles.inputWrapper}>
                <input
                  defaultValue={row.rowName ?? ""}
                  className={styles.editableInput}
                  ref={isEditing ? rowName : null}
                  readOnly={!isEditing}
                  onDoubleClick={() => handleEdit(row.id)}
                  onChange={(e) =>
                    handleChange(row.id, "rowName", e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, row.id, row)}
                />
              </div>
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="string"
                defaultValue={formatNumber(row.salary) ?? ""}
                ref={isEditing ? salary : null}
                readOnly={!isEditing}
                onDoubleClick={() => handleEdit(row.id)}
                onChange={(e) => handleChange(row.id, "salary", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, row.id, row)}
              />
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="string"
                defaultValue={formatNumber(row.equipmentCosts) ?? ""}
                ref={isEditing ? equipmentCosts : null}
                readOnly={!isEditing}
                onDoubleClick={() => handleEdit(row.id)}
                onChange={(e) =>
                  handleChange(row.id, "equipmentCosts", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, row.id, row)}
              />
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="string"
                defaultValue={formatNumber(row.overheads) ?? ""}
                ref={isEditing ? overheads : null}
                readOnly={!isEditing}
                onDoubleClick={() => handleEdit(row.id)}
                onChange={(e) =>
                  handleChange(row.id, "overheads", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, row.id, row)}
              />
            </td>
            <td>
              <input
                className={styles.numberInput}
                type="string"
                defaultValue={formatNumber(row.estimatedProfit) ?? ""}
                ref={isEditing ? estimatedProfit : null}
                readOnly={!isEditing}
                onDoubleClick={() => handleEdit(row.id)}
                onChange={(e) =>
                  handleChange(row.id, "estimatedProfit", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, row.id, row)}
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
        {isLoading ? (
          <tbody className={styles.loader}></tbody>
        ) : (
          <tbody>{renderRows(rows)}</tbody>
        )}
        {errorText ? <td>{errorText}</td> : null}
      </table>
    </Layout>
  );
}
