import { local } from "./localStorage.js";
export function makeCounter() {
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

    local();
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
}
