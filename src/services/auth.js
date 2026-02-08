export const logout = async () => {
  const token = localStorage.getItem("token");

  return fetch("http://127.0.0.1:8000/api/v1/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
