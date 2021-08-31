let action = "";
let editableCarId = 0;
let editableCarImgPath = "";
const form = document.getElementById("car-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (action === "edit") {
    editCar(editableCarId, form, editableCarImgPath);
  } else if (action === "add") {
    addNewCar(form);
  } else {
    console.log("invalid action");
  }
});

function buildActionsButtons(carData) {
  let actionsBtns = document.createElement("div");
  actionsBtns.classList.add("actions-buttons");

  let featureBtn = buildFeatureButton(carData);
  actionsBtns.appendChild(featureBtn);

  let editBtn = buildEditButton(carData);
  actionsBtns.appendChild(editBtn);

  let deleteBtn = buildDeleteButton(carData.id);
  actionsBtns.appendChild(deleteBtn);
  return actionsBtns;
}

function buildFeatureButton(carData) {
  let featureBtn = document.createElement("img");
  featureBtn.classList.add("action-button");

  fetch("http://localhost:3000/carousel/" + carData.id)
    .then(function (response) {
      if (response.status === 404) {
        featureBtn.src = "img/feature-unchecked.png";
      } else {
        featureBtn.src = "img/feature-checked.png";
      }
    })
    .catch(function (err) {
      console.log("Error: ", err);
    });

  featureBtn.addEventListener("click", function () {
    fetch("http://localhost:3000/carousel/" + carData.id)
      .then(function (response) {
        if (response.status === 404) {
          console.log("STARTED FEATURING CAR WITH ID: " + carData.id);
          featureBtn.src = "img/feature-checked.png";
          const requestBody = {
            id: carData.id,
            imgPath: carData.imgPath,
            make: carData.make,
            model: carData.model,
            price: carData.price,
          };
          fetch("http://localhost:3000/carousel/", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            console.log("Request complete! response:", res);
            loadCarousel();
          });
        } else {
          console.log("STOPPED FEATURING CAR WITH ID: " + carData.id);
          featureBtn.src = "img/feature-unchecked.png";
          fetch("http://localhost:3000/carousel/" + carData.id, {
            method: "DELETE",
          }).then((res) => {
            console.log("Request complete! response:", res);
            loadCarousel();
          });
        }
      })
      .catch(function (err) {
        console.log("Error: ", err);
      });
  });

  return featureBtn;
}

function buildEditButton(carData) {
  let editBtn = document.createElement("img");
  editBtn.classList.add("action-button");
  editBtn.src = "img/edit.png";

  editBtn.addEventListener("click", function () {
    modal.style.display = "block";
    form.elements["make"].value = carData.make;
    form.elements["model"].value = carData.model;
    form.elements["power"].value = carData.power;
    form.elements["topSpeed"].value = carData.topSpeed;
    form.elements["price"].value = carData.price;
    action = "edit";
    editableCarId = carData.id;
    editableCarImgPath = carData.imgPath;
  });

  return editBtn;
}

function buildDeleteButton(carId) {
  let deleteBtn = document.createElement("img");
  deleteBtn.classList.add("action-button");
  deleteBtn.src = "img/delete.png";

  deleteBtn.addEventListener("click", function () {
    fetch("http://localhost:3000/shop/" + carId, {
      method: "DELETE",
    }).then((res) => {
      console.log("Request complete! response:", res);
      loadShop();
    });
  });

  return deleteBtn;
}

function buildShopItem(dataItem) {
  let li = document.createElement("li");

  let actionsBtn = buildActionsButtons(dataItem);
  li.appendChild(actionsBtn);

  let img = document.createElement("img");
  img.src = dataItem.imgPath;
  img.alt = dataItem.make + "-" + dataItem.model;
  li.appendChild(img);

  let fullName = document.createElement("p");
  fullName.textContent = "Name: " + dataItem.make + " " + dataItem.model;
  li.appendChild(fullName);

  let power = document.createElement("p");
  power.textContent = "Power: " + dataItem.power;
  li.appendChild(power);

  let topSpeed = document.createElement("p");
  topSpeed.textContent = "Top speed: " + dataItem.topSpeed;
  li.appendChild(topSpeed);

  let price = document.createElement("h3");
  price.textContent = "Price: " + dataItem.price;
  li.appendChild(price);

  li.classList.add("item");
  li.id = "shop-item-" + dataItem.id;
  return li;
}

function loadShopItems(data) {
  const itemContainer = document.getElementById("shop-items");
  while (itemContainer.firstChild) {
    if (itemContainer.firstChild.firstChild) {
      itemContainer.removeChild(itemContainer.firstChild);
    } else {
      break;
    }
  }
  for (let i = 0; i < data.length; i++) {
    const li = buildShopItem(data[i]);
    itemContainer.appendChild(li);
  }
}

function loadShop() {
  fetch("http://localhost:3000/shop")
    .then(function (response) {
      if (response.status !== 200) {
        console.log("Error");
        return;
      }

      response.json().then(function (data) {
        loadShopItems(data);
      });
    })
    .catch(function (err) {
      console.log("Error: ", err);
    });
}

function buildCarouselItem(dataItem) {
  let carouselItem = document.createElement("div");

  let img = document.createElement("img");
  img.src = dataItem.imgPath;
  img.alt = dataItem.make + "-" + dataItem.model;
  carouselItem.appendChild(img);

  let fullName = document.createElement("h1");
  fullName.textContent = dataItem.make + " " + dataItem.model;
  carouselItem.appendChild(fullName);

  let price = document.createElement("h2");
  price.textContent = dataItem.price + " Eur";
  carouselItem.appendChild(price);

  carouselItem.classList.add("carousel-item", "fade");
  return carouselItem;
}

function loadCarouselItems(data) {
  const itemContainer = document.getElementById("carousel-items");
  console.log(itemContainer.firstChild.firstChild);
  while (itemContainer.firstChild) {
    if (itemContainer.firstChild.firstChild) {
      itemContainer.removeChild(itemContainer.firstChild);
    } else {
      break;
    }
  }
  for (let i = 0; i < data.length; i++) {
    const carouselItem = buildCarouselItem(data[i]);
    itemContainer.prepend(carouselItem);
  }
}

function loadCarousel() {
  fetch("http://localhost:3000/carousel")
    .then(function (response) {
      if (response.status !== 200) {
        console.log("Error");
        return;
      }

      response.json().then(function (data) {
        loadCarouselItems(data);
        showSlides(slideIndex);
      });
    })
    .catch(function (err) {
      console.log("Error: ", err);
    });
}

let slideIndex = 1;
function plusSlides(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName("carousel-item");
  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex - 1].style.display = "block";
}

var modal = document.getElementById("add-car-modal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function openCarAdditionModal() {
  modal.style.display = "block";
  form.elements["make"].value = "";
  form.elements["model"].value = "";
  form.elements["power"].value = "";
  form.elements["topSpeed"].value = "";
  form.elements["price"].value = "";
  action = "add";
}

function addNewCar(form) {
  console.log("Called Add new car");
  const requestBody = {
    imgPath: "img/no-image.png",
    make: form.elements["make"].value,
    model: form.elements["model"].value,
    power: form.elements["power"].value,
    topSpeed: form.elements["topSpeed"].value,
    price: form.elements["price"].value,
  };
  fetch("http://localhost:3000/shop/", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log("Request complete! response:", res);
    modal.style.display = "none";
    loadShop();
  });
}

function editCar(carId, form, imgPath) {
  console.log("Called Edit new car");
  const requestBody = {
    make: form.elements["make"].value,
    model: form.elements["model"].value,
    power: form.elements["power"].value,
    topSpeed: form.elements["topSpeed"].value,
    price: form.elements["price"].value,
    imgPath: imgPath,
  };
  fetch("http://localhost:3000/shop/" + carId, {
    method: "PUT",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    console.log("Request complete! response:", res);
    modal.style.display = "none";
    loadShop();
  });
}

loadShop();
loadCarousel();
