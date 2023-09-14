const courseAPI = "http://localhost:3000/course"
const btnCancel = document.querySelector('#btn-cancel');
const listCourse = document.getElementById('area-list-task');
const addCourse = document.getElementById('btn-toggle-form');
const areaForm = document.getElementById('area-form');
const nameElement = document.getElementById('input-name');
const levelElement = document.getElementById('input-status');
const submitElement = document.getElementById('btn-submit');

// Controller
const main = ()=>{
    getListCourse(renderCourse);
    handleAddCourse();
    handleCancel();
}
main()

// Get all courses list
function getListCourse(cb){ 
    fetch(courseAPI)
        .then(res => res.json())
        .then(cb);
}

//Add
function handleAddCourse() {
    addCourse.onclick = () => {
        if(!areaForm.classList.toggle('d-none')){
            handleSubmitForm();
        }
    }
}

// get data
function handleSubmitForm(){
    submitElement.onclick = function(){
        let data = {
            name: nameElement.value,
            level: levelElement.value
        }
        saveCourse(data,function(){
            getListCourse(renderCourse)
        })
    }
}

// Save 
function saveCourse (data,cb){
    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    }
    fetch(courseAPI,option)
    .then(res => res.json())
    .then(cb)
}

// Delete
function handleDelete(id) {
    if(confirm("Bạn có muốn xóa công việc không?")){
        let option = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        fetch(courseAPI + "/" + id, option).then(res => res.json()).then(getListCourse(renderCourse));
    }
}

// Cancel
function handleCancel() {
    btnCancel.onclick = () => {
        areaForm.classList.toggle('d-none');
    }    
}

// Edit
function handleEdit(id, name, level){
    if(areaForm.classList.contains('d-none')){
        areaForm.classList.remove('d-none');
    }
    nameElement.value = name;
    levelElement.value = level;
    submitElement.innerText = 'Save';
    submitElement.onclick = () => {
        let data = {
            name: `${nameElement.value}`,
            level: `${levelElement.value}`
        };
        let option = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
        }
        fetch(courseAPI + "/" + id, option).then(res => res.json()).then(getListCourse(renderCourse));
        areaForm.classList.toggle('d-none');
    }
} 


// Render course list
function renderCourse (courses){
    var html = courses.map((value, index) =>{
        let level = (value.level === 'high') ? 'bg-danger': ((value.level === 'medium') ? 'bg-info': 'bg-dark');
        return `
            <tr>
                <td>${index + 1}</th>
                <td>${value.name}</td>
                <td><span class="badge ${level}">${value.level}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="handleEdit(${value.id}, '${value.name}', '${value.level}')">Edit</button>
                    <button class="btn btn-danger" onclick="handleDelete(${value.id})">Delete</button>
                </td>
            </tr>
        `
    })
    listCourse.innerHTML = html.join('');
}
