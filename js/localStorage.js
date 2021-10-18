import { addButtons } from "./index.js";

export function makeLocalStorage() {
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
  return createlocal;
}
export let local = makeLocalStorage();
