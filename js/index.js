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
  //new
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

function addButtons(li) {
  //new
  //do

  // const liDo = li.querySelectorAll(".list__task_do");
  // const buttonRemoveTaskDo = liDo.querySelector(".img-delete");
  // const buttonTransformTaskDo = li.querySelector(".img-trans");
  // //progress
  // const liProgress = li.querySelectorAll(".list__task_progress");
  // const buttonRemoveTaskProgress = liProgress.querySelector(".img-delete");
  // //done
  // const liDone = li.querySelectorAll(".list__task_done");
  // const buttonRemoveTaskDone = liDone.querySelector(".img-delete");
  // buttonRemoveTaskDo.onclick = () => liDo.remove();
  // buttonRemoveTaskProgress.onclick = () => liProgress.remove();
  // buttonRemoveTaskDone.onclick = () => liDone.remove();
  // buttonTransformTaskDo.onclick = () => {
  //   li.getAttribute("contenteditable")
  //     ? li.removeAttribute("contenteditable")
  //     : li.setAttribute("contenteditable", true);
  // };
  //new
  const buttonRemoveTask = li.querySelector(".img-delete");
  const buttonTransformTask = li.querySelector(".img-trans");
  buttonRemoveTask.onclick = () => li.remove();
  //new
  // buttonRemoveTask.onclick = () => {
  //   if (buttonRemoveTask.closest("li").classList.contains("list__task_do")) {
  //     document.querySelector(".list__task_do").remove();
  //   } else if (
  //     buttonRemoveTask.closest("li").classList.contains("list__task_progress")
  //   ) {
  //     document.querySelector(".list__task_progress").remove();
  //   } else {
  //     document.querySelector(".list__task_done").remove();
  //   }
  // };
  //new
  buttonTransformTask.onclick = () => {
    li.getAttribute("contenteditable")
      ? li.removeAttribute("contenteditable")
      : li.setAttribute("contenteditable", true);
  };
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
  // getTascsForDelete();
  const tascs = getTascsForDelete();
  //const tascs = document.querySelectorAll(".list__task_do");
  for (let prop of tascs) {
    if (prop.classList.contains("li-pattern")) {
      continue;
    } else {
      prop.remove();
    }
  }
}
function getTascsForDelete() {
  let tascs;
  if (buttonAllTascsRemove.classList.contains("button__delete_do")) {
    tascs = document.querySelectorAll(".list__task_do");
  }
  if (buttonAllTascsRemove.classList.contains("button__delete_progress")) {
    tascs = document.querySelectorAll(".list__task_progress");
  }
  if (buttonAllTascsRemove.classList.contains("button__delete_done")) {
    tascs = document.querySelectorAll(".list__task_done");
  }
  return tascs;
}

const buttonAllTascsRemove = document.querySelector(".button__delete");
buttonAllTascsRemove.onclick = deleteAllTascs;

//drag and drop

const main = document.querySelector(".main__row-block");

main.addEventListener("dragenter", (e) => {
  // нас интересуют только колонки
  if (e.target.classList.contains("item__list")) {
    e.target.classList.add("drop");
  }
});

main.addEventListener("dragleave", (e) => {
  if (e.target.classList.contains("drop")) {
    e.target.classList.remove("drop");
  }
});

main.addEventListener("dragstart", (e) => {
  // нас интересует только задача
  if (e.target.classList.contains("list__task")) {
    // сохраняем идентификатор задачи в объекте "dataTransfer" в виде обычного текста;
    // dataTransfer также позволяет сохранять HTML - text/html,
    // но в данном случае нам это ни к чему
    e.dataTransfer.setData("text/plain", e.target.dataset.id);
  }
});

// создаем переменную для хранения "низлежащего" элемента
let elemBelow;

main.addEventListener("dragover", (e) => {
  // отключаем стандартное поведение браузера;
  // это необходимо сделать в любом случае
  e.preventDefault();

  // записываем в переменную целевой элемент;
  // валидацию сделаем позже
  elemBelow = e.target;
});

main.addEventListener("drop", (e) => {
  // находим перетаскиваемую задачу по идентификатору, записанному в dataTransfer

  const todo = main.querySelector(
    `[data-id="${e.dataTransfer.getData("text/plain")}"]`
  );
  // прекращаем выполнение кода, если задача и элемент - одно и тоже
  if (elemBelow === todo) {
    return;
  }

  // если элементом является параграф или кнопка, значит, нам нужен их родительский элемент
  // if (
  //   elemBelow.tagName === "DIV" ||
  //   elemBelow.tagName === "BUTTON" ||
  //   elemBelow.tagName === "IMG"
  // ) {
  //   elemBelow = elemBelow.closest("li");
  // }
  // на всякий случай еще раз проверяем, что имеем дело с задачей
  if (elemBelow.classList.contains("list__task")) {
    // нам нужно понять, куда помещать перетаскиваемый элемент:
    // до или после низлежащего;
    // для этого необходимо определить центр низлежащего элемента
    // и положение курсора относительно этого центра (выше или ниже)
    // определяем центр
    const center =
      elemBelow.getBoundingClientRect().y +
      elemBelow.getBoundingClientRect().height / 2;
    // если курсор находится ниже центра
    // значит, перетаскиваемый элемент должен быть помещен под низлежащим
    // иначе, перед ним
    if (e.clientY > center) {
      if (elemBelow.nextElementSibling !== null) {
        elemBelow = elemBelow.nextElementSibling;
      } else {
        return;
      }
    }

    elemBelow.parentElement.insertBefore(todo, elemBelow);
    // рокировка элементов может происходить в разных колонках
    // необходимо убедиться, что задачи будут визуально идентичными
    todo.className = elemBelow.className;
  }

  // если целью является колонка
  if (e.target.classList.contains("item__list")) {
    // просто добавляем в нее перетаскиваемый элемент
    // это приведет к автоматическому удалению элемента из "родной" колонки
    e.target.append(todo);

    // удаляем индикатор зоны для "бросания"
    if (e.target.classList.contains("drop")) {
      e.target.classList.remove("drop");
    }

    // визуальное оформление задачи в зависимости от колонки, в которой она находится
    const { name } = e.target.dataset;

    if (name === "item__list_do") {
      if (todo.classList.contains("list__task_done")) {
        todo.querySelector(".task__desc").remove();
        todo.querySelector(".footer__user").remove();
      }
      const footers = document.querySelectorAll(".footer__transform");
      for (let footer of footers) {
        if (!footer.querySelector(".img-trans")) {
          footer.insertAdjacentHTML(
            "afterbegin",
            '<img class="img-trans" src="./img/transform.png"></img>'
          );
          footer.querySelector(".img-trans").draggable = false;
        }
      }
    }

    if (name === "item__list_done") {
      if (todo.classList.contains("list__task_progress")) {
        todo.classList.remove("list__task_progress");
      }

      if (todo.classList.contains("list__task_do")) {
        todo.classList.remove("list__task_do");
      }

      todo.classList.add("list__task_done");
      todo.querySelector(".img-trans").remove();
    } else if (name === "item__list_progress") {
      if (todo.classList.contains("list__task_do")) {
        todo.classList.remove("list__task_do");
      }

      if (todo.classList.contains("list__task_done")) {
        todo.classList.remove("list__task_done");
      }
      todo.classList.add("list__task_progress");
      todo.querySelector(".img-trans").remove();
    } else {
      todo.className = "list__task";
      todo.classList.add("list__task_do");
    }
  }
});
/*

const tascs = document.querySelectorAll(".list__task_do");

for (let tasc of tascs) {
  tasc.draggable = true;
}

list.addEventListener("dragstart", (evt) => {
  evt.target.classList.add("selected");
  evt.dataTransfer.effectAllowed = "move";
});

list.addEventListener("dragend", (evt) => {
  evt.target.classList.remove("selected");
});

//dragover
const listProgress = document.querySelector(".item__list_progress");
listProgress.addEventListener("dragover", (evt) => {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "move";

  const activeElement = tascs.querySelector(".selected");
  const currentElement = evt.target;
  const isMoveable =
    activeElement !== currentElement &&
    currentElement.classList.contains(item__list_progress);
  if (!isMoveable) {
    return;
  }
  evt.target.append(listProgress);
  // listProgress.append(activeElement);
});

const tascs = document.querySelectorAll(".list__task_do");

for (let tasc of tascs) {
  tasc.draggable = true;
}
list.addEventListener("onmousedown", (evt) => {
  // (1) отследить нажатие

  // (2) подготовить к перемещению:
  // разместить поверх остального содержимого и в абсолютных координатах
  evt.target.style.position = "absolute";
  evt.target.style.zIndex = 1000;
  // переместим в body, чтобы мяч был точно не внутри position:relative
  document.body.append(evt.target);
  // и установим абсолютно спозиционированный мяч под курсор

  moveAt(evt.pageX, evt.pageY);

  // передвинуть мяч под координаты курсора
  // и сдвинуть на половину ширины/высоты для центрирования
  function moveAt(pageX, pageY) {
    evt.target.style.left = pageX - evt.target.offsetWidth / 2 + "px";
    evt.target.style.top = pageY - evt.target.offsetHeight / 2 + "px";
  }

  function onMouseMove(evt) {
    moveAt(evt.pageX, evt.pageY);
  }

  // (3) перемещать по экрану
  document.addEventListener("mousemove", onMouseMove);

  // (4) положить мяч, удалить более ненужные обработчики событий
  list.addEventListener("onmousedown", (evt) => {
    //evt.preventDefault();
    document.removeEventListener("mousemove", onMouseMove);
    evt.target.onmouseup = null;
  });
});*/
