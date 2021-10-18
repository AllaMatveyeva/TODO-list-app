//drag and drop
import { addButtons } from "./index.js";

export function makeDragDrop() {
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
}
