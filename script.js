let darkModeBtn = document.getElementById("darkModeBtn");
let charCount = document.getElementById("charCount");

let title = document.getElementById("title");
let description = document.getElementById("description");
let category = document.getElementById("category");
let priority = document.getElementById("priority");

let addBtn = document.getElementById("addBtn");

let notesContainer = document.getElementById("notesContainer");

let message = document.getElementById("message");

let searchInput = document.getElementById("searchInput");


// ================= DARK MODE =================

let flag = 0;

darkModeBtn.addEventListener("click", function () {

    if (flag == 0) {

        document.body.style.backgroundColor = "black";
        document.body.style.color = "white";

        charCount.style.color = "white";

        flag = 1;

    } else {

        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";

        charCount.style.color = "black";

        flag = 0;
    }
});


// ================= CHARACTER COUNT =================

description.addEventListener("input", function () {

    let count = description.value.length;

    charCount.innerText = count + "/200 Characters";
});


// ================= LOAD SAVED NOTES =================

let savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

savedNotes.forEach(function (note) {

    createNote(note);

});


// ================= ADD NOTE =================

addBtn.addEventListener("click", function (event) {

    event.preventDefault();

    if (
        title.value == "" ||
        description.value == "" ||
        category.value == "" ||
        priority.value == ""
    ) {

        message.innerText = "All Fields Are Required";

        message.style.color = "red";

        return;
    }

    let currentDate = new Date();

    let noteObj = {

        id: Date.now(),

        title: title.value,

        description: description.value,

        category: category.value,

        priority: priority.value,

        date: currentDate.toLocaleDateString(),

        time: currentDate.toLocaleTimeString()
    };

    
    let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

    notesArray.push(noteObj);

    localStorage.setItem("notes", JSON.stringify(notesArray));

    
    createNote(noteObj);

    
    message.innerText = "Notes Added Successfully";

    message.style.color = "green";

    setTimeout(function () {

        message.innerText = "";

    }, 2000);

    
    title.value = "";
    description.value = "";
    category.value = "";
    priority.value = "";

    charCount.innerText = "0/200 Characters";
});


// ================= CREATE NOTE FUNCTION =================

function createNote(noteObj) {

    let noteDiv = document.createElement("div");

    noteDiv.classList.add("note");

    noteDiv.innerHTML = `

        <h2>${noteObj.title}</h2>

        <p>${noteObj.description}</p>

        <h4>Category : ${noteObj.category}</h4>

        <h5>Priority : ${noteObj.priority}</h5>

        <h6 class="date">Date : ${noteObj.date}</h6>

        <h6 class="time">Time : ${noteObj.time}</h6>

        <button class="deleteBtn">Delete</button>

        <button class="editBtn">Edit</button>
    `;

    notesContainer.appendChild(noteDiv);


    // ================= DELETE NOTE =================

    let deleteBtn = noteDiv.querySelector(".deleteBtn");

    deleteBtn.addEventListener("click", function () {

        noteDiv.remove();

        let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

        notesArray = notesArray.filter(function (item) {

            return item.id !== noteObj.id;

        });

        localStorage.setItem("notes", JSON.stringify(notesArray));

        message.innerText = "Note Deleted Successfully";

        message.style.color = "red";

        setTimeout(function () {

            message.innerText = "";

        }, 2000);
    });


    // ================= EDIT NOTE =================

    let editBtn = noteDiv.querySelector(".editBtn");

    editBtn.addEventListener("click", function () {

        let newTitle = prompt("Enter New Title", noteObj.title);

        let newDescription = prompt("Enter New Description", noteObj.description);

        if (newTitle == null || newDescription == null) {

            return;
        }

        noteObj.title = newTitle;

        noteObj.description = newDescription;

        
        noteDiv.innerHTML = `

            <h2>${noteObj.title}</h2>

            <p>${noteObj.description}</p>

            <h4>Category : ${noteObj.category}</h4>

            <h5>Priority : ${noteObj.priority}</h5>

            <h6>Date : ${noteObj.date}</h6>

            <h6>Time : ${noteObj.time}</h6>

            <button class="deleteBtn">Delete</button>

            <button class="editBtn">Edit</button>
        `;

        
        let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

        notesArray = notesArray.map(function (item) {

            if (item.id === noteObj.id) {

                return noteObj;
            }

            return item;
        });

        localStorage.setItem("notes", JSON.stringify(notesArray));

        
        noteDiv.remove();

        createNote(noteObj);

        message.innerText = "Note Edited Successfully";

        message.style.color = "green";

        setTimeout(function () {

            message.innerText = "";

        }, 2000);
    });
}


// ================= SEARCH NOTES =================

searchInput.addEventListener("input", function () {

    let searchValue = searchInput.value.toLowerCase();

    let allNotes = document.querySelectorAll(".note");

    let found = false;

    allNotes.forEach(function (note) {

        let noteText = note.innerText.toLowerCase();

        if (noteText.includes(searchValue)) {

            note.style.display = "block";

            found = true;

        } else {

            note.style.display = "none";
        }
    });

    if (found == false) {

        message.innerText = "Notes Not Found";

        message.style.color = "red";

    } else {

        message.innerText = "";
    }
});