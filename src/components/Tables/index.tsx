'use client'
import { DataTable } from "./DataTable/data-table";
import { columns } from "./DataTable/columns";
import useTableList from "@/hooks/useTableList";
import TableMapping from "../TableMapping";

type TablesProps = {
  eventId: number;
}

const Tables = ({ eventId }: TablesProps) => {
  const { tableList } = useTableList(eventId);
  return (
    <div>
      <TableMapping tableList={tableList} />
      <DataTable columns={columns} data={tableList} eventId={eventId} />
    </div>
  );
}

export default Tables;