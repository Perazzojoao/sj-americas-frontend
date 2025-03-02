'use client'

import useUserList from "@/hooks/useUserList";
import { DataTable } from "./DataTable/data-table";
import { columns } from "./DataTable/columns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Users = () => {
  const { userList } = useUserList()
  const route = useRouter()
  useEffect(() => {
    route.refresh()
  }, [])

  return (
    <div>
      <DataTable columns={columns} data={userList} />
    </div>
  );
}

export default Users;