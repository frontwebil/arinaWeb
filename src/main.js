import { portfolioData } from "./jsData/portfolio.js";
import { reviews } from "./jsData/reviews.js";

let SLIDES_PER_PAGE_PORTFOLIO = 3;
const screenWidth = window.screen.width;
if (screenWidth <= 1100) {
  SLIDES_PER_PAGE_PORTFOLIO = 2;
}
if (screenWidth <= 600) {
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
    } else if (currentSlideIndexPortfolio === totalSlides - 1) {
      currentSlideIndexPortfolio = 0;
      updateSlides();
    }
  }

  function prevSlide() {
    const filteredProjects = portfolioData.filter((project) => project.title);
    const totalSlides = Math.ceil(
      filteredProjects.length / SLIDES_PER_PAGE_PORTFOLIO
    );
    if (currentSlideIndexPortfolio > 0) {
      currentSlideIndexPortfolio--;
      updateSlides();
    } else if (currentSlideIndexPortfolio === 0) {
      currentSlideIndexPortfolio = totalSlides - 1;
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

// Form

const form = document.getElementById("form");
const TOKEN = "7621135433:AAH_kpzgrLQ8LQsPmyveqENpBnaY3qSwlQQ";
const CHAT_ID = "@abobusslslsl";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const telInput = document.getElementById("tel");
  const reqInput = document.getElementById("req");

  const name = nameInput.value;
  const tel = telInput.value;
  const req = reqInput.value;

  const inputContents = [
    `<b>Запит на консультацію</b>`,
    `<b>Ім'я:</b> ${name}`,
    `<b>Номер телефону:</b> <a href="${tel}">${tel}</a>`,
    `<b>Запит:</b> ${req}`,
  ];
  let message = inputContents.join("\n");

  fetch(URI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      parse_mode: "html",
      text: message,
    }),
  })
    .then((res) => {
      nameInput.value = "";
      telInput.value = "+380";
      reqInput.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
});

let SLIDES_PER_PAGE = 3;
// Ваш код для роботи з відгуками
if (screenWidth < 1100) {
  SLIDES_PER_PAGE = 2;
}
if (screenWidth < 665) {
  SLIDES_PER_PAGE = 1;
}
const MAX_TEXT_LENGTH = 142;
let currentSlide = 0;

function init() {
  const slidesContainer = document.querySelector(".testimonials-slides");
  const prevButton = document.querySelector(".controls-testimonials-prev");
  const nextButton = document.querySelector(".controls-testimonials-next");
  const indicators = document.querySelector(".indicators-testimonials");

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  function updateSlides() {
    const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE);
    const slideContent = document.querySelector(".testimonial-slide");

    // Приховуємо поточний контент
    slideContent.style.opacity = "0";

    setTimeout(() => {
      slideContent.innerHTML = "";

      const startIdx = currentSlide * SLIDES_PER_PAGE;
      const endIdx = Math.min(startIdx + SLIDES_PER_PAGE, reviews.length);

      for (let i = startIdx; i < endIdx; i++) {
        const review = reviews[i];
        const block = document.createElement("div");
        block.className = "testimonial-slide-block";

        const isLongText = review.text.length > MAX_TEXT_LENGTH;
        const truncatedText = truncateText(review.text, MAX_TEXT_LENGTH);

        block.innerHTML = `
          <div class="">
            <div class="slide-block-top">
            <img src="${review.image}" />
            <h2 class="testimonial-slide-title">${review.name}</h2>
            </div>
            <p class="testimonial-slide-text">${truncatedText}</p>
            ${
              isLongText
                ? `<button class="read-more-btn">Читати більше</button>`
                : ""
            }
          </div>
        `;

        if (isLongText) {
          const readMoreBtn = block.querySelector(".read-more-btn");
          const textElement = block.querySelector(".testimonial-slide-text");
          let isExpanded = false;

          readMoreBtn.addEventListener("click", () => {
            isExpanded = !isExpanded;
            textElement.textContent = isExpanded ? review.text : truncatedText;
            readMoreBtn.textContent = isExpanded
              ? "Згорнути"
              : "Читати більше...";
          });
        }

        slideContent.appendChild(block);
      }

      // Показуємо новий контент
      requestAnimationFrame(() => {
        slideContent.style.opacity = "1";
      });

      updatePagination(totalSlides);
    }, 250);
  }

  // Оновлюємо обробники подій для кнопок
  function initButtons(prevButton, nextButton) {
    prevButton.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
      }
    });

    nextButton.addEventListener("click", () => {
      const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE);
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlides();
      }
    });
  }
  function updatePagination(totalSlides) {
    indicators.innerHTML = "";

    // Add page numbers
    if (totalSlides <= 5) {
      for (let i = 0; i < totalSlides; i++) {
        addPageButton(i, totalSlides);
      }
    } else {
      if (currentSlide > 2) {
        addPageButton(0, totalSlides);
        indicators.appendChild(createEllipsis());
      }

      for (
        let i = Math.max(0, currentSlide - 1);
        i <= Math.min(totalSlides - 1, currentSlide + 1);
        i++
      ) {
        addPageButton(i, totalSlides);
      }

      if (currentSlide < totalSlides - 3) {
        indicators.appendChild(createEllipsis());
        addPageButton(totalSlides - 1, totalSlides);
      }
    }
  }

  function addPageButton(pageNum, totalSlides) {
    const button = document.createElement("button");
    button.textContent = pageNum + 1;
    button.className = pageNum === currentSlide ? "active" : "";
    button.addEventListener("click", () => {
      currentSlide = pageNum;
      updateSlides();
    });
    indicators.appendChild(button);
  }

  function createEllipsis() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    return span;
  }

  prevButton.addEventListener("click", () => {
    const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE);
    if (currentSlide > 0) {
      currentSlide--;
      updateSlides();
    } else if (currentSlide === 0) {
      currentSlide = totalSlides - 1;
      updateSlides();
    }
  });

  nextButton.addEventListener("click", () => {
    const totalSlides = Math.ceil(reviews.length / SLIDES_PER_PAGE);
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlides();
    } else if (currentSlide === totalSlides - 1) {
      currentSlide = 0;
      updateSlides();
    }
  });

  updateSlides();
}

document.addEventListener("DOMContentLoaded", init);

const AccordeonTopButton = document.querySelectorAll(
  ".accordeon-item-top-button"
);

AccordeonTopButton.forEach((el) => {
  el.addEventListener("click", () => {
    const content = el.nextElementSibling;
    const img = el.lastElementChild;
    img.classList.toggle("active");

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.style.paddingTop = "0px";
    } else {
      content.style.paddingTop = "10px";
      content.style.maxHeight = content.scrollHeight + 10 + "px";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".custom-burger");
  const menu = document.querySelector(".sliding-menu");
  const links = document.querySelectorAll(".sliding-menu-link");

  links.forEach((el) => {
    el.addEventListener("click", () => {
      burger.classList.toggle("active");
      menu.classList.toggle("active");

      document.body.style.overflow = menu.classList.contains("active")
        ? "hidden"
        : "";
    });
  });

  burger.addEventListener("click", function () {
    burger.classList.toggle("active");
    menu.classList.toggle("active");

    document.body.style.overflow = menu.classList.contains("active")
      ? "hidden"
      : "";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".animate");
  elements.forEach((el) => {
    setTimeout(() => el.classList.add("active"), 200);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const blocksContainer = document.querySelector(".advantages-blocks");
  const blocks = document.querySelectorAll(".advantages-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          blocks.forEach((block, index) => {
            setTimeout(() => {
              block.classList.add("show");
            }, index * 300); // затримка 200 мс між блоками
          });
          observer.unobserve(blocksContainer); // після першого появи блоку вимкнути спостереження
        }
      });
    },
    { threshold: 0.2 } // Відсоток появи блоку для спрацювання
  );

  observer.observe(blocksContainer);
});

document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".statistics-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const block = entry.target;
          const delayClass = [...block.classList].find((cls) =>
            cls.startsWith("delay-")
          );

          // Витягуємо номер затримки з класу (наприклад, delay-1s -> 1)
          const delay = delayClass ? parseInt(delayClass.split("-")[1]) : 0;

          // Додаємо затримку перед додаванням класу `show`
          setTimeout(() => {
            block.classList.add("show");
          }, delay * 10);

          observer.unobserve(block); // Зупиняємо спостереження за цим блоком
        }
      });
    },
    { threshold: 0.2 } // Блок повинен бути на 20% в полі зору
  );

  // Додаємо всі блоки до спостереження
  blocks.forEach((block) => observer.observe(block));
});
