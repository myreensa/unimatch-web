/*
  UniMatch prototype
  ------------------
  This version uses localStorage, so it works without a backend.

  IMPORTANT:
  This is a prototype. Data is stored only in this browser.
  Later we will replace the localStorage logic with Firebase so
  real users can sign up, match and chat with each other.
*/

const profiles = [
  {
    id: 1,
    name: "Alex",
    age: 21,
    university: "University of Helsinki",
    field: "Computer Science",
    bio: "Coffee, climbing, and building little projects. Looking for someone who enjoys good conversations.",
    initials: "A"
  },
  {
    id: 2,
    name: "Maya",
    age: 22,
    university: "Aalto University",
    field: "Business",
    bio: "I love live music, travelling and finding new places to eat. Always up for a thoughtful conversation.",
    initials: "M"
  },
  {
    id: 3,
    name: "Leo",
    age: 23,
    university: "University of Helsinki",
    field: "Engineering",
    bio: "Gym, gaming and photography. I'd rather have one great conversation than twenty random matches.",
    initials: "L"
  }
];

const state = {
  user: JSON.parse(localStorage.getItem("unimatch_user") || "null"),
  activeMatch: JSON.parse(localStorage.getItem("unimatch_match") || "null"),
  passed: JSON.parse(localStorage.getItem("unimatch_passed") || "[]"),
  messages: JSON.parse(localStorage.getItem("unimatch_messages") || "[]"),
  currentProfileIndex: 0,
  screen: "welcome"
};

const app = document.getElementById("app");

function saveState() {
  localStorage.setItem("unimatch_user", JSON.stringify(state.user));
  localStorage.setItem("unimatch_match", JSON.stringify(state.activeMatch));
  localStorage.setItem("unimatch_passed", JSON.stringify(state.passed));
  localStorage.setItem("unimatch_messages", JSON.stringify(state.messages));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  if (state.screen === "welcome") renderWelcome();
  if (state.screen === "signup") renderSignup();
  if (state.screen === "discover") renderDiscover();
  if (state.screen === "match") renderMatch();
  if (state.screen === "chat") renderChat();
  if (state.screen === "profile") renderProfile();
}

function renderWelcome() {
  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">
        <section class="screen center-screen">
          <div class="logo">Uni<span>Match</span></div>
          <h1 class="tagline">One match at a time.</h1>
          <p class="subtext">
            Focus on one person. Have one meaningful conversation.
            No endless swiping while you're already getting to know someone.
          </p>

          <button class="btn btn-primary" onclick="go('signup')">Get Started</button>
          <button class="btn btn-secondary" onclick="go('signup')">Create a profile</button>

          <div class="notice">
            <strong>Prototype:</strong> your data is currently saved only in this browser.
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderSignup() {
  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">
        <section class="screen">

          <div class="topbar">
            <button class="icon-btn" onclick="go('welcome')">←</button>

            <div class="logo">
              Uni<span>Match</span>
            </div>

            <div></div>
          </div>

          <h1>Create your profile</h1>

          <p class="subtext">
            Tell people a little about yourself.
            Your profile is your first impression.
          </p>

          <form class="form" onsubmit="createProfile(event)">

            <div class="field">
              <label for="name">First name</label>

              <input
                id="name"
                type="text"
                placeholder="Alex"
                required
                maxlength="30"
              >
            </div>


            <div class="field">
              <label for="age">Age</label>

              <input
                id="age"
                type="number"
                placeholder="21"
                min="18"
                max="99"
                required
              >
            </div>


            <div class="field">
              <label for="university">University</label>

              <input
                id="university"
                type="text"
                placeholder="University of Helsinki"
                required
              >
            </div>


            <div class="field">
              <label for="field">What do you study?</label>

              <input
                id="field"
                type="text"
                placeholder="Computer Science"
                required
              >
            </div>


            <div class="field">
              <label for="bio">About you</label>

              <textarea
                id="bio"
                placeholder="Tell people something interesting about yourself..."
                maxlength="300"
                required
              ></textarea>
            </div>

            <div class="field">
  <label for="interests">Interests</label>

  <input
    id="interests"
    type="text"
    placeholder="Music, travel, gym, gaming"
    maxlength="100"
  >
</div>


            <button
              class="btn btn-primary"re
              type="submit"
            >
              Continue
            </button>

          </form>

        </section>
      </main>
    </div>
  `;
}

function createProfile(event) {
  event.preventDefault();

    state.user = {
  id: "me",
  name: document.getElementById("name").value.trim(),
  age: Number(document.getElementById("age").value),
  university: document.getElementById("university").value.trim(),
  field: document.getElementById("field").value.trim(),
  bio: document.getElementById("bio").value.trim(),
  interests: document.getElementById("interests").value
    .split(",")
    .map(interest => interest.trim())
    .filter(interest => interest.length > 0)
};

  saveState();
  state.screen = "discover";
  render();
};

function renderDiscover() {
  if (state.activeMatch) {
    renderMatch();
    return;
  }

  const available = profiles.filter(
    profile => !state.passed.includes(profile.id)
  );

  const profile = available[0];

  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">

        <section class="screen">

          <div class="topbar">
            <div>
              <div class="logo">
                Uni<span>Match</span>
              </div>
              <div class="profile-meta">
                One match at a time.
              </div>
            </div>

            <button
              class="icon-btn"
              onclick="go('profile')"
            >
              Profile
            </button>
          </div>

          ${
            profile
              ? `
                <div class="discover-header">
                  <h1>Someone new</h1>

                  <p class="subtext">
                    Take your time. You only need one person.
                  </p>
                </div>

                <article class="profile-card">

                  <div class="profile-photo">
                    <div class="initials">
                      ${escapeHtml(profile.initials)}
                    </div>
                  </div>

                  <div class="profile-info">

                    <div class="profile-name">
                      ${escapeHtml(profile.name)}, ${profile.age}
                    </div>

                    <div class="profile-meta">
                      ${escapeHtml(profile.university)}
                    </div>

                    <div class="badge">
                      ${escapeHtml(profile.field)}
                    </div>

                    <p class="bio">
                      ${escapeHtml(profile.bio)}
                    </p>

                  </div>

                </article>

                <div class="actions">

                  <button
                    class="action-btn pass"
                    onclick="passProfile(${profile.id})"
                  >
                    ✕
                    <span>Pass</span>
                  </button>

                  <button
                    class="action-btn like"
                    onclick="likeProfile(${profile.id})"
                  >
                    ♥
                    <span>Like</span>
                  </button>

                </div>

                <div class="notice">
                  <strong>Remember:</strong>
                  once you match, you'll focus on that person
                  instead of continuing to swipe.
                </div>
              `
              : `
                <div class="match-card">

                  <h2>No more profiles</h2>

                  <p class="subtext">
                    You've reached the end of the demo.
                  </p>

                  <button
                    class="btn btn-secondary"
                    onclick="resetPrototype()"
                  >
                    Reset demo
                  </button>

                </div>
              `
          }

        </section>

        ${nav("discover")}

      </main>
    </div>
  `;
}

function passProfile(id) {
  if (!state.passed.includes(id)) state.passed.push(id);
  saveState();
  render();
}

function likeProfile(id) {
  // Prototype behavior: the first like creates the one active match.
  // Later, this will be replaced by server-side mutual matching.
  const profile = profiles.find(p => p.id === id);

  if (!profile) return;

  if (state.activeMatch) {
    alert("You already have an active match. Get to know them first.");
    return;
  }

  state.activeMatch = profile;
  state.messages = [
    {
      sender: "them",
      text: `Hey ${state.user.name}! Nice to match with you.`
    }
  ];

  saveState();
  state.screen = "match";
  render();
}

function renderMatch() {
  const match = state.activeMatch;

  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">
        <section class="screen center-screen">
          <div class="logo">Uni<span>Match</span></div>

          <div class="match-card">
            <div class="match-avatar">${escapeHtml(match.initials)}</div>
            <h1>It's a match!</h1>
            <p>
              You matched with <strong>${escapeHtml(match.name)}</strong>.
            </p>
            <p class="subtext">
              This is your one active match. There is no new swiping
              until you decide what happens with this connection.
            </p>

            <button class="btn btn-primary" onclick="go('chat')">Start chatting</button>
            <button class="btn btn-secondary" onclick="endMatch()">End match</button>
          </div>
        </section>

        ${nav("match")}
      </main>
    </div>
  `;
}

function renderChat() {
  const match = state.activeMatch;

  if (!match) {
    state.screen = "discover";
    render();
    return;
  }

  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">
        <section class="screen chat">
          <div class="topbar">
            <button class="icon-btn" onclick="go('match')">←</button>
            <div>
              <strong>${escapeHtml(match.name)}</strong>
              <div class="profile-meta">Your active match</div>
            </div>
            <button class="icon-btn" onclick="endMatch()">End</button>
          </div>

          <div class="messages">
            ${state.messages.map(message => `
              <div class="message ${message.sender === "me" ? "me" : "them"}">
                ${escapeHtml(message.text)}
              </div>
            `).join("")}
          </div>

          <form class="chat-form" onsubmit="sendMessage(event)">
            <input id="messageInput" maxlength="500" required placeholder="Write a message...">
            <button type="submit">Send</button>
          </form>
        </section>

        ${nav("chat")}
      </main>
    </div>
  `;
}

function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (!text) return;

  state.messages.push({
    sender: "me",
    text
  });

  saveState();
  render();
}

function renderProfile() {
  const user = state.user;

  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">
        <section class="screen">
          <div class="topbar">
            <div class="logo">Uni<span>Match</span></div>
          </div>

          <div class="match-card">
            <div class="match-avatar">
              ${escapeHtml(user.name.charAt(0).toUpperCase())}
            </div>

            <h1>${escapeHtml(user.name)}, ${user.age}</h1>
            <p class="profile-meta">${escapeHtml(user.university)}</p>
            <div class="badge">${escapeHtml(user.field)}</div>
            <p class="bio">${escapeHtml(user.bio)}</p>
          </div>
          <div class="badge">
  ${user.interests.map(interest => escapeHtml(interest)).join(" · ")}
</div>

          <button class="btn btn-secondary" onclick="resetPrototype()">
            Reset prototype
          </button>
        </section>

        ${nav("profile")}
      </main>
    </div>
  `;
}

function nav(active) {
  return `
    <nav class="nav">
      <button class="${active === "discover" ? "active" : ""}" onclick="go('discover')">Discover</button>
      <button class="${active === "match" || active === "chat" ? "active" : ""}" onclick="go(state.activeMatch ? 'chat' : 'discover')">
        ${state.activeMatch ? "My match" : "Match"}
      </button>
      <button class="${active === "profile" ? "active" : ""}" onclick="go('profile')">Profile</button>
    </nav>
  `;
}

function go(screen) {
  if (!state.user && ["discover", "match", "chat", "profile"].includes(screen)) {
    screen = "signup";
  }

  state.screen = screen;
  render();
}

function endMatch() {
  if (!state.activeMatch) return;

  const confirmed = confirm(
    "End this match? You will be able to discover people again."
  );

  if (!confirmed) return;

  state.activeMatch = null;
  state.messages = [];
  saveState();

  state.screen = "discover";
  render();
}

function resetPrototype() {
  localStorage.removeItem("unimatch_user");
  localStorage.removeItem("unimatch_match");
  localStorage.removeItem("unimatch_passed");
  localStorage.removeItem("unimatch_messages");

  state.user = null;
  state.activeMatch = null;
  state.passed = [];
  state.messages = [];
  state.screen = "welcome";

  render();
}

render();
