const texts = ['W', 'e', 'l', 'c', 'o', 'm', 'e', ':', ')'];
const number_of_particle = 12;

const welcomeContainer = document.getElementById("welcome-container");

if (welcomeContainer) {
  for (let i = 0; i < texts.length; i++) {
    const background = document.createElement("div");
    background.className = "background" + i;
    welcomeContainer.appendChild(background);
  }

  for (let i = 0; i < texts.length; i++) {
    const text = document.createElement("div");
    text.className = "text" + i;
    text.innerText = texts[i];
    welcomeContainer.appendChild(text);
  }

  for (let i = 0; i < texts.length; i++) {
    const frame = document.createElement("div");
    frame.className = "frame" + i;
    welcomeContainer.appendChild(frame);
  }

  for (let i = 0; i < texts.length; i++) {
    for (let j = 0; j < number_of_particle; j++) {
      const particle = document.createElement("div");
      particle.className = "particle" + i + "_" + j;
      welcomeContainer.appendChild(particle);
    }
  }
}

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(div => div.style.display = "none");

  const target = document.getElementById(screenId);
  if (target) {
    target.style.display = "block";
  }
}
setTimeout(() => {
    showScreen("entry-form");
  }, 4000); 
  
const registerButton = document.getElementById("registerBtn");
const loginButton = document.getElementById("loginBtn");
const container = document.getElementById("container");

registerButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});