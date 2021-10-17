const list = document.querySelector(".item__list");
const buttonAdd = document.querySelector(".form__button_add");
buttonAdd.onclick = addTask;
const buttonShow = document.querySelector(".button__add");
const modalWindow = document.querySelector(".module-window");

function createTask(task) {
  let { title, desc, user } = task;
  if (desc.length > 100) {
    desc = desc.substring(0, 99) + "...";
  }

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
  const buttonRemoveTask = li.querySelector(".img-delete");
  const buttonTransformTask = li.querySelector(".img-trans");

  let parent = buttonTransformTask.closest("li");
  if (parent) {
    if (
      parent.classList.contains("list__task_done") ||
      parent.classList.contains("list__task_progress")
    ) {
      buttonTransformTask.remove();
    }
  }

  buttonTransformTask.onclick = function () {
    let transform = li.getAttribute("contenteditable");
    if (transform && transform !== "false") {
      li.setAttribute("contenteditable", false);
      li.style.backgroundColor = "#f0f5fa";
    } else {
      li.setAttribute("contenteditable", true);
      li.style.backgroundColor = "#c9d8e7";
    }
  };

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
  objTask.user = userInput.value + " / " + dateTask;
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
    //new
    function getLimitTascs() {
      const tascsProgress = document.querySelectorAll(".list__task_progress");
      const listDo = document.querySelector(".tascs-do");
      if (tascsProgress.length + 1 > 5) {
        const moduleWindowBan = document.querySelector(".module-window-ban");
        moduleWindowBan.style.display = "block";
        const moduleWindowBanOk = document.querySelector(
          ".module-window-ban_ok"
        );
        moduleWindowBanOk.onclick = () => {
          let y = todo;
          todo.remove();
          listDo.append(y);
          y.classList.add("list__task_do");
          y.classList.remove("list__task_progress");

          moduleWindowBan.style.display = "none";
        };
      }
    }

    // удаляем индикатор зоны для "бросания"
    if (e.target.classList.contains("drop")) {
      e.target.classList.remove("drop");
    }

    // визуальное оформление задачи в зависимости от колонки, в которой она находится
    const { name } = e.target.dataset;

    if (name === "item__list_do") {
      todo.classList.add("list__task_do");
      if (todo.classList.contains("list__task_done")) {
        todo.classList.remove("list__task_done");
        if (todo.querySelector(".task__desc")) {
          todo.querySelector(".task__desc").remove();
        }
        todo.querySelector(".footer__user").remove();
      }
      if (todo.classList.contains("list__task_progress")) {
        todo.classList.remove("list__task_progress");
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

      let lies = document.querySelectorAll(".list__task_do");
      for (let li of lies) {
        addButtons(li);
      }
    }

    if (name === "item__list_done") {
      todo.classList.add("list__task_progress");
      todo.setAttribute("contenteditable", false);
      todo.style.backgroundColor = "#f0f5fa";
      if (todo.classList.contains("list__task_progress")) {
        todo.classList.remove("list__task_progress");
      }

      if (todo.classList.contains("list__task_do")) {
        todo.classList.remove("list__task_do");
        if (todo.querySelector(".img-trans")) {
          todo.querySelector(".img-trans").remove();
        }
      }

      todo.classList.add("list__task_done");
      todo.setAttribute("contenteditable", false);
      todo.style.backgroundColor = "#f0f5fa";
    } else if (name === "item__list_progress") {
      getLimitTascs();
      todo.classList.add("list__task_progress");

      if (todo.classList.contains("list__task_do")) {
        todo.classList.remove("list__task_do");
        todo.querySelector(".img-trans").remove();
      }

      if (todo.classList.contains("list__task_done")) {
        todo.classList.remove("list__task_done");
      }
      todo.setAttribute("contenteditable", false);
      todo.style.backgroundColor = "#f0f5fa";
    } else {
      todo.className = "list__task";
      todo.classList.add("list__task_do");
    }
  }
});

//создание счетчика

let targetDo = document.querySelector(".tascs-do");
let targetProgress = document.querySelector(".tascs-progress");
let targetDone = document.querySelector(".tascs-done");

const config = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
};

// Колбэк-функция при срабатывании мутации
const callback = function (mutationsList, observer) {
  if ((mutationsList.target = "ul.item__list.tascs-do")) {
    let tascsLi = document.querySelectorAll(".list__task_do");
    renderCounter(".item-title_do", tascsLi, " to do");
  }
  if ((mutationsList.target = "ul.item__list.tascs-progress")) {
    let tascsLi = document.querySelectorAll(".list__task_progress");
    renderCounter(".item-title_progress", tascsLi, " in progress");
  }
  if ((mutationsList.target = "ul.item__list.tascs-done")) {
    let tascsLi = document.querySelectorAll(".list__task_done");
    renderCounter(".item-title_done", tascsLi, " done");
  }

  createlocal();
};

function renderCounter(title, arr, text) {
  let numberTascs = arr.length;
  for (let tascLi of arr) {
    if (tascLi.classList.contains("li-pattern")) {
      numberTascs = numberTascs - 1;
    }
  }
  let counterText = document.querySelector(title);

  counterText.innerHTML = numberTascs + text;
}
// Создаём экземпляр наблюдателя с указанной функцией колбэка
const observer = new MutationObserver(callback);

// Начинаем наблюдение за настроенными изменениями целевого элемента
observer.observe(targetDo, config);
observer.observe(targetProgress, config);
observer.observe(targetDone, config);

let toDo;
let inProgress;
let toDone;
const listDo = document.querySelector(".tascs-do");
const listProgress = document.querySelector(".tascs-progress");
const listDone = document.querySelector(".tascs-done");

function createlocal() {
  toDo = listDo.innerHTML;
  localStorage.setItem("toDo", toDo);

  inProgress = listProgress.innerHTML;
  localStorage.setItem("inProgress", inProgress);

  toDone = listDone.innerHTML;
  localStorage.setItem("toDone", toDone);
  const lies = document.querySelectorAll(".list__task");
  for (let li of lies) {
    addButtons(li);
  }
}

if (localStorage.getItem("toDo")) {
  listDo.innerHTML = localStorage.getItem("toDo");
}
if (localStorage.getItem("inProgress")) {
  listProgress.innerHTML = localStorage.getItem("inProgress");
}
if (localStorage.getItem("toDone")) {
  listDone.innerHTML = localStorage.getItem("toDone");
}
