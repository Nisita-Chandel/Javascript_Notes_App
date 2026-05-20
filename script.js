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

let deleteAllBtn = document.getElementById("deleteAllBtn");

let notesCount = document.getElementById("notesCount");




let darkMode = localStorage.getItem("darkMode");

if (darkMode === "enabled") {

    enableDarkMode();

}

darkModeBtn.addEventListener("click", function () {

    if (document.body.classList.contains("dark")) {

        disableDarkMode();

    } else {

        enableDarkMode();
    }
});

function enableDarkMode() {

    document.body.classList.add("dark");

    localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {

    document.body.classList.remove("dark");

    localStorage.setItem("darkMode", "disabled");
}




description.addEventListener("input", function () {

    let count = description.value.length;

    charCount.innerText = count + "/200 Characters";

    if (count > 200) {

        charCount.style.color = "red";

    } else {

        charCount.style.color = "green";
    }
});




let savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

savedNotes.sort((a, b) => b.id - a.id);

savedNotes.forEach(function (note) {

    createNote(note);
});

updateNotesCount();




addBtn.addEventListener("click", function (event) {

    event.preventDefault();

    if (
        title.value === "" ||
        description.value === "" ||
        category.value === "" ||
        priority.value === ""
    ) {

        showMessage("All Fields Are Required", "red");

        return;
    }

    if (description.value.length > 200) {

        showMessage("Description Too Long", "red");

        return;
    }

    let currentDate = new Date();

    let noteObj = {

        id: Date.now(),

        title: title.value,

        description: description.value,

        category: category.value,

        priority: priority.value,

        favorite: false,

        date: currentDate.toLocaleDateString(),

        time: currentDate.toLocaleTimeString()
    };

    let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

    notesArray.unshift(noteObj);

    localStorage.setItem("notes", JSON.stringify(notesArray));

    createNote(noteObj);

    updateNotesCount();

    showMessage("Note Added Successfully", "green");

    title.value = "";
    description.value = "";
    category.value = "";
    priority.value = "";

    charCount.innerText = "0/200 Characters";
});




function createNote(noteObj) {

    let noteDiv = document.createElement("div");

    noteDiv.classList.add("note");

    if (noteObj.favorite) {

        noteDiv.classList.add("favorite");
    }

    noteDiv.innerHTML = `

        <h2>${noteObj.title}</h2>

        <p>${noteObj.description}</p>

        <h4>Category : ${noteObj.category}</h4>

        <h5>Priority : ${noteObj.priority}</h5>

        <h6 class="date">Date : ${noteObj.date}</h6>

        <h6 class="time">Time : ${noteObj.time}</h6>

        <button class="favoriteBtn">
            ${noteObj.favorite ? "⭐ Unfavorite" : "⭐ Favorite"}
        </button>

        <button class="editBtn">Edit</button>

        <button class="deleteBtn">Delete</button>
    `;

    notesContainer.prepend(noteDiv);




    let deleteBtn = noteDiv.querySelector(".deleteBtn");

    deleteBtn.addEventListener("click", function () {

        noteDiv.remove();

        let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

        notesArray = notesArray.filter(function (item) {

            return item.id !== noteObj.id;
        });

        localStorage.setItem("notes", JSON.stringify(notesArray));

        updateNotesCount();

        checkEmptyNotes();

        showMessage("Note Deleted Successfully", "red");
    });




    let editBtn = noteDiv.querySelector(".editBtn");

    editBtn.addEventListener("click", function () {

        let newTitle = prompt("Enter New Title", noteObj.title);

        let newDescription = prompt(
            "Enter New Description",
            noteObj.description
        );

        if (newTitle === null || newDescription === null) {

            return;
        }

        noteObj.title = newTitle;

        noteObj.description = newDescription;

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

        showMessage("Note Edited Successfully", "green");
    });




    let favoriteBtn = noteDiv.querySelector(".favoriteBtn");

    favoriteBtn.addEventListener("click", function () {

        noteObj.favorite = !noteObj.favorite;

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
    });
}




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

    if (!found) {

        message.innerText = "Notes Not Found";

        message.style.color = "red";

    } else {

        message.innerText = "";
    }
});




deleteAllBtn.addEventListener("click", function () {

    let confirmDelete = confirm("Delete All Notes ?");

    if (confirmDelete) {

        localStorage.removeItem("notes");

        notesContainer.innerHTML = "";

        updateNotesCount();

        checkEmptyNotes();

        showMessage("All Notes Deleted", "red");
    }
});




function updateNotesCount() {

    let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

    notesCount.innerText = "Total Notes : " + notesArray.length;
}




function checkEmptyNotes() {

    let notesArray = JSON.parse(localStorage.getItem("notes")) || [];

    if (notesArray.length === 0) {

        notesContainer.innerHTML = "<h2>No Notes Available</h2>";
    }
}




function showMessage(text, color) {

    message.innerText = text;

    message.style.color = color;

    setTimeout(function () {

        message.innerText = "";

    }, 2000);
}