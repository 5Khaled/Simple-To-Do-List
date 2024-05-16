
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
// document.addEventListener("click", function(clicked){
//   let clickedButton = clicked.target;
//   if(clickedButton.classList.value.split(" ").includes("delete")){
//     let task = clickedButton.parentElement.parentElement.parentElement;
//     let taskTitle =  task.querySelector(".title");
//     let taskName = taskTitle.innerHTML;
//     let tasksObject = JSON.parse(window.localStorage.Tasks);
//     let taskID = tasksObject.map(obj => obj.title).indexOf(taskName);

//     delete tasksObject[taskID];
//     tasksObject = Object.values(tasksObject);
//     if(tasksObject.length == 0){
//       window.localStorage.removeItem("Tasks");
//       CreateEmptyPlaceholder();
//     }
//     else{
//       tasksObject = JSON.stringify(tasksObject);  
//       window.localStorage.Tasks = tasksObject;
//     }
//     task.remove()
//   }
// })

// Edit element
document.querySelector(".tasks").addEventListener("click", function(clicked){
  let clickedButton = clicked.target;
  if(clickedButton.classList.value.split(" ").includes("btn")){
    let task = clickedButton.parentElement.parentElement.parentElement;
    
    let taskTitle =  task.querySelector(".title");
    let taskEditField =  task.querySelector(".edit-field");
    let taskSettings =  task.querySelector(".settings");
    let taskButtonsContainer = taskSettings.querySelector(".buttons-container");
    let taskSettingsBtn = taskSettings.querySelector(".settings-btn");
    let taskDlt =  task.querySelector(".delete");
    let taskName = taskTitle.innerHTML;
    let tasksObject = JSON.parse(window.localStorage.Tasks);
    let taskID = tasksObject.map(obj => obj.title).indexOf(taskName);
    if(clickedButton.classList.value.split(" ").includes("settings-btn") && !clickedButton.classList.value.split(" ").includes("active")){
      taskButtonsContainer.style.display = "grid";
      taskSettingsBtn.style.rotate = "45deg";
      // taskSettingsBtn.classList.add("active");
    }
    else if(clickedButton.classList.value.split(" ").includes("edit")){
      taskButtonsContainer.style.position = "static";
      taskButtonsContainer.style.filter = "none";
      taskSettingsBtn.style.display = "none";
      taskTitle.style.display = "none";
      taskDlt.style.display = "none";
      taskEditField.style.display = "block";
      taskEditField.value = taskName;
      clickedButton.classList.remove("edit");
      clickedButton.classList.add("confirm");
      clickedButton.innerHTML = "Confirm";
      taskEditField.focus();
    }
    else if(clickedButton.classList.value.split(" ").includes("confirm")){
      if(taskEditField.value.length > 0){
        taskButtonsContainer.style.position = "absolute";
        taskButtonsContainer.style.filter = "drop-shadow(0px 0px 10px #0000002a)";
        taskSettingsBtn.style.display = "block";
        taskTitle.style.display = "block";
        taskDlt.style.display = "block";
        taskEditField.style.display = "none";
        clickedButton.classList.remove("confirm");
        clickedButton.classList.add("edit");
        clickedButton.innerHTML = "Edit";
        
        let taskEdit = taskEditField.value;
        tasksObject[taskID] = {"title": taskEdit};
        tasksObject = JSON.stringify(tasksObject);
        window.localStorage.Tasks = tasksObject;
        taskTitle.innerHTML = taskEdit;
      }
      else{
        taskEditField.focus();
      }
    }
    else if(clickedButton.classList.value.split(" ").includes("delete")){
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
      task.remove()
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
// function createTask(taskName){
//   let task = document.createElement("div");
//   task.classList.add("task")

//   let taskTitle = document.createElement("div");
//   taskTitle.classList.add("title")
//   taskTitle.value = taskName;
//   taskTitle.append(document.createTextNode(taskName));

//   let taskEditField = document.createElement("input");
//   taskEditField.classList.add("edit-field");
//   taskEditField.style.display = "none";

//   let taskDeleteBtn = document.createElement("div");
//   taskDeleteBtn.classList.add("delete", "btn")
//   taskDeleteBtn.innerHTML = "Delete";

//   let taskEditBtn = document.createElement("div");
//   taskEditBtn.classList.add("edit", "btn")
//   taskEditBtn.innerHTML = "Edit";

//   task.append(taskTitle);
//   task.append(taskEditField);
//   task.append(taskEditBtn);
//   task.append(taskDeleteBtn);
//   return task;
// }

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

  let settings = document.createElement("div");
  settings.classList.add("settings");
  let settingsIcon = document.createElement("div");
  settingsIcon.classList.add("btn", "settings-btn");
  settingsIcon.innerHTML ="⚙";
  settings.append(settingsIcon);
  
    let taskEditBtn = document.createElement("div");
    taskEditBtn.classList.add("btn", "edit")
    taskEditBtn.innerHTML = "Edit";

  let taskDeleteBtn = document.createElement("div");
  taskDeleteBtn.classList.add("btn", "delete")
  taskDeleteBtn.innerHTML = "Delete";

  let taskTestBtn = document.createElement("div");
  taskTestBtn.classList.add("test-btn", "btn")
  taskTestBtn.innerHTML = "Test";

  let ButtonsContainer = document.createElement("div");
  ButtonsContainer.classList.add("buttons-container")
  ButtonsContainer.style.display = "none";
  ButtonsContainer.append(taskEditBtn);
  // ButtonsContainer.append(taskTestBtn);
  ButtonsContainer.append(taskDeleteBtn);

  task.append(taskTitle);
  task.append(taskEditField);
  settings.append(ButtonsContainer);
  task.append(settings);
  return task;
}



// Create Newwwwwwwwwwwww task Element
// function createTask2(taskName){
//   let task = document.createElement("div");
//   task.classList.add("test-task")

//   let taskTitle = document.createElement("div");
//   taskTitle.classList.add("title")
//   taskTitle.value = taskName;
//   taskTitle.append(document.createTextNode(taskName));

//   let taskEditField = document.createElement("input");
//   taskEditField.classList.add("edit-field");
//   taskEditField.style.display = "none";

//   let settings = document.createElement("div");
//   settings.classList.add("settings");
//   let settingsIcon = document.createElement("div");
//   settingsIcon.classList.add("settings-icon");
//   settingsIcon.innerHTML ="⚙";
//   settings.append(settingsIcon);
  
//     let taskEditBtn = document.createElement("div");
//     taskEditBtn.classList.add("edit", "btn")
//     taskEditBtn.innerHTML = "Edit";

//   let taskDeleteBtn = document.createElement("div");
//   taskDeleteBtn.classList.add("delete", "btn")
//   taskDeleteBtn.innerHTML = "Delete";

//   let taskTestBtn = document.createElement("div");
//   taskTestBtn.classList.add("test-btn", "btn")
//   taskTestBtn.innerHTML = "Test";

//   let ButtonsContainer = document.createElement("div");
//   ButtonsContainer.classList.add("buttons-container")
//   ButtonsContainer.append(taskEditBtn);
//   ButtonsContainer.append(taskTestBtn);
//   ButtonsContainer.append(taskDeleteBtn);

//   task.append(taskTitle);
//   task.append(taskEditField);
//   settings.append(ButtonsContainer);
//   task.append(settings);
//   return task;
// }

// document.querySelector(".tasks-2").append(createTask2("potato"));