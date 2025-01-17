'use client'
import { table } from "@/@types";
import { DataTable } from "./DataTable/data-table";
import { columns } from "./DataTable/columns";
import useTableList from "@/hooks/useTableList";

type TablesProps = {
  eventId: number;
}

const Tables = ({ eventId }: TablesProps) => {
  const { tableList } = useTableList(eventId);
  return (
    <div>
      <DataTable columns={columns} data={tableList} eventId={eventId} />
    </div>
  );
}

export default Tables;