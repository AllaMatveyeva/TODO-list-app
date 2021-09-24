const list = document.querySelector(".item__list");
const buttonAdd = document.querySelector(".form__button_add");
buttonAdd.onclick = addTask;
const buttonShow = document.querySelector(".button__add");
const modalWindow = document.querySelector(".module-window");

function createTask(task) {
  let { title, desc, user } = task;
  let titleUpperCase = title[0].toUpperCase() + title.slice(1);
  const li = document.querySelector(".li-pattern").cloneNode(true);
  li.classList.remove("li-pattern");
  li.querySelector(".task__title").textContent = titleUpperCase;
  li.querySelector(".task__desc").textContent = desc;
  li.querySelector(".footer__user").textContent = user;
  addButtons(li);
  render(list, "beforeend", li);
}

function render(base, where, elem) {
  base.insertAdjacentElement(where, elem);
}

function addButtons(li) {
  const buttonRemoveTask = li.querySelector(".img-delete");
  const buttonTransformTask = li.querySelector(".img-trans");
  buttonRemoveTask.onclick = () => li.remove();
  buttonTransformTask.onclick = () => {
    li.getAttribute("contenteditable")
      ? li.removeAttribute("contenteditable")
      : li.setAttribute("contenteditable", true);
  };
}

function makeObjTasc() {
  let now = new Date();
  let dateTask =
    now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
  const titleInput = document.querySelector(".form__input_text");
  const descInput = document.querySelector(".form__input_description");
  const userInput = document.querySelector(".form__input_user");
  let objTask = {};
  objTask.title = titleInput.value;
  objTask.desc = descInput.value;
  objTask.user = userInput.value + "/" + dateTask;
  titleInput.value = null;
  descInput.value = null;
  userInput.value = null;
  let modalWindow = showModalWindow();
  modalWindow.style.display = "none";
  return objTask;
}

function addTask() {
  let objTask = makeObjTasc();
  createTask(objTask);
}

function showModalWindow() {
  modalWindow.style.display = "block";
  return modalWindow;
}

buttonShow.onclick = showModalWindow;

function deleteModalWindow() {
  let objTasc = makeObjTasc();
  Object.entries(objTasc).map((elem, value) => (elem[value] = null));
}

const buttonTaskRemove = document.querySelector(".form__button_delete");
buttonTaskRemove.onclick = deleteModalWindow;

function deleteAllTascs() {
  const tascs = document.querySelectorAll(".list__task_do");
  for (let prop of tascs) {
    if (prop.classList.contains("li-pattern")) {
      continue;
    } else {
      prop.remove();
    }
  }
}

const buttonAllTascsRemove = document.querySelector(".button__delete");
buttonAllTascsRemove.onclick = deleteAllTascs;
