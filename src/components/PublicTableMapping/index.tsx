'use client'

import useTableList from "@/hooks/useTableList";
import TableMapping from "../TableMapping";

type PublicTablesProps = {
  eventId: number;
}

const PublicTableMapping = ({ eventId }: PublicTablesProps) => {
  const { tableList } = useTableList(eventId);
  return (
    <TableMapping tableList={tableList} />
  );
}

export default PublicTableMapping;