const books = [];
const RENDER_EVENT = "render-event";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";
const btnOk = document.querySelector("dialog button");
const dialog = document.querySelector("dialog");
const check = document.getElementById("inputBookIsComplete");
const btnBookSubmit = document.getElementById("bookSubmit");
const textContent = document.getElementById("textContent");
const btnSearchBook = document.getElementById("searchSubmit");
const searchText = document.getElementById("searchBookTitle");

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

check.addEventListener("click", () => {
  if (check.checked) {
    btnBookSubmit.innerHTML = "Masukan Buku ke rak <span>Selesai dibaca</span>";
  } else {
    btnBookSubmit.innerHTML =
      "Masukan Buku ke rak <span>Belum selesai dibaca</span>";
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;
  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);

  container.setAttribute("id", `book-$(bookObject.id)`);
  const removeButton = document.createElement("button");
  removeButton.classList.add("red");
  removeButton.innerText = "Hapus Buku";
  removeButton.addEventListener("click", function () {
    removeTaskFromCompleted(bookObject.id);
  });

  const editButton = document.createElement("button");
  editButton.classList.add("white");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", () => {
    openFormEdit(bookObject.id);
  });

  const wraperAction = document.createElement("div");
  wraperAction.classList.add("action");
  const undoButton = document.createElement("button");
  undoButton.classList.add("green");
  undoButton.innerText = "Belum selesai dibaca";
  undoButton.addEventListener("click", function () {
    undoTaskFromCompleted(bookObject.id);
  });

  const finishButton = document.createElement("button");
  finishButton.classList.add("green");
  finishButton.innerText = "Sudah selesai baca";

  finishButton.addEventListener("click", function () {
    addTaskToCompleted(bookObject.id);
  });

  if (bookObject.isComplete) {
    wraperAction.append(undoButton, removeButton, editButton);

    container.append(wraperAction);
  } else {
    wraperAction.append(finishButton, removeButton, editButton);

    container.append(wraperAction);
  }

  return container;
}

const keluar = document.getElementById("cancelEdit");
keluar.addEventListener("click", () => {
  closeFormEdit();
});

openFormEdit = (bookId) => {
  document.getElementById("editSection").style.display = "block";
  const editTitle = document.getElementById("editBookTitle");
  const editAuthors = document.getElementById("editBookAuthor");
  const editYears = document.getElementById("editBookYear");
  const publised = parseInt(editYears);
  const editCheckedBook = document.getElementById("editBookIsComplete");
  const bookTarget = findBookIndex(bookId);
  editTitle.value = books[bookTarget].title;
  editAuthors.value = books[bookTarget].author;
  editYears.value = books[bookTarget].year;
  editCheckedBook.checked = books[bookTarget].isComplete;

  const simpan = document.getElementById("bookEdit");
  simpan.addEventListener("click", (event) => {
    event.preventDefault();
    const editTitle = document.getElementById("editBookTitle");
    const editAuthors = document.getElementById("editBookAuthor");
    const editYears = document.getElementById("editBookYear");
    const publised = parseInt(editYears.value);
    const editCheckedBook = document.getElementById("editBookIsComplete");

    const bookTarget = findBookIndex(bookId);
    books[bookTarget].title = editTitle.value;
    books[bookTarget].author = editAuthors.value;
    books[bookTarget].year = publised;
    books[bookTarget].isComplete = editCheckedBook.checked ? true : false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    console.log(books[bookTarget]);
    closeFormEdit();
  });
};

closeFormEdit = () => {
  document.getElementById("editSection").style.display = "none";
};
function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const authors = document.getElementById("inputBookAuthor").value;
  const years = document.getElementById("inputBookYear").value;
  const publised = parseInt(years);
  const checkedBook = check.checked ? true : false;
  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    textTitle,
    authors,
    publised,
    checkedBook
  );
  if (textTitle === "") {
    alert("Judul harus diisi");
    return false;
  } else if (authors === "") {
    alert("Penulis harus diisi");
    return false;
  } else if (years === "") {
    alert("Tahun harus diisi");
    return false;
  } else {
    books.push(bookObject);
    alert("buku berhasil disimpan");
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (books[bookTarget] == null) return;
  confirm("Apakah anda ingin memindahkan buku ini ke Rak Sudah selesai dibaca?")
    ? (books[bookTarget].isComplete = true)
    : confirm.close();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  console.log(books);
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  confirm("Apakah anda ingin menghapusnya?")
    ? books.splice(bookTarget, 1)
    : confirm.close();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  console.log(books);
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (books[bookTarget] == null) return;

  confirm("Apakah anda ingin memindahkan buku ini ke Rak belum selesai dibaca?")
    ? (books[bookTarget].isComplete = false)
    : confirm.close();
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  console.log(books);
}

function resetForm() {
  document.getElementById("inputBook").reset();
}

document.addEventListener("DOMContentLoaded", function () {
  const btnSave = document.getElementById("bookSubmit");
  btnSave.addEventListener("click", function (event) {
    event.preventDefault();
    addBook();
    console.log(books);
    resetForm();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  toDisplay(books);
});

toDisplay = (books) => {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) uncompletedBookList.append(bookElement);
    else completedBookList.append(bookElement);
  }
};

btnSearchBook.addEventListener("click", function (event) {
  event.preventDefault();
  const searchBook = books.filter((b) =>
    b.title.includes(searchText.value.toLowerCase())
  );
  toDisplay(searchBook);
  console.log(searchBook);
});
