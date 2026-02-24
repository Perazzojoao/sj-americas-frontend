'use client'
import useTableList from "@/hooks/useTableList";
import { buildTableLayout } from "@/lib/tableLayout";
import { useMemo } from "react";
import TableMapping from "../TableMapping";
import { columns } from "./DataTable/columns";
import { DataTable } from "./DataTable/data-table";

type TablesProps = {
  eventId: number;
}

const Tables = ({ eventId }: TablesProps) => {
  const { tableList } = useTableList(eventId);
  const { tableListForDataTable } = useMemo(() => buildTableLayout(tableList), [tableList]);

  return (
    <div>
      <TableMapping tableList={tableList} />
      <DataTable columns={columns} data={tableListForDataTable} eventId={eventId} />
    </div>
  );
}

export default Tables;