import { createCoffee, updateCoffee, getCoffee } from "./api.js";

console.log("getCoffee", getCoffee);
console.log("");

export async function renderCoffee() {
  const listContent = document.querySelector(".list-coffee");
  try{
    const response = await getCoffee();
    if(!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred.");
    }

    const data = await response.json();
    if (data=="") {
      throw new Error("No data");
    }
    const html = data.map((coffee) => {
      return `
          <div class="item" data-id="${coffee.id}">
            <img src="${coffee.thumbnail}" width="100px" height="100px" style="display: block; margin: 0 auto;">
            <div class="content">
              <h4>${coffee.title}</h4>
              <h5>${coffee.description}</h5>
            </div>
            <button class="button-edit">Edit</button>
            <form class="form__update hidden">
              <input type="text" name="title" value="${coffee.title}">
              <input class="description" type="text" name="description" value="${coffee.description}">
              
              <button type="button" class="button-update">Update</button>
              <div class="error-item"></div>      
              
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
  }catch(error){
    const errorMessage = error.message;
    listContent.innerHTML = errorMessage;


  }
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

export function handleCreateCoffee() {
  const form = document.querySelector(".form");
  const errorElement = document.querySelector(".error-message");

  form.onsubmit = async function (event) {
    event.preventDefault();

    let formData = new FormData(form);

    try {
      const response = await createCoffee(formData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      }
      const data = await response.json();
      renderCoffee();
      form.reset();
      errorElement.innerHTML = "";
    } catch (error) {
      const errorMessage = error.message;
      console.log(error);
      console.log("error", errorMessage);
      errorElement.innerHTML = errorMessage;
    }
  };

}

export async function handleUpdate(event) {
  const parentElement = event.target.closest(".item");
  const id = parentElement.getAttribute("data-id");
  const titleInput = parentElement.querySelector('input[name="title"]');
  const descriptionInput = parentElement.querySelector(
    'input[name="description"]'
  );
  const errorElement = parentElement.querySelector('.error-item');

  const updateData = {
    title: titleInput.value,
    description: descriptionInput.value,
  };

  try {
    const response = await updateCoffee(id, updateData);
    console.log("id", id);
    if(!response.ok){
      const errorData = await response.json()
      throw new Error(errorData.message || "An error occurred.")
    }
    const data = await response.json();
    // renderCoffee();
    parentElement.querySelector("h4").innerText = updateData.title;
    parentElement.querySelector("h5").innerText = updateData.description;

    parentElement.querySelector(".form__update").classList.remove("active");
    parentElement.querySelector(".content").classList.remove("hidden");
    parentElement.querySelector(".button-edit").classList.remove("hidden");
    errorElement.innerHTML = ""
  } catch (error) {
    const errorMessage = error.message;
    console.log(error);
    errorElement.innerHTML = errorMessage
    console.log("error", errorMessage);
  }

}

renderCoffee();
handleCreateCoffee();
