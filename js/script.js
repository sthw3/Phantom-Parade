document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hauntForm");
  const resultBox = document.getElementById("result");

  const PACKAGES = {
    basic: {
      name: "Bisik-Bisik Basic",
      price: 199,
      desc: "Gentle removal for mild hauntings, strange noises, or a single affected room."
    },

    standard: {
      name: "Seram Standard",
      price: 499,
      desc: "Thorough cleansing for moderate hauntings, frequent sightings, or several affected rooms."
    },

    promax: {
      name: "Bomoh ProMax",
      price: 999,
      desc: "Full-scale exorcism for severe hauntings, aggressive ghosts, or extensive affected areas."
    }
  };

  /* Input labels */

  const LABELS = {
    level: {
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe"
    },

    activity: {
      noises: "Strange noises",
      sightings: "Frequent sightings",
      aggressive: "Aggressive behaviour"
    }
  };

  function escapeHTML(text) {
    return text.replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function clearResult() {
    if (!resultBox) return;
    resultBox.hidden = true;
    resultBox.classList.remove("reveal")
    resultBox.innerHTML = "";
  }

  function fail(message) {
    clearResult();
    alert(message);
    return false;
  }

  function validate(data) {
    if (
      !data.name ||
      !data.email ||
      !data.level ||
      data.roomsRaw === "" ||
      !data.activity
    ) {
      return fail(
        "Please complete every field before continuing."
      );
    }

    if (
      data.name.length < 2 ||
      data.name.length > 50
    ) {
      return fail(
        "Your name must be between 2 and 50 characters."
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(data.email)) {
      return fail(
        "Please enter a valid email address, such as you@example.com."
      );
    }

    const rooms = Number(data.roomsRaw);
    if (
      !Number.isInteger(rooms) ||
      rooms < 1 ||
      rooms > 20
    ) {
      return fail(
        "Affected rooms must be a whole number from 1 to 20."
      );
    }

    if (
      !LABELS.level[data.level] ||
      !LABELS.activity[data.activity]
    ) {
      return fail(
        "Please choose a valid level and activity from the lists."
      );
    }
    return true;
  }

  function choosePackage(level, activity, rooms) {
    if (
      level === "severe" ||
      activity === "aggressive" ||
      rooms >= 10
    ) {
      return {
        pkg: PACKAGES.promax,
        reason: "Your haunting is severe, aggressive, or affects 10 or more rooms."
      };
    }
    else if (
      level === "moderate" ||
      activity === "sightings" ||
      rooms >= 2
    ) {
      return {
        pkg: PACKAGES.standard,
        reason: "Your haunting is moderate, involves frequent sightings, or affects 2 to 9 rooms."
      };
    }
    else {
      return {
        pkg: PACKAGES.basic,
        reason: "Your haunting is mild, with strange noises in a single room."
      };
    }
  }

  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      if (!resultBox) {
        alert("Recommendation result section is missing.");
        return;
      }

      const data = {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        level: document.getElementById("level").value,
        roomsRaw: document.getElementById("rooms").value.trim(),
        activity: document.getElementById("activity").value
      };

      if (!validate(data)) return;
      const rooms = Number(data.roomsRaw);
      const result = choosePackage(
        data.level,
        data.activity,
        rooms
      );

      const pkg = result.pkg;

      resultBox.innerHTML =
        "<h2>We recommend " +
        escapeHTML(pkg.name) +
        "</h2>" +
        '<p class="price">RM' +
        pkg.price.toFixed(2) +
        "</p>" +
        "<p>" +
        escapeHTML(pkg.desc) +
        "</p>" +
        "<p><strong>Why:</strong> " +
        escapeHTML(result.reason) +
        "</p>" +
        "<h3>Your Details</h3>" +
        "<ul>" +
        "<li>Name: " +
        escapeHTML(data.name) +
        "</li>" +
        "<li>Email: " +
        escapeHTML(data.email) +
        "</li>" +
        "<li>Level: " +
        LABELS.level[data.level] +
        "</li>" +
        "<li>Affected rooms: " +
        rooms +
        "</li>" +
        "<li>Activity: " +
        LABELS.activity[data.activity] +
        "</li>" +
        "</ul>";

            alert("Your paranormal assessment is complete!");

      runJumpscare(() => {
        resultBox.hidden = false;
        resultBox.classList.remove("reveal");
        void resultBox.offsetWidth;
        resultBox.classList.add("reveal");
        resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    form.addEventListener("reset", clearResult);
  }

 // HERO IMAGE SLIDER
const slides = document.querySelectorAll(".hero .slide");
const prevBtn = document.querySelector(".hero .arrow.prev");
const nextBtn = document.querySelector(".hero .arrow.next");
const dotsContainer = document.querySelector(".hero .dots");

let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });

    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll("button");

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    currentSlide = index;
}

// Create navigation dots
if (slides.length > 0 && dotsContainer) {
    slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.classList.add("dot");
        dot.setAttribute("aria-label", `Go to banner ${index + 1}`);

        dot.addEventListener("click", () => {
            showSlide(index);
            restartSlider();
        });

        dotsContainer.appendChild(dot);
    });

    showSlide(0);
}

// Next button
if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        showSlide((currentSlide + 1) % slides.length);
        restartSlider();
    });
}

// Previous button
if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
        restartSlider();
    });
}

// Automatic slideshow
function startSlider() {
    slideInterval = setInterval(() => {
        showSlide((currentSlide + 1) % slides.length);
    }, 4000);
}

function restartSlider() {
    clearInterval(slideInterval);
    startSlider();
}

if (slides.length > 1) {
    startSlider();
}
});

  const scare = document.getElementById("jumpscare");
  const scareSound = document.getElementById("scareSound");

  function runJumpscare(done) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!scare || reduceMotion) { done(); return; }   // skip untuk user yang set motion dikurangkan

    scare.hidden = false;
    if (scareSound) {
      scareSound.currentTime = 0;
      scareSound.play().catch(() => {});             // abaikan kalau browser block
    }

    setTimeout(() => {
      scare.hidden = true;
      done();
    }, 1800);
  }
