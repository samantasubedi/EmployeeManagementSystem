"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrganizationUsers } from "@/lib/user";

type User = {
  id: string;
  username: string;
  email: string;
  role: string | null;
  description: string | null;
  organizationId: string;
};

export default function UsersPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["organization-users"],
    queryFn: getOrganizationUsers,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>;
  }

  const users: User[] = data.details;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Users</h1>
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
                <td className="px-5 py-4">{user.description || "-"}</td>
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
