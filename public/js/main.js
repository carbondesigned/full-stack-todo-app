const delBtn = document.querySelectorAll(".fa-trash");
const item = document.querySelectorAll(".item span");
const completedItem = document.querySelectorAll(".item span.completed");

Array.from(item).forEach((ele) => {
  ele.addEventListener("click", markCompleted);
});

Array.from(completedItem).forEach((ele) => {
  ele.addEventListener("click", markIncomplete);
});

Array.from(delBtn).forEach((ele) => {
  ele.addEventListener("click", deleteItem);
});

async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteItem", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markCompleted() {
  const itemText = this.parentNode.childNodes[1].innerText;

  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (error) {}
}

async function markIncomplete() {
  const itemText = this.parentNode.childNodes[1].innerText;

  try {
    const response = await fetch("markIncomplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (error) {}
}
