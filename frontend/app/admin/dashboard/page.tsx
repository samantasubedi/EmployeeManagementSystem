"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrganizationUsers } from "@/lib/user";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type User = {
  id: string;
  username: string;
  email: string;
  role: string | null;
  description: string | null;
  organizationId: string;
};

export default function UsersPage() {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["organization-users"],
    queryFn: getOrganizationUsers,
  });
  const { data, isLoading, isError, error } = query;

  useEffect(() => {
    if (isError) {
      toast.error((error as Error).message || "Failed to fetch users");
    }
  }, [isError, error]);
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
        <Icon icon="line-md:loading-loop" className="text-3xl" />
        <p className="text-3xl">Loading users...</p>
      </div>
    );
  }
  const users: User[] = data.details;


  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Users</h1>
        <div className="flex justify-end ">
          <Button
            className="bg-purple-700 font-bold hover:bg-purple-600 cursor-pointer"
            onClick={() => {
              router.push("/admin/create-user");
            }}
          >
            Create users
          </Button>
         
        </div>
        
        <p className="text-gray-500">Total Users: {users.length}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left">Username</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-5 py-4">{user.username}</td>
                <td className="px-5 py-4">{user.email}</td>
                <td className="px-5 py-4">
                  <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-700">
                    {user.role ?? "Member"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {user.description || "no description added"}
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
