(() => {

  //it took me forever but finally I got it to work :'D

  // Variables
  const model = document.querySelector("#model");
  const hotspots = document.querySelectorAll(".Hotspot");
  // API URLs
  const infoBoxesUrl = "https://swiftpixel.com/earbud/api/infoboxes";
  const materialsUrl = "https://swiftpixel.com/earbud/api/materials";

  // Functions
  function modelLoaded() {
    hotspots.forEach(hotspot => {
      hotspot.style.display = "block";
    });
  }

  // Function to show the spinner
  function showSpinner() {
    const spinnerContainer = document.querySelector("#spinner-container");
    spinnerContainer.style.display = "block";
  }

  // Function to hide the spinner
  function hideSpinner() {
    const spinnerContainer = document.querySelector("#spinner-container");
    spinnerContainer.style.display = "none";
  }

  // Function to load info boxes

  function loadInfo() {
    showSpinner();
    console.log("Loading info boxes...");
    fetch(infoBoxesUrl)
      .then(response => {
        console.log("Info boxes response:", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(infoBoxes => {
        console.log("Info boxes data:", infoBoxes);
        if (infoBoxes && infoBoxes.length > 0) {
          infoBoxes.forEach((infoBox, index) => {
            let selected = document.querySelector(`#hotspot-${index + 1}`);
            let infotext = document.createElement('h2');
            infotext.textContent = infoBox.heading;
            let infopara = document.createElement('p');
            infopara.textContent = infoBox.description;
            let infoimage = document.createElement('img');
            infoimage.src = `images/${infoBox.thumbnail}`;
            infoimage.alt = "Description of the image";
            infoimage.classList.add("info-image");
            selected.appendChild(infotext);
            selected.appendChild(infopara);
            selected.appendChild(infoimage);
          });
        } else {
          console.error("No data received from the API for info boxes");
        }
      })
      .catch(error => {
        console.error("Error loading info boxes:", error);
        alert("Oops! Something went wrong while loading info boxes. Please try again later.");
      })
      .finally(() => {
        hideSpinner();
      });
  }

  // Function to load materials

  function loadMaterials() {
    showSpinner();
    fetch(materialsUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(materials => {
        if (materials && materials.length > 0) {
          const materialsList = document.querySelector('#materials-list');
          const template = document.querySelector('#materials-template');

          materials.forEach(material => {
            const clone = document.importNode(template.content, true);

            const headingElement = clone.querySelector('.material-heading');
            headingElement.textContent = material.heading;

            const descriptionElement = clone.querySelector('.material-description');
            descriptionElement.textContent = material.description;

            materialsList.appendChild(clone);
          });
        } else {
          console.error("No data received from the API for materials");
        }
      })
      .catch(error => {
        console.error("Error loading materials:", error);
        alert("Oops! Something went wrong while loading materials. Please try again later.");
      })
      .finally(() => {
        hideSpinner();
      });
  }

  // Event listeners
  model.addEventListener("load", modelLoaded);

  hotspots.forEach(function (hotspot) {
    hotspot.addEventListener("mouseover", showInfo);
    hotspot.addEventListener("mouseout", hideInfo);
  });

  // Additional functions
  function showInfo(e) {
    let selected = document.querySelector(`button[slot="${e.currentTarget.slot}"]> div`);
    gsap.to(selected, 1, { autoAlpha: 1 });
  }

  function hideInfo(e) {
    let selected = document.querySelector(`button[slot="${e.currentTarget.slot}"]> div`);
    gsap.to(selected, 1, { autoAlpha: 0 });
  }

  // Load data
  model.addEventListener("load", () => {
    modelLoaded();
    loadInfo();
    loadMaterials();
  });
})();
