interface Entity {
  id: string;
}

type Column<T> = {
  header: string;
  accessor: (row: T) => unknown;
};

interface TableProps<T> {
  cols: Column<T>[];
  data: T[];
  onDelete?: (id: string) => void;
}

export default function Table<T extends Entity>({
  cols,
  data,
  onDelete,
}: TableProps<T>) {
  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          {cols.map((col) => (
            <th key={String(col.accessor)} className="px-6 py-3">
              {col.header}
            </th>
          ))}
          {onDelete && <th className="px-6 py-3 text-right">Actions</th>};
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-gray-200 bg-white text-gray-800"
          >
            {cols.map((col) => (
              <td key={String(col.accessor)} className="px-6 py-3">
                {String(col.accessor(row))}
              </td>
            ))}

            {onDelete && (
              <td className="px-6 py-3 text-right">
                <button
                  className="bg-red-500 cursor-pointer text-xs hover:bg-red-700 duration-100 p-1 text-white rounded-sm"
                  onClick={() => onDelete(row.id)}
                >
                  Eliminar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
