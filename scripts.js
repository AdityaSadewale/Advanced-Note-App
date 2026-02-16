document.addEventListener("DOMContentLoaded", () => {

    const PASSWORD = "1234"; // 1234 is Password of lock screen...

    const lockScreen = document.getElementById("lockScreen");
    const unlockBtn = document.getElementById("unlockBtn");
    const passwordInput = document.getElementById("passwordInput");
    const app = document.querySelector(".app");

    const notesContainer = document.querySelector(".notes-container");
    const createBtn = document.getElementById("createBtn");
    const themeToggle = document.getElementById("themeToggle");
    const searchInput = document.getElementById("searchInput");
    const saveStatus = document.getElementById("saveStatus");
    const addFolderBtn = document.getElementById("addFolderBtn");
    const folderList = document.getElementById("folderList");

    /* 🔐 PASSWORD */
    unlockBtn.addEventListener("click", () => {
        if (passwordInput.value === PASSWORD) {
            lockScreen.style.display = "none";
            app.classList.remove("hidden");
        } else {
            alert("Wrong password!");
        }
    });

    /* LOAD NOTES */
    loadNotes();

    function loadNotes() {
        notesContainer.innerHTML = localStorage.getItem("notes") || "";
        enableDrag();
    }

    /* SAVE NOTES */
    function saveNotes() {
        saveStatus.textContent = "Saving...";
        localStorage.setItem("notes", notesContainer.innerHTML);
        setTimeout(() => {
            saveStatus.textContent = "Saved ✓";
        }, 400);
    }

    /* CREATE NOTE */
    createBtn.addEventListener("click", () => {
        const note = document.createElement("div");
        note.className = "note yellow";
        note.draggable = true;

        note.innerHTML = `
            <div class="top">
                <button class="color">🎨</button>
                <button class="pin">📌</button>
                <button class="delete">✖</button>
            </div>
            <input placeholder="Title">
            <textarea placeholder="Write something..."></textarea>
            <small>${new Date().toLocaleString()}</small>
        `;

        notesContainer.prepend(note);
        saveNotes();
        enableDrag();
    });

    /* NOTE ACTIONS */
    notesContainer.addEventListener("click", (e) => {
        const note = e.target.closest(".note");
        if (!note) return;

        if (e.target.classList.contains("delete")) note.remove();
        if (e.target.classList.contains("pin")) note.classList.toggle("pinned");
        if (e.target.classList.contains("color")) {
            if (note.classList.contains("yellow")) note.className = "note blue";
            else if (note.classList.contains("blue")) note.className = "note green";
            else note.className = "note yellow";
        }

        saveNotes();
    });

    /* AUTO SAVE */
    notesContainer.addEventListener("input", saveNotes);

    /* SEARCH */
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll(".note").forEach(note => {
            note.style.display = note.innerText.toLowerCase().includes(term) ? "block" : "none";
        });
    });

    /* DARK MODE TOGGLE */
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });

    /* ADD FOLDER */
    addFolderBtn.addEventListener("click", () => {
        const name = prompt("Folder name?");
        if (!name) return;
        const li = document.createElement("li");
        li.textContent = name;
        folderList.appendChild(li);
    });

    /* DRAG & DROP */
    function enableDrag() {
        const notes = document.querySelectorAll(".note");

        notes.forEach(note => {
            note.addEventListener("dragstart", () => note.classList.add("dragging"));
            note.addEventListener("dragend", () => {
                note.classList.remove("dragging");
                saveNotes();
            });
        });

        notesContainer.addEventListener("dragover", e => {
            e.preventDefault();
            const dragging = document.querySelector(".dragging");
            const afterElement = [...notesContainer.querySelectorAll(".note:not(.dragging)")]
                .find(note => e.clientY <= note.offsetTop + note.offsetHeight / 2);
            if (afterElement == null) notesContainer.appendChild(dragging);
            else notesContainer.insertBefore(dragging, afterElement);
        });
    }

});
