const tableBody = document.getElementById("books-table-body");
const form = document.getElementById("add-book-form");
const bookIdInput = document.getElementById("book-id");
const submitBtn = document.getElementById("add-book-btn");
// console.log(submitButton);


    function loadBooks() {
      tableBody.innerHTML = `<tr><td colspan="6">Loading books...</td></tr>`; // Show loading

      fetch("/books")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((books) => {
          tableBody.innerHTML = ""; // Clear existing
          books.forEach((book) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.price}</td>
                    <td>${book.stock}</td>
                    <td>
                        <button class="edit-btn" data-id="${book.id}">Edit</button>
                        <button class="delete-btn" data-id="${book.id}">Delete</button>
                    </td>
                `;
            tableBody.appendChild(tr);
          });

          // After books are loaded, attach delete event listeners
          document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", handleDelete);
          });

          document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", handleEdit);
          });
        });
    }

// Function to handle delete
function handleDelete(e) {
    const id = e.target.dataset.id;
    fetch(`/books/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => loadBooks()); // Refresh list after deleting
}

// Initial load
loadBooks();


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const payload = {
    title: formData.get("title").trim(),
    author: formData.get("author").trim(),
    price: parseFloat(formData.get("price")),
    stock: parseInt(formData.get("stock"), 10),
  };

  if (
    !payload.title ||
    !payload.author ||
    isNaN(payload.price) ||
    isNaN(payload.stock)
  ) {
    return alert("Please provide valid values.");
  }

  const id = bookIdInput.value; // empty => create; value => update
  const url = id ? `/books/${id}` : "/books";
  const method = id ? "PUT" : "POST";

  submitBtn.disabled = true;
  submitBtn.textContent = id ? "Updating..." : "Adding...";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok)
        return res.json().then((b) => {
          throw new Error(b.message || "Request failed");
        });
      return res.json();
    })
    .then(() => {
      setFormToAddMode(); // reset to add mode (clears hidden id)
      loadBooks(); // refresh table
    })
    .catch((err) => {
      console.error(err);
      alert("Operation failed: " + err.message);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Add Book";
    });
});

function handleEdit(e) {
  const id = e.target.dataset.id;
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading...";

  fetch(`/books/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load book");
      return res.json();
    })
    .then((book) => {
      // fill the form
      form.title.value = book.title;
      form.author.value = book.author;
      form.price.value = book.price;
      form.stock.value = book.stock;
      bookIdInput.value = book.id; // put id into hidden input
      submitBtn.textContent = "Update Book"; // change button text
    })
    .catch((err) => {
      console.error(err);
      alert("Could not load book for editing");
    })
    .finally(() => (submitBtn.disabled = false));
}

function setFormToAddMode() {
  bookIdInput.value = "";
  form.reset();
  submitBtn.textContent = "Add Book";
}