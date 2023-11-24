async function fetchData() {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/videos/categories"
    );
    const data = await response.json();

    categoryButton(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// convert minute hours
function convertSecondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = "";

  if (hours > 0) {
    result += `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (minutes > 0) {
    if (result.length > 0) {
      result += " ";
    }
    result += `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  result += " ago";

  return result;
}

async function fetchDataById(categoryId = 1000) {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    );
    const categoryData = await response.json();
    const cardData = categoryData?.data;

    // Handle the fetched data for the specific category

    const cardDiv = document.getElementById("cardDiv");
    cardDiv.innerHTML = "";

    if (cardData.length > 0) {
      cardData.forEach((data) => {
        const authors = data?.authors[0];
        const card = document.createElement("div");
        card.classList.add("card", "col-lg-4", "col-md-6", "col-sm-12", "px-0");
        card.style.width = "300px";
        card.innerHTML = `

                <div class="position-relative">
                <img
                  
                  src=${data?.thumbnail}
                  class="card-img-top imgCard"
                  alt="..."
                />

                ${
                  data?.others?.posted_date !== undefined &&
                  data?.others?.posted_date !== ""
                    ? `<p class="bg-dark text-white p-1 rounded text-center position-absolute bottom-0 end-0 start-50" style="width: 150px; font-size: 12px">${convertSecondsToHMS(
                        data?.others?.posted_date
                      )}</p>`
                    : ""
                }
              </div>
                <div class="card-body">
                  <div class="d-flex">
                    <div class="me-3">
                      <img src=${
                        authors?.profile_picture
                      } class="rounded-circle" alt="PI" width="40px" height="40px" />
                    </div>
                    <div>
                      <h6 class="card-title fw-semibold">
                       ${data?.title}
                      </h6>
                      <p class="lh-1 fw-medium">${authors?.profile_name}
                      <span>
                       ${
                         authors?.verified !== "" &&
                         authors?.verified !== undefined
                           ? `
                       <img src="./verifyIcon.png" width="14px" height="14px"/>
                       `
                           : ``
                       }
                      </span>
                      </p>
                      <p class="fs-6">${data?.others?.views} Views</p>
                    </div>
                  </div>
                </div>

                `;
        cardDiv.appendChild(card);
      });
    } else {
      cardDiv.innerHTML = `
                <div class="text-center">
                <img src="./Icon.png" alt="this category data not found"/>
                <h3 class="fw-semibold mt-4">Ooops!! Sorry, There is no</br> content here</p>
                </div>

                `;
    }

    console.log(`Data for category ${categoryId}:`, categoryData);
  } catch (error) {
    console.error("Error fetching category data:", error);
  }
}

function categoryButton(categoryData) {
  console.log("Category Data:", categoryData);

  const categoryContainer = document.getElementById("category");

  // Check if categoryData is an array before using forEach
  if (Array.isArray(categoryData?.data)) {
    categoryData?.data.forEach((category) => {
      const div = document.createElement("div");
      div.classList.add("my-2", "px-2");
      const button = document.createElement("button");
      button.classList.add("btn", "btn-secondary");
      button.type = "submit";
      button.textContent = category.category;

      button.addEventListener("click", () => {
        document.querySelectorAll(".btn-secondary").forEach((btn) => {
          btn.classList.remove("btn-danger");
        });
        button.classList.toggle("btn-danger");
        fetchDataById(category.category_id);
      });
      div.appendChild(button);
      categoryContainer.appendChild(div);
    });
  } else {
    console.error("Category Data is not an array:", categoryData);
  }
}

// Call the fetchData function
fetchData();
fetchDataById();

document.getElementById("blogButton").addEventListener("click", function () {
  // Redirect to another HTML page
  window.location.href = "./blog.html";
});
