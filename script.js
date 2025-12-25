const letterSections = [
  {
    key: "notice",
    text:
      "One thing I have come to notice about you is how much you value consistency and effort in the small daily moments, not just the big gestures. You hold on to what matters and you ask for clarity instead of letting things drift. Even when you are tired or stressed, you do not fake it; you want it real, repaired, and steady. You also notice people who are quiet in a room and bring them in. That is a pattern of care I see in you, and it is not loud, but it is constant."
  },
  {
    key: "moment",
    text:
      "There was a night we were fighting and you still said the gratitude line. At the time it felt small, but it stayed with me. It told me you were protecting something about us even when it was hard, and that you were not using the moment to punish me. I did not show up well in that moment, but I remember that you did. It changed how I see the seriousness and the depth of how you commit."
  },
  {
    key: "impact",
    text:
      "Being with you has changed how I carry myself in a relationship. I no longer assume love is understood; I try to show it. I pay more attention to repair and to the ways my silence or logic can land as distance. I hold myself to a higher standard around presence and follow-through, and I can trace that directly to you. You have made me take consistency seriously, not as a rule but as a form of respect."
  },
  {
    key: "commitment",
    text:
      "Looking ahead, one thing I am committed to doing is a daily, specific act of connection that is actually within my control: a 20-second touch and one concrete appreciation before we separate or when we reconnect. This matters to me because I want you to feel seen in the way you have asked for, and I want my actions to match what I say I want. I am not promising a different personality, but I am committing to a steady practice I can keep."
  }
];

const moments = [
  {
    key: "notice",
    title: "What I Notice",
    detail:
      "Your standard is consistency in small moments, not big declarations. You keep track of what is repeated, not what is dramatic, and you call out drift before it becomes distance. You notice who gets overlooked in a room and bring them in quietly, which shows how much you value steadiness, attention, and care.",
    media: "media/One.png"
  },
  {
    key: "moment",
    title: "The Moment",
    detail:
      "The night you still said the gratitude line while we were fighting. It stuck because you chose the ritual even when you were hurt, and you did not use the moment to punish me. That choice showed you were protecting the relationship under stress, and it made me see how serious and loyal your commitment really is.",
    media: "media/Two.png"
  },
  {
    key: "impact",
    title: "Your Impact",
    detail:
      "I now value repair and follow-through more than I used to, and I feel the difference in how I show up. I pay more attention to how my silence or logic can land as distance, and I try to come back sooner instead of letting time erase it. You raised my standard around presence, and that shift is directly tied to being with you.",
    media: "media/Three.png"
  },
  {
    key: "commitment",
    title: "My Commitment",
    detail:
      "A daily 20-second touch and one specific appreciation before we separate or reconnect, even on hard days. It is small enough to be consistent and specific enough to feel real, not generic. It is within my control, and it matches the kind of steady care you have asked for, not a promise I cannot keep.",
    media: "media/Four.png"
  }
];

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

function render() {
  letterSections.forEach((section, index) => {
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

render();
attachEvents();
nextBtn.dataset.mode = "continue";
revealNext();
