const letterEl = document.getElementById("letter");
const momentsEl = document.getElementById("moments");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const noteTextEl = document.getElementById("noteText");

let visibleCount = 0;
const noteMessages = [
  "I love you so so much, you mean the world to me.",
  "I love you so so much, you are my safest place.",
  "I love you so so much, you are my favorite person.",
  "I love you so so much, you are my home."
];

function render(paragraphs, moments) {
  paragraphs.forEach((section, index) => {
    const p = document.createElement("p");
    p.textContent = section.text;
    p.dataset.key = section.key;
    p.dataset.index = index.toString();
    p.classList.add("hidden");
    letterEl.appendChild(p);
  });

  moments.forEach((moment) => {
    const card = document.createElement("div");
    card.className = "card hidden";
    card.dataset.key = moment.key;

    const title = document.createElement("h3");
    title.textContent = moment.title;

    const detail = document.createElement("p");
    detail.textContent = moment.detail;

    const media = document.createElement("div");
    media.className = "media-slot";
    const image = document.createElement("img");
    image.src = moment.media;
    image.alt = `${moment.title} photo`;
    image.loading = "lazy";
    media.appendChild(image);

    card.appendChild(title);
    card.appendChild(detail);
    card.appendChild(media);
    momentsEl.appendChild(card);
  });
}

function setActive(key) {
  document.querySelectorAll(".letter p").forEach((p) => {
    p.classList.toggle("active", p.dataset.key === key);
  });

  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("active", card.dataset.key === key);
  });
}

function revealNext() {
  const paragraphs = Array.from(document.querySelectorAll(".letter p"));

  if (nextBtn.dataset.mode === "collapse") {
    paragraphs.forEach((p, index) => {
      if (index === 0) {
        p.classList.remove("hidden");
        p.classList.add("visible");
      } else {
        p.classList.remove("visible");
        p.classList.add("hidden");
      }
    });

    document.querySelectorAll(".card").forEach((card, index) => {
      if (index === 0) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    visibleCount = 1;
    progressEl.textContent = `${visibleCount} / ${paragraphs.length}`;
    nextBtn.textContent = "Continue";
    nextBtn.disabled = false;
    nextBtn.dataset.mode = "continue";
    setActive(paragraphs[0].dataset.key);

    if (noteTextEl) {
      noteTextEl.textContent = noteMessages[0];
    }

    paragraphs[0].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (visibleCount >= paragraphs.length) {
    return;
  }

  const current = paragraphs[visibleCount];
  current.classList.remove("hidden");
  current.classList.add("visible");

  visibleCount += 1;
  progressEl.textContent = `${visibleCount} / ${paragraphs.length}`;

  if (visibleCount >= paragraphs.length) {
    nextBtn.textContent = "Collapse";
    nextBtn.disabled = false;
    nextBtn.dataset.mode = "collapse";
  }

  if (noteTextEl) {
    noteTextEl.textContent = noteMessages[Math.min(visibleCount - 1, noteMessages.length - 1)];
  }

  current.scrollIntoView({ behavior: "smooth", block: "center" });
  setActive(current.dataset.key);

  const matchingCard = document.querySelector(`.card[data-key="${current.dataset.key}"]`);
  if (matchingCard) {
    matchingCard.classList.remove("hidden");
  }
}

function attachEvents() {
  nextBtn.addEventListener("click", revealNext);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const key = entry.target.dataset.key;
          setActive(key);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll(".letter p").forEach((p) => {
    observer.observe(p);
  });

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", () => setActive(card.dataset.key));
    card.addEventListener("click", () => setActive(card.dataset.key));
  });
}

Promise.all([fetch("paragraphs.json"), fetch("why.json")])
  .then((responses) => {
    responses.forEach((response, index) => {
      if (!response.ok) {
        const name = index === 0 ? "paragraphs.json" : "why.json";
        throw new Error(`Failed to load ${name}`);
      }
    });
    return Promise.all(responses.map((response) => response.json()));
  })
  .then(([paragraphs, moments]) => {
    render(paragraphs, moments);
    attachEvents();
    nextBtn.dataset.mode = "continue";
    revealNext();
  })
  .catch((error) => {
    console.error(error);
  });
