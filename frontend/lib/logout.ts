import axios from "axios";

const handleLogout = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  try {
    const response=axios.post(`${backendUrl}/auth/logout`,null,{withCredentials:true})
  } catch (err) {}
};
