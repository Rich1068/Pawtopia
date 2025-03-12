/* eslint-disable @typescript-eslint/no-explicit-any */
import serverAPI from "./axios";

export const sendEmail = async (
  fullname: string,
  email: string,
  message: string
) => {
  try {
    const response = await serverAPI.post(
      "/email/send",
      { fullname, email, message },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to send email";
  }
};
