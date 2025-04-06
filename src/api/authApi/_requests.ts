import axios from "../axiosInstance";

const login = async (email: string, password: string) => {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data;
};

const register = async (name: string, email: string, password: string) => {
    const res = await axios.post("/api/auth/register", { name, email, password });
    return res.data;
};

export { login, register };