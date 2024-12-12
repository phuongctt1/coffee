const BASE_URL = "http://localhost:8080";

function fetchCustom(path, option) {
  return fetch(`${BASE_URL}${path}`, option);
}

export function getCoffee() {
  return fetchCustom("/coffee");
}

export function createCoffee(formData) {
  return fetchCustom("/coffee", {
    method: "POST",
    body: formData,
  });
}

export function updateCoffee(id, updateData) {
  return fetchCustom(`/coffee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });
}
