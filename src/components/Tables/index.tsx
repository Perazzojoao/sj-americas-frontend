import { table } from "@/@types";
import { DataTable } from "./DataTable/data-table";
import { columns } from "./DataTable/columns";

type TablesProps = {
  eventId: number;
  tableList: table[]
}

const Tables = ({ eventId, tableList }: TablesProps) => {
  return (
    <div>
      <DataTable columns={columns} data={tableList} />
    </div>
  );
}

export default Tables;