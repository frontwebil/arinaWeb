import { portfolioData } from "./jsData/portfolio.js";

let SLIDES_PER_PAGE_PORTFOLIO = 3;
const screenWidth = window.screen.width;
if (screenWidth <= 1265) {
  SLIDES_PER_PAGE_PORTFOLIO = 2;
}
if (screenWidth <= 850) {
  SLIDES_PER_PAGE_PORTFOLIO = 1;
}

let currentSlideIndexPortfolio = 0;

function initPortfolioSlider() {
  const slidesContainer = document.querySelector("#portfolio-slides");
  const buttonPrevPortfolio = document.querySelector(
    ".controls-portfolio-prev"
  );
  const buttonNextPortfolio = document.querySelector(
    ".controls-portfolio-next"
  );
  const indicatorsPortfolio = document.querySelector(".indicators-portfolio");

  function createPortfolioBlock(project) {
    // Skip empty projects
    if (!project.title) return "";

    return `
      <div class="portfolio-slide-block">
        <img src="${project.img}" alt="" class="portfolio-slide-block-img">
        <div class="portfolio-slide-block-type">
          ${project.type
            .map(
              (el) => `<p class="portfolio-slide-block-type-element">${el}</p>`
            )
            .join("")}
        </div>
        <h2 class="portfolio-slide-block-title">${project.title}</h2>
        <h2 class="portfolio-slide-block-subtitle">${project.subTitle}</h2>
        <p class="portfolio-slide-block-text text-s">${project.text}</p>
      </div>
    `;
  }

  function updateSlides() {
    const filteredProjects = portfolioData.filter((project) => project.title);
    const totalSlides = Math.ceil(
      filteredProjects.length / SLIDES_PER_PAGE_PORTFOLIO
    );
    const currentSlide = document.querySelector(".portfolio-slide.active");

    // Create new slide
    const newSlide = document.createElement("div");
    newSlide.className = "portfolio-slide";

    const startIdx = currentSlideIndexPortfolio * SLIDES_PER_PAGE_PORTFOLIO;
    const endIdx = Math.min(
      startIdx + SLIDES_PER_PAGE_PORTFOLIO,
      filteredProjects.length
    );

    const slideContent = filteredProjects
      .slice(startIdx, endIdx)
      .map((project) => createPortfolioBlock(project))
      .join("");

    newSlide.innerHTML = `<div class="slide-blocks">${slideContent}</div>`;

    // Add new slide to container
    if (currentSlide) {
      // Fade out current slide
      currentSlide.style.opacity = "0";
      currentSlide.style.visibility = "hidden";

      // Wait for fade out animation
      setTimeout(() => {
        currentSlide.remove();
        slidesContainer.appendChild(newSlide);

        // Trigger reflow
        void newSlide.offsetWidth;

        // Add active class to trigger fade in
        newSlide.classList.add("active");
      }, 200);
    } else {
      slidesContainer.appendChild(newSlide);
      setTimeout(() => {
        newSlide.classList.add("active");
      }, 0);
    }

    updatePagination(totalSlides);
  }

  function updatePagination(totalSlides) {
    indicatorsPortfolio.innerHTML = "";

    if (totalSlides <= 5) {
      for (let i = 0; i < totalSlides; i++) {
        addPageButton(i);
      }
    } else {
      if (currentSlideIndexPortfolio > 2) {
        addPageButton(0);
        addEllipsis();
      }

      for (
        let i = Math.max(0, currentSlideIndexPortfolio - 1);
        i <= Math.min(totalSlides - 1, currentSlideIndexPortfolio + 1);
        i++
      ) {
        addPageButton(i);
      }

      if (currentSlideIndexPortfolio < totalSlides - 3) {
        addEllipsis();
        addPageButton(totalSlides - 1);
      }
    }
  }

  function addPageButton(pageNum) {
    const button = document.createElement("div");
    button.className = `indicator-portfolio${
      pageNum === currentSlideIndexPortfolio ? " active" : ""
    }`;
    button.dataset.portfolio = pageNum;
    button.textContent = pageNum + 1;
    indicatorsPortfolio.appendChild(button);
  }

  function addEllipsis() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    indicatorsPortfolio.appendChild(span);
  }

  function nextSlide() {
    const filteredProjects = portfolioData.filter((project) => project.title);
    const totalSlides = Math.ceil(
      filteredProjects.length / SLIDES_PER_PAGE_PORTFOLIO
    );
    if (currentSlideIndexPortfolio < totalSlides - 1) {
      currentSlideIndexPortfolio++;
      updateSlides();
    }
  }

  function prevSlide() {
    if (currentSlideIndexPortfolio > 0) {
      currentSlideIndexPortfolio--;
      updateSlides();
    }
  }

  // Touch events
  let startX, endX;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    endX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (!endX) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Event Listeners
  buttonNextPortfolio.addEventListener("click", nextSlide);
  buttonPrevPortfolio.addEventListener("click", prevSlide);

  indicatorsPortfolio.addEventListener("click", (event) => {
    const clickedIndicator = event.target;
    if (clickedIndicator.classList.contains("indicator-portfolio")) {
      currentSlideIndexPortfolio = parseInt(
        clickedIndicator.dataset.portfolio,
        10
      );
      updateSlides();
    }
  });

  slidesContainer.addEventListener("touchstart", handleTouchStart);
  slidesContainer.addEventListener("touchmove", handleTouchMove);
  slidesContainer.addEventListener("touchend", handleTouchEnd);

  // Initial render
  updateSlides();
}

document.addEventListener("DOMContentLoaded", initPortfolioSlider);

// Service Tabs

let currentTab = 0;

const tabs = document.querySelectorAll(".services-tab-title");
const content = document.querySelectorAll(".services-tabs-content");

const setCurrentTab = (id) => {
  currentTab = id;
};

tabs.forEach((el, i) => {
  if (currentTab === i) {
    el.classList.add("active");
  }
  el.addEventListener("click", () => {
    tabs.forEach((el) => {
      el.classList.remove("active");
    });
    setCurrentTab(i);
    content.forEach((el, i) => {
      el.classList.remove("active");
      if (currentTab === i) {
        el.classList.add("active");
      }
    });
    if (currentTab === i) {
      el.classList.add("active");
    }
  });
});

content.forEach((el, i) => {
  el.classList.remove("active");
  if (currentTab === i) {
    el.classList.add("active");
  }
});
