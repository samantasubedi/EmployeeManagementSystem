import axios from "axios";

export const getOrganizationUsers = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const response = await axios.get(`${backendUrl}/organization/users`, {
    withCredentials: true,
  });
console.log(response.data.role)
  return response.data;
};
