import type { DataTableProps } from "mantine-datatable";
import { DataTable as MantineDataTable } from "mantine-datatable";

export function DataTable<T>(props: DataTableProps<T>) {
  return <MantineDataTable {...props} />;
}
