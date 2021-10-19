import { makeDragDrop } from "./drag.js";
import { makeCounter } from "./counter.js";
import { makeLocalStorage } from "./localStorage.js";

const list = document.querySelector(".item__list");
const buttonAdd = document.querySelector(".form__button_add");
const buttonShow = document.querySelector(".button__add");
const modalWindow = document.querySelector(".module-window");

buttonAdd.onclick = addTask;

function addTask() {
  let objTask = makeObjTasc();
  createTask(objTask);
}

function makeObjTasc() {
  let now = new Date();
  let date = now.getDate();
  if (date < 10) {
    date = "0" + date;
  }
  let dateTask = date + "." + (now.getMonth() + 1) + "." + now.getFullYear();
  const titleInput = document.querySelector(".form__input_text");
  const descInput = document.querySelector(".form__input_description");
  const userInput = document.querySelector(".form__input_user");
  let objTask = {};
  objTask.title = titleInput.value;
  objTask.desc = descInput.value;
  objTask.user = userInput.value;
  objTask.date = dateTask;
  titleInput.value = null;
  descInput.value = null;
  userInput.value = null;
  let modalWindow = showModalWindow();
  modalWindow.style.display = "none";
  return objTask;
}

function showModalWindow() {
  modalWindow.style.display = "block";
  return modalWindow;
}

function createTask(task) {
  let { title, desc, user, date } = task;
  let titleUpperCase = title[0].toUpperCase() + title.slice(1);

  if (titleUpperCase.length > 25) {
    titleUpperCase = titleUpperCase.substring(0, 24) + "...";
  }

  if (desc.length > 100) {
    desc = desc.substring(0, 99) + "...";
  }

  let descArr = desc.split(" ");
  let newDescArr = [];
  for (let des of descArr) {
    if (des.length > 25) {
      des = des.substring(0, 24) + "...";
    }
    newDescArr.push(des);
  }
  desc = newDescArr.join(" ");

  if (user.length > 25) {
    user = user.substring(0, 24) + "...";
  }

  const li = document.querySelector(".li-pattern").cloneNode(true);
  li.classList.remove("li-pattern");
  li.querySelector(".task__title").textContent = titleUpperCase;
  li.querySelector(".task__desc").textContent = desc;
  li.querySelector(".footer__user").textContent = user;
  li.querySelector(".footer__date").textContent = date;
  addButtons(li);
  render(list, "beforeend", li);
}

function render(base, where, elem) {
  base.insertAdjacentElement(where, elem);

  const tascs = document.querySelectorAll(".list__task");
  for (let i = 0; i < tascs.length; i++) {
    tascs[i].draggable = true;
    let value = i + 1;
    tascs[i].setAttribute("data-id", value);
  }

  const imges = document.querySelectorAll("img");
  for (let img of imges) {
    img.draggable = false;
  }
}

export function addButtons(li) {
  const buttonRemoveTask = li.querySelector(".img-delete");
  const buttonTransformTask = li.querySelector(".img-trans");
  if (buttonTransformTask) {
    let parent = buttonTransformTask.closest("li");
    if (parent) {
      if (
        parent.classList.contains("list__task_done") ||
        parent.classList.contains("list__task_progress")
      ) {
        buttonTransformTask.remove();
      }
    }
  }

  //ограничения на действия при редактировании

  function checkString(sel) {
    let descs = document.querySelectorAll(sel);
    let descText;
    for (let desc of descs) {
      descText = desc.textContent;
      let descTextArr = descText.split(" ");
      let newdescTextArr = [];
      for (let des of descTextArr) {
        if (des.length > 25) {
          des = des.substring(0, 24) + "...";
        }
        newdescTextArr.push(des);
      }
      descText = newdescTextArr.join(" ");
      desc.textContent = descText;
      if (descText.length > 100) {
        let newDescText = descText.substring(0, 99) + "...";
        desc.textContent = newDescText;
      }
    }

    const lies = document.querySelectorAll(".list__task_do");
    for (let li of lies) {
      if (li.classList.contains("li-pattern")) {
        continue;
      } else {
        if (!li.querySelector(sel)) {
          if (sel == ".task__title") {
            const taskTitle = document.createElement("h2");
            taskTitle.classList.add("task__title");
            taskTitle.textContent = "no title";
            li.prepend(taskTitle);
          }
          if (sel == ".task__desc") {
            const tascDesc = document.createElement("div");
            tascDesc.classList.add("task__desc");
            tascDesc.textContent = "no description";
            const title = li.querySelector(".task__title");
            title.after(tascDesc);
          }
          if (sel == ".footer__user") {
            const footerUser = document.createElement("div");
            footerUser.classList.add("footer__user");
            footerUser.textContent = "no user";
            const tascDesc = li.querySelector(".task__desc");
            tascDesc.after(footerUser);
          }
        }
        if (sel == ".task__title") {
          const taskTitle = li.querySelector(".task__title");
          const taskTitleText = taskTitle.textContent;
          if (taskTitleText == " " || !taskTitleText) {
            taskTitle.textContent = "no title";
          }
        }
      }
    }
  }
  if (buttonTransformTask) {
    buttonTransformTask.onclick = function () {
      let transform = li.getAttribute("contenteditable");
      if (transform && transform !== "false") {
        checkString(".task__title");
        checkString(".task__desc");
        checkString(".footer__user");

        li.setAttribute("contenteditable", false);
        li.style.backgroundColor = "#f0f5fa";
      } else {
        li.setAttribute("contenteditable", true);

        const dats = document.querySelectorAll(".footer__date");
        for (let dat of dats) {
          dat.setAttribute("contenteditable", false);
        }
        li.style.backgroundColor = "#c9d8e7";
      }
    };
  }
  buttonRemoveTask.onclick = function () {
    const moduleWindowQuestion = document.querySelector(
      ".module-window-question"
    );

    const questionContainer = document.querySelector(".question-container");

    const moduleWindowOk = document.querySelector(".module-window_ok");
    const moduleWindowNo = document.querySelector(".module-window_no");
    if (li.classList.contains("list__task_progress")) {
      moduleWindowQuestion.style.display = "block";
      questionContainer.addEventListener("click", function (ev) {
        if (ev.target == moduleWindowOk) {
          moduleWindowQuestion.style.display = "none";
          li.remove();
        }
        if (ev.target == moduleWindowNo) {
          moduleWindowQuestion.style.display = "none";
        }
      });
    } else {
      li.remove();
    }
  };
}

buttonShow.onclick = showModalWindow;

function deleteModalWindow() {
  let objTasc = makeObjTasc();
  Object.entries(objTasc).map((elem, value) => (elem[value] = null));
}

const buttonTaskRemove = document.querySelector(".form__button_delete");
buttonTaskRemove.onclick = deleteModalWindow;

//кнопка удалить все задачи

const buttonTascsDoRemove = document.querySelector(".button__delete_do");

const buttonTascsProgressRemove = document.querySelector(
  ".button_delete_progress"
);
const buttonTascsDoneRemove = document.querySelector(".button__delete_done");

function deleteAllTascs(sel) {
  const tascs = document.querySelectorAll(sel);
  for (let tasc of tascs) {
    if (tasc.classList.contains("list__task_do")) {
      if (tasc.classList.contains("li-pattern")) {
        continue;
      } else {
        tasc.remove();
      }
    }
    tasc.remove();
  }
}

buttonTascsDoRemove.onclick = function () {
  deleteAllTascs(".list__task_do");
};

buttonTascsProgressRemove.onclick = function () {
  deleteAllTascs(".list__task_progress");
};

buttonTascsDoneRemove.onclick = function () {
  deleteAllTascs(".list__task_done");
};

makeDragDrop();

//создание счетчика

makeCounter();

// создание local storage

makeLocalStorage();
