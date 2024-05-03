
let tasks = document.querySelector(".tasks");


if(window.localStorage.Tasks !== undefined){
  let tasksObject = JSON.parse(window.localStorage.Tasks);
  for(i = 0; i < tasksObject.length; i++){
    taskName = tasksObject[i].title;
    let task = createTask(taskName);
    tasks.append(task)
  }
}
else{
  CreateEmptyPlaceholder();
}

// Add Element
let addButton = document.querySelector(".add");
addButton.addEventListener("click", function(){

  let taskName = document.querySelector(".input").value;
  // check if user typed any input
  if(taskName.length > 0){
    // Check if "Tasks Object" is available in local storage
    // If NOT then add the first element
    let task = createTask(taskName);
    if(window.localStorage.Tasks === undefined){
      let tasksObject = JSON.stringify([{"title":taskName}]);
      window.localStorage.Tasks = tasksObject;
      tasks.append(task);
    }
    // If "Tasks Object" is available then just adjust the object and re-add it
    else{
      let tasksObject = JSON.parse(window.localStorage.Tasks);
      if(!tasksObject.map(key => key.title === taskName).includes(true)){
        tasksObject.push({"title": taskName});
        tasksObject = JSON.stringify(tasksObject);
        window.localStorage.Tasks = tasksObject;
        tasks.append(task);
      }
    }
    if(window.localStorage.Tasks !== undefined && tasks.querySelector(".empty") != null){
      tasks.querySelector(".empty").remove();
    }
    document.querySelector(".input").value = "";
  }
  document.querySelector(".input").focus();
})


// Delete element
document.addEventListener("click", function(clicked){
  let task = clicked.target;
  if(task.classList.value.split(" ").includes("delete")){

    let tasksObject = JSON.parse(window.localStorage.Tasks);
    let taskName = task.parentElement.querySelector(".title").innerHTML;
    let taskID = tasksObject.map(key => key.title).indexOf(taskName);

    delete tasksObject[taskID];
    tasksObject = Object.values(tasksObject);
    if(tasksObject.length == 0){
      window.localStorage.removeItem("Tasks");
      CreateEmptyPlaceholder();
    }
    else{
      tasksObject = JSON.stringify(tasksObject);  
      window.localStorage.Tasks = tasksObject;
    }
    task.parentElement.remove()
  }
})

// Edit element
document.querySelector(".tasks").addEventListener("click", function(clicked){
  let task = clicked.target;
  if(task.classList.value.split(" ").includes("btn")){
    let taskTitle =  task.parentElement.querySelector(".title");
    let taskDlt =  task.parentElement.querySelector(".delete");
    let taskEditField =  task.parentElement.querySelector(".edit-field");
    let tasksObject = JSON.parse(window.localStorage.Tasks);
    let taskName = task.parentElement.querySelector(".title").innerHTML;
    let taskID = tasksObject.map(key => key.title).indexOf(taskName);
    if(task.classList.value.split(" ").includes("edit")){
      taskTitle.style.display = "none";
      taskDlt.style.display = "none";
      taskEditField.style.display = "block";
      taskEditField.value = taskName;
      task.classList.remove("edit");
      task.classList.add("confirm");
      task.innerHTML = "Confirm";
      taskEditField.focus();
    }
    else if(task.classList.value.split(" ").includes("confirm")){
      taskTitle.style.display = "block";
      taskDlt.style.display = "block";
      taskEditField.style.display = "none";
      task.classList.remove("confirm");
      task.classList.add("edit");
      task.innerHTML = "Edit";
      let taskEdit = taskEditField.value;
      tasksObject[taskID] = {"title": taskEdit};
      tasksObject = JSON.stringify(tasksObject);  
      window.localStorage.Tasks = tasksObject;
      task.parentElement.querySelector(".title").innerHTML = taskEdit;
    }
  }
})


// Create Empty Placeholder
function CreateEmptyPlaceholder(){
  let empty = document.createElement("div");
  empty.classList.add("empty")
  empty.append(document.createTextNode("You don't have any tasks available!"));
  tasks.append(empty);
}


// Create a task Element
function createTask(taskName){
  let task = document.createElement("div");
  task.classList.add("task")

  let taskTitle = document.createElement("div");
  taskTitle.classList.add("title")
  taskTitle.value = taskName;
  taskTitle.append(document.createTextNode(taskName));

  let taskEditField = document.createElement("input");
  taskEditField.classList.add("edit-field");
  taskEditField.style.display = "none";

  let taskDeleteBtn = document.createElement("div");
  taskDeleteBtn.classList.add("delete", "btn")
  taskDeleteBtn.innerHTML = "Delete";

  let taskEditBtn = document.createElement("div");
  taskEditBtn.classList.add("edit", "btn")
  taskEditBtn.innerHTML = "Edit";

  task.append(taskTitle);
  task.append(taskEditField);
  task.append(taskEditBtn);
  task.append(taskDeleteBtn);
  return task;
}
