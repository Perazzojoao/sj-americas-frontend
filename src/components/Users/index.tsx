'use client'

import useUserList from "@/hooks/useUserList";
import { DataTable } from "./DataTable/data-table";
import { columns } from "./DataTable/columns";

const Users = () => {
  const { userList } = useUserList()

  return (
    <div>
      <DataTable columns={columns} data={userList} />
    </div>
  );
}

export default Users;