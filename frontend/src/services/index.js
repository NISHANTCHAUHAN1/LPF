import axiosInstance from "@/api/axiosInstance";

export const registerService = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
};

export const loginService = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};

export const checkAuthService = async (formData) => {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
};

export async function mediaUploadService(formData) {
  const { data } = await axiosInstance.post("/media/upload", formData);
  return data;
}
