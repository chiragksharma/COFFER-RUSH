"use strict";
var mainApp = {};
var firebase = app_firebase;
var userEmail = null;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        userEmail = user.email;
    } else {
        //redirect to login page
        window.location.replace("HTML/CaladriusChat.html");
    }
});
mainApp.logOut = () => {
    firebase.auth().signOut();
};
var db = firebase.firestore();
/*----------------DOM Elements-----------------*/
let title = document.querySelector("#title");
let author = document.querySelector("#author");
let numPages = document.querySelector("#numPages");
let status = document.querySelector("#status");
let addBook = document.querySelector("#addBook");
let modal = document.querySelector(".modal");
let table = document.querySelector("#list");
let listdiv = document.querySelector(".list");
let deletebtn = document.querySelector(".delbtn");
let statusbtn = document.querySelector(".statusbtn");
let myLibrary = [];
var mapLibrary = {};
var cloudData;
/*-----------------Function constructor---------------------*/
function Book(title, author, numPages, status) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.readStatus = status === "true" ? "Read" : " Not Read";
}

/*--------------------------Functions---------------------------- */
function addBookToLibrary(title, author, numPages, status) {
    const newBook = new Book(title, author, numPages, status);
    myLibrary.push(newBook);
}

function displayBooks() {
    mapLibrary = {};
    for (let i = 0; i < myLibrary.length; i++) {
        mapLibrary[myLibrary[i].title] = {
            author: myLibrary[i].author,
            numPages: myLibrary[i].numPages,
            readStatus: myLibrary[i].readStatus
        };

        table.insertAdjacentHTML(
            "beforeend",
            `
   <tr class="Book">
   <td>${myLibrary[i].title}</td>
   <td>${myLibrary[i].author}</td>
   <td>${myLibrary[i].numPages}</td>
   <td><button class="statusbtn">${myLibrary[i].readStatus}</button></td>
   <td><button class="delbtn">Delete</button></td>
   </tr>
   `
        );
    }
    mainApp.create();
}
mainApp.create = function() {
    // Add a new document in collection
    db.collection("users").doc(String(userEmail)).set(mapLibrary);
};

function updateTable() {
    //Updating UI
    let rows = document.querySelectorAll(".Book");
    for (let i = 0; i < rows.length; i++) {
        rows[i].remove();
    }
    displayBooks();
}

function toggleStatus(row) {
    let stsTitle = row.firstChild.nextElementSibling.innerHTML;
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title == stsTitle) {
            myLibrary[i].readStatus =
                myLibrary[i].readStatus == "Read" ? "Not Read" : "Read";
        }
    }
    updateTable();
}

function deleteBook(row) {
    let deltitle = row.firstChild.nextElementSibling.innerHTML;
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title == deltitle) {
            myLibrary.splice(i, 1);
        }
    }
    db.collection("users").doc(String(userEmail)).delete();
    updateTable();
}
/*-----------------------EVENT LISTENERS-------------------------*/
window.addEventListener("load", () => {
    db.collection("users")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                cloudData = doc.data();
                for (let i in cloudData) {
                    addBookToLibrary(
                        i,
                        cloudData[i].author,
                        cloudData[i].numPages,
                        cloudData[i].readStatus === "Read" ? "true" : "False"
                    );
                }
                updateTable();
            });
        });
});
addBook.addEventListener("click", (e) => {
    e.preventDefault();
    if (title.value == "") {
        alert("Title cannot be empty");
    } else if (author.value == "") {
        alert("Author field is empty");
    } else if (!parseInt(numPages.value)) {
        alert("Invalid Number of Pages ");
    } else {
        addBookToLibrary(
            title.value,
            author.value,
            parseInt(numPages.value),
            status.value
        );
        updateTable();
    }
    title.value = "";
    author.value = "";
    numPages.value = "";
});

//Delete Book
listdiv.addEventListener("click", function(e) {
    if (e.target.classList.contains("delbtn")) {
        //Delete that book
        let row = e.target.parentNode.parentNode;
        deleteBook(row);
    }
});
listdiv.addEventListener("click", function(e) {
    if (e.target.classList.contains("statusbtn")) {
        toggleStatus(e.target.parentNode.parentNode);
    }
});