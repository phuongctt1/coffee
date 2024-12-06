function getApi() {
  fetch("http://localhost:8080/coffee")
    .then((response) => response.json())
    .then((json) => {
      renderCourses(json);
    });
}

function renderCourses(courses) {
  const listContent = document.querySelector(".list");

  const html = courses.map((course) => {
    return `
      <div class="item" data-id="${course.id}">
        <img src="${course.thumbnail}" width="100px" height="100px" style="display: block; margin: 0 auto;">
        <div class="content">
          <h4>${course.title}</h4>
          <h5>${course.description}</h5>
        </div>
        <button class="button-edit">Edit</button>
        <form class="form__update hidden">
          <input type="text" name="title" value="${course.title}">
          <input class="description" type="text" name="description" value="${course.description}">
          
          <button type="button" class="button-update">Update</button>
        </form>
      </div>
    `;
  });

  listContent.innerHTML = html.join("");

  document.querySelectorAll(".button-edit").forEach((btn) => {
    btn.addEventListener("click", (event) => handleEdit(event));
  });

  document.querySelectorAll(".button-update").forEach((btn) => {
    btn.addEventListener("click", (event) => handleUpdate(event));
  });
}

function handleEdit(event) {
  const parentElement = event.target.closest(".item");
  const formUpdateElement = parentElement.querySelector(".form__update");
  const contentElement = parentElement.querySelector(".content");
  const btnEditElement = parentElement.querySelector(".button-edit");

  formUpdateElement.classList.add("active");
  contentElement.classList.add("hidden");
  btnEditElement.classList.add("hidden");
}

function handleCreateForm() {
  const form = document.querySelector(".form");
  form.onsubmit = function (event) {
    event.preventDefault();

    let formData = new FormData(form);

    fetch("http://localhost:8080/coffee", { method: "POST", body: formData })
      .then((response) => response.json())
      .then((json) => {
        getApi();
      });
  };
}

function handleUpdate(event) {
  const parentElement = event.target.closest(".item");
  const id = parentElement.getAttribute("data-id");
  const title = parentElement.querySelector('input[name="title"]').value;
  const description = parentElement.querySelector(
    'input[name="description"]'
  ).value;

  const updateData = {
    title: title,
    description: description,
  };

  fetch(`http://localhost:8080/coffee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error with the request:", response);
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Update response:", data);
      getApi();
    })
    .catch((error) => {
      console.error("Error updating item:", error);
    });
}

getApi();
handleCreateForm();
