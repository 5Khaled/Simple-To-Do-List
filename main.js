const tasksBox = document.querySelector(".tasks-container");

const taskForm = document.querySelector(".task-form");
const textField = taskForm.querySelector("[type=text]");
const addButton = taskForm.querySelector("[type=button]");


if(window.localStorage.Tasks !== undefined){
  let tasksObject = JSON.parse(window.localStorage.Tasks);
  for(i = 0; i < tasksObject.length; i++){
    const taskName = tasksObject[i].title;
    const isChecked = tasksObject[i].checked;
    let task = createTask(taskName);
    if(isChecked === true){
      task.querySelector("[type = checkbox]").checked = true;
    }
    tasksBox.append(task)
  }
}

window.addEventListener('scroll', function(){
  if(window.innerWidth > 640){
    if(this.scrollY > 0){
      taskForm.classList.add("task-form-scroll");
    }else{
      taskForm.classList.remove("task-form-scroll");
    }
  }else{
    if(document.body.scrollHeight === this.scrollY + this.window.innerHeight){
      taskForm.classList.remove("task-form-scroll");
    }else{
      taskForm.classList.add("task-form-scroll");
    }
  }
})

const resizeObserver = new ResizeObserver(entries => {
  const height = entries[0].target.clientHeight;
  console.log('Body height changed:', height);
  if(window.scrollY <= 640){
    if(height > 680){
      taskForm.classList.add("task-form-scroll");
    }else{
      taskForm.classList.remove("task-form-scroll");
    }
  }
})
resizeObserver.observe(tasksBox)

// Add Button
addButton.addEventListener('click', function(){
  taskName = textField.value.trim();
  textField.focus();
  if(textValidation(taskName)){
    addTask(taskName);
  }else{
    console.log("Please type something first!");
  }
});


// Click Events
document.addEventListener('click', function(e){
  const clicked = e.target;
  // Task Options Drop-down Button
  if([...clicked.classList].includes("options-btn")){
    optionsDropDown(clicked);
  }
  // Options Buttons
  else if([...clicked.classList].includes("option")){
    if([...clicked.classList].includes("edit")){
      editTask(clicked);
    }
    else if([...clicked.classList].includes("delete")){
      deleteTask(clicked);
    }
  }
  else if([...clicked.classList].includes("options")){
    return;
  }
  // Close Options Drop-down
  else{
    [...tasksBox.children].forEach(task => {
      const dropDown = task.children[4];
      dropDown.classList.remove("active");
    });
  }
})

// Drop-Down Activation
function optionsDropDown(optionsButton){
  [...tasksBox.children].forEach(task => {
    let dropDown = task.children[4];
    dropDown.classList.remove("active");
  });
  const dropDown = optionsButton.closest(".drop-down");
  dropDown.classList.add("active");
}

// EDIT Task
function editTask(editButton){
  [...tasksBox.children].forEach(task => {
    task.classList.remove("edit-active");
  });
  const task = editButton.closest(".task");
  const editField = task.querySelector(".edit-field");
  task.classList.add("edit-active");
  editField.value = task.id;
  editField.focus();
}
// Confirm EDIT
function editConfirm(confirmButton){
  const task = confirmButton.closest(".task");
  const taskName = task.id;
  const editField = task.querySelector(".edit-field");
  const label = task.querySelector("label");
  let tasksObject = JSON.parse(window.localStorage.Tasks);
  const objIndex = tasksObject.map(obj => obj.title).indexOf(taskName);
  const newName = editField.value;

  if(newName !== taskName){
    if(!tasksObject.map(key => key.title === newName).includes(true)){
      tasksObject[objIndex]["title"] = newName;
      tasksObject = JSON.stringify(tasksObject);
      window.localStorage.Tasks = tasksObject;
      task.id = newName;
      task.classList.remove("edit-active");
      label.innerHTML = newName;
    }else{
      console.log("Task with the same name already exists!");
      editField.focus();
    }
  }else{
    task.classList.remove("edit-active");
  }
}

// DELETE Task
function deleteTask(deleteButton){
  const task = deleteButton.closest(".task");
  const taskName = task.id;
  let tasksObject = JSON.parse(window.localStorage.Tasks);
  const objIndex = tasksObject.map(obj => obj.title).indexOf(taskName);

  delete tasksObject[objIndex];

  tasksObject = Object.values(tasksObject);
  tasksObject = JSON.stringify(tasksObject);  
  window.localStorage.Tasks = tasksObject;

  task.remove()
}




// Add Task (Function)
function addTask(taskName){
  const task = createTask(taskName);
  // Check if "Tasks Object" is available in local storage
  // If NOT then add the first element
  if(window.localStorage.Tasks === undefined){
    let tasksObject = JSON.stringify([{"title":taskName, "checked":false}]);
    window.localStorage.Tasks = tasksObject;
    tasksBox.append(task);
  }
  // If "Tasks Object" is available then just adjust the object and re-add it
  else{
    let tasksObject = JSON.parse(window.localStorage.Tasks);
    if(!tasksObject.map(key => key.title === taskName).includes(true)){
      tasksObject.push({"title":taskName, "checked":false});
      tasksObject = JSON.stringify(tasksObject);
      window.localStorage.Tasks = tasksObject;
      tasksBox.append(task);
      textField.value = "";
    }else{
      console.log("Task with the same name already exists!");
    }
  }
}

// Update Checkbox Status
function checkBox(checkBox){
  const taskName = checkBox.closest(".task").id;
  let tasksObject = JSON.parse(window.localStorage.Tasks);
  const taskID = tasksObject.map(obj => obj.title).indexOf(taskName);
  if(checkBox.checked === true){
    tasksObject[taskID]["checked"] = true;
  }
  else{
    tasksObject[taskID]["checked"] = false;
  }
  tasksObject = JSON.stringify(tasksObject);
  window.localStorage.Tasks = tasksObject;
}


// Create Task Element (Function)
function createTask(taskName){

  const editField = document.createElement("input");
  editField.classList.add("edit-field");
  // editField.value = taskName;

  const confirmButton = document.createElement("button");
  confirmButton.classList.add("edit-confirm");
  confirmButton.append(document.createTextNode("Confirm"));
  confirmButton.setAttribute("onclick", "editConfirm(this)");

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = taskName + "-checkbox";
  checkBox.setAttribute("onclick", "checkBox(this)");
  
  const span = document.createElement("span");
  span.append(document.createTextNode(taskName));

  const label = document.createElement("label");
  label.setAttribute("for", taskName + "-checkbox");
  label.append(span);
  
  const icon = document.createElement("img");
  icon.setAttribute("src", "icons/gear.svg");

  const button = document.createElement("button");
  button.classList.add("options-btn");
  button.append(icon);
  
  const editOption = document.createElement("div");
  editOption.append(document.createTextNode("Edit"));
  editOption.classList.add("edit", "option");

  const deleteOption = document.createElement("div");
  deleteOption.append(document.createTextNode("Delete"));
  deleteOption.classList.add("delete", "option");

  const options = document.createElement("div");
  options.classList.add("options");
  options.append(editOption, deleteOption);

  const dropDown = document.createElement("div");
  dropDown.classList.add("drop-down");
  dropDown.append(button, options);
  
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task");
  taskContainer.id = taskName;
  taskContainer.append(editField, confirmButton, checkBox, label, dropDown)

  return taskContainer;
}


function textValidation(text){
  return text.length > 0 && text.length <= 40 ? true : false;
}