
document.addEventListener("DOMContentLoaded", function () {
  const carouselContainer = document.querySelector(
    ".projects-carousel-container"
  );
  const prevArrow = document.querySelector(".carousel-arrow-prev");
  const nextArrow = document.querySelector(".carousel-arrow-next");
  const counterCurrent = document.querySelector(".counter-current");
  const counterTotal = document.querySelector(".counter-total");

  if (!carouselContainer) return;

  const projectCards = Array.from(
    document.querySelectorAll(".project-container")
  );
  let currentIndex = 0;

  
  if (counterTotal) {
    counterTotal.textContent = projectCards.length;
  }

  
  function updateActiveCard() {
    const containerRect = carouselContainer.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    projectCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(centerX - cardCenterX);

      card.classList.remove("active-card");

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
        currentIndex = index;
      }
    });

    if (closestCard) {
      closestCard.classList.add("active-card");
    }

    
    updateArrowStates();
    updateCounter();
  }

  
  function updateArrowStates() {
    if (prevArrow && nextArrow) {
      prevArrow.disabled = currentIndex === 0;
      nextArrow.disabled = currentIndex === projectCards.length - 1;
    }
  }

  
  function updateCounter() {
    if (counterCurrent) {
      counterCurrent.textContent = currentIndex + 1;
    }
  }

  
  function scrollToCard(index) {
    if (index < 0 || index >= projectCards.length) return;

    const card = projectCards[index];
    const containerRect = carouselContainer.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollLeft =
      carouselContainer.scrollLeft +
      cardRect.left -
      containerRect.left -
      (containerRect.width - cardRect.width) / 2;

    carouselContainer.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }

  
  if (prevArrow) {
    prevArrow.addEventListener("click", function () {
      if (currentIndex > 0) {
        scrollToCard(currentIndex - 1);
      }
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", function () {
      if (currentIndex < projectCards.length - 1) {
        scrollToCard(currentIndex + 1);
      }
    });
  }

  
  carouselContainer.addEventListener("scroll", updateActiveCard);

  
  updateActiveCard();

  
  carouselContainer.addEventListener(
    "wheel",
    function (e) {
      
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();

        if (prefersReducedMotion) {
          carouselContainer.scrollLeft += e.deltaY;
        } else {
          carouselContainer.scrollBy({
            left: e.deltaY,
            behavior: "smooth",
          });
        }
      }
    },
    { passive: false }
  );

  
  carouselContainer.setAttribute("tabindex", "0");

  carouselContainer.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          scrollToCard(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < projectCards.length - 1) {
          scrollToCard(currentIndex + 1);
        }
        break;
      case "Home":
        e.preventDefault();
        scrollToCard(0);
        break;
      case "End":
        e.preventDefault();
        scrollToCard(projectCards.length - 1);
        break;
    }
  });

  
  let isScrolling = false;
  let startX;
  let scrollLeft;

  carouselContainer.addEventListener("mousedown", function (e) {
    isScrolling = true;
    startX = e.pageX - carouselContainer.offsetLeft;
    scrollLeft = carouselContainer.scrollLeft;
    carouselContainer.style.cursor = "grabbing";
  });

  carouselContainer.addEventListener("mouseleave", function () {
    isScrolling = false;
    carouselContainer.style.cursor = "grab";
  });

  carouselContainer.addEventListener("mouseup", function () {
    isScrolling = false;
    carouselContainer.style.cursor = "grab";
  });

  carouselContainer.addEventListener("mousemove", function (e) {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - carouselContainer.offsetLeft;
    const walk = (x - startX) * 2;
    carouselContainer.scrollLeft = scrollLeft - walk;
  });

  
  carouselContainer.style.cursor = "grab";
});
