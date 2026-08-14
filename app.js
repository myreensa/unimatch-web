/*
  UniMatch prototype
  ------------------
  LocalStorage prototype.

  Features:
  - Profile creation
  - Up to 3 profile photos
  - Photo preview
  - Interests
  - Profile prompts
  - Discover profiles
  - Multiple profile photos
  - Like / Pass
  - Mutual matching
  - One active match
  - Chat
  - Edit Profile
  - LocalStorage persistence
*/


/* =========================
   DEMO PROFILES
========================= */

const profiles = [

  {
    id: 1,
    name: "Alex",
    age: 21,
    university: "University of Helsinki",
    field: "Computer Science",

    bio:
      "Coffee, climbing, and building little projects. Looking for someone who enjoys good conversations.",

    initials: "A",

    photos: [
      "images/alex.jpg",
      "images/alex2.jpg",
      "images/alex3.jpg"
    ],

    interests: [
      "Coffee",
      "Climbing",
      "Programming"
    ],

    prompts: [
      {
        question: "My ideal Sunday...",
        answer:
          "Coffee, climbing and a movie in the evening."
      },

      {
        question: "Something I'm passionate about...",
        answer:
          "Building things and learning how they work."
      }
    ]
  },


  {
    id: 2,
    name: "Maya",
    age: 22,
    university: "Aalto University",
    field: "Business",

    bio:
      "I love live music, travelling and finding new places to eat.",

    initials: "M",

    photos: [
      "images/maya.jpg",
      "images/maya2.jpg",
      "images/maya3.jpg"
    ],

    interests: [
      "Music",
      "Travel",
      "Food"
    ],

    prompts: [
      {
        question: "My ideal weekend...",
        answer:
          "Exploring a new city with good food and good company."
      },

      {
        question: "A random fact about me...",
        answer:
          "I've visited more coffee shops than I can count."
      }
    ]
  },


  {
    id: 3,
    name: "Leo",
    age: 23,
    university: "University of Helsinki",
    field: "Engineering",

    bio:
      "Gym, gaming and photography. I'd rather have one great conversation than twenty random matches.",

    initials: "L",

    photos: [
      "images/leo.jpg",
      "images/leo2.jpg",
      "images/leo3.jpg"
    ],

    interests: [
      "Gym",
      "Gaming",
      "Photography"
    ],

    prompts: [
      {
        question: "My ideal Sunday...",
        answer:
          "Gym in the morning, gaming in the afternoon and good food later."
      },

      {
        question: "Something I could talk about for hours...",
        answer:
          "Technology, games and photography."
      }
    ]
  }

];


/* =========================
   DEMO INCOMING LIKES
========================= */

const incomingLikes = [1];


/* =========================
   APP STATE
========================= */

const state = {

  user:
    JSON.parse(
      localStorage.getItem("unimatch_user") ||
      "null"
    ),

  activeMatch:
    JSON.parse(
      localStorage.getItem("unimatch_match") ||
      "null"
    ),

  passed:
    JSON.parse(
      localStorage.getItem("unimatch_passed") ||
      "[]"
    ),

  likes:
    JSON.parse(
      localStorage.getItem("unimatch_likes") ||
      "[]"
    ),

  messages:
    JSON.parse(
      localStorage.getItem("unimatch_messages") ||
      "[]"
    ),

  screen: "welcome"

};


const app =
  document.getElementById("app");


let newProfilePhotos = [];

let currentPhotoIndex = 0;


/* =========================
   SAVE STATE
========================= */

function saveState() {

  localStorage.setItem(
    "unimatch_user",
    JSON.stringify(state.user)
  );

  localStorage.setItem(
    "unimatch_match",
    JSON.stringify(state.activeMatch)
  );

  localStorage.setItem(
    "unimatch_passed",
    JSON.stringify(state.passed)
  );

  localStorage.setItem(
    "unimatch_likes",
    JSON.stringify(state.likes)
  );

  localStorage.setItem(
    "unimatch_messages",
    JSON.stringify(state.messages)
  );

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* =========================
   RENDER
========================= */

function render() {

  if (state.screen === "welcome") {
    renderWelcome();
  }

  if (state.screen === "signup") {
    renderSignup();
  }

  if (state.screen === "discover") {
    renderDiscover();
  }

  if (state.screen === "match") {
    renderMatch();
  }

  if (state.screen === "chat") {
    renderChat();
  }

  if (state.screen === "profile") {
    renderProfile();
  }

  if (state.screen === "editProfile") {
    renderEditProfile();
  }

}


/* =========================
   WELCOME
========================= */

function renderWelcome() {

  app.innerHTML = `

    <div class="app-shell">

      <main class="phone">

        <section class="screen center-screen">

          <div class="logo">
            Uni<span>Match</span>
          </div>

          <h1 class="tagline">
            One match at a time.
          </h1>

          <p class="subtext">
            Focus on one person.
            Have one meaningful conversation.
            No endless swiping while you're already
            getting to know someone.
          </p>

          <button
            class="btn btn-primary"
            onclick="go('signup')"
          >
            Get Started
          </button>

          <button
            class="btn btn-secondary"
            onclick="go('signup')"
          >
            Create a profile
          </button>

          <div class="notice">
            <strong>Prototype:</strong>
            your data is currently saved only in this browser.
          </div>

        </section>

      </main>

    </div>

  `;

}


/* =========================
   SIGN UP
========================= */

function renderSignup() {

  app.innerHTML = `

    <div class="app-shell">

      <main class="phone">

        <section class="screen">

          <div class="topbar">

            <button
              class="icon-btn"
              onclick="go('welcome')"
            >
              ←
            </button>

            <div class="logo">
              Uni<span>Match</span>
            </div>

            <div></div>

          </div>


          <h1>
            Create your profile
          </h1>


          <p class="subtext">
            Tell people a little about yourself.
            Your profile is your first impression.
          </p>


          <form
            class="form"
            onsubmit="createProfile(event)"
          >


            <!-- PHOTOS -->

            <div class="field">

              <label for="profilePhotos">
                Profile photos
              </label>

              <input
                id="profilePhotos"
                type="file"
                accept="image/*"
                multiple
                onchange="handleProfilePhotos(event)"
              >

              <small class="profile-meta">
                Add up to 3 photos.
                The first photo will be your main photo.
              </small>

              <div
                id="profilePhotoPreview"
                class="profile-photo-preview"
              ></div>

            </div>


            <!-- NAME -->

            <div class="field">

              <label for="name">
                First name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Alex"
                maxlength="30"
                required
              >

            </div>


            <!-- AGE -->

            <div class="field">

              <label for="age">
                Age
              </label>

              <input
                id="age"
                type="number"
                placeholder="21"
                min="18"
                max="99"
                required
              >

            </div>


            <!-- UNIVERSITY -->

            <div class="field">

              <label for="university">
                University
              </label>

              <input
                id="university"
                type="text"
                placeholder="University of Helsinki"
                required
              >

            </div>


            <!-- FIELD -->

            <div class="field">

              <label for="field">
                What do you study?
              </label>

              <input
                id="field"
                type="text"
                placeholder="Computer Science"
                required
              >

            </div>


            <!-- BIO -->

            <div class="field">

              <label for="bio">
                About you
              </label>

              <textarea
                id="bio"
                placeholder="Tell people something interesting about yourself..."
                maxlength="300"
                required
              ></textarea>

            </div>


            <!-- INTERESTS -->

            <div class="field">

              <label for="interests">
                Interests
              </label>

              <input
                id="interests"
                type="text"
                placeholder="Music, travel, gym, gaming"
                maxlength="100"
              >

            </div>


            <!-- PROMPT 1 -->

            <div class="field">

              <label for="prompt1">
                My ideal Sunday...
              </label>

              <textarea
                id="prompt1"
                placeholder="Coffee, a walk, and a good movie..."
                maxlength="200"
              ></textarea>

            </div>


            <!-- PROMPT 2 -->

            <div class="field">

              <label for="prompt2">
                Something I'm passionate about...
              </label>

              <textarea
                id="prompt2"
                placeholder="Something I could talk about for hours..."
                maxlength="200"
              ></textarea>

            </div>


            <button
              class="btn btn-primary"
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


/* =========================
   PROFILE PHOTO UPLOAD
========================= */

function handleProfilePhotos(event) {

  const files =
    Array.from(
      event.target.files || []
    );


  if (files.length > 3) {

    alert(
      "You can add up to 3 photos."
    );

    event.target.value = "";

    newProfilePhotos = [];

    renderProfilePhotoPreview();

    return;
  }


  newProfilePhotos = [];


  let loaded = 0;


  if (files.length === 0) {

    renderProfilePhotoPreview();

    return;
  }


  files.forEach(file => {

    if (!file.type.startsWith("image/")) {

      return;
    }


    const reader =
      new FileReader();


    reader.onload = () => {

      newProfilePhotos.push(
        reader.result
      );

      loaded++;


      if (loaded === files.length) {

        renderProfilePhotoPreview();

      }

    };


    reader.readAsDataURL(file);

  });

}


/* =========================
   PHOTO PREVIEW
========================= */

function renderProfilePhotoPreview() {

  const preview =
    document.getElementById(
      "profilePhotoPreview"
    );


  if (!preview) {
    return;
  }


  preview.innerHTML =
    newProfilePhotos
      .map(
        (photo, index) => `

          <div
            class="profile-photo-preview-item"
          >

            <img
              src="${escapeHtml(photo)}"
              alt="Profile photo ${index + 1}"
            >

            <span>
              ${
                index === 0
                  ? "Main photo"
                  : `Photo ${index + 1}`
              }
            </span>

          </div>

        `
      )
      .join("");

}


/* =========================
   CREATE PROFILE
========================= */

function createProfile(event) {

  event.preventDefault();


  const interests =
    document
      .getElementById("interests")
      .value
      .split(",")
      .map(
        interest =>
          interest.trim()
      )
      .filter(
        interest =>
          interest.length > 0
      );


  state.user = {

    id: "me",

    name:
      document
        .getElementById("name")
        .value
        .trim(),

    age:
      Number(
        document
          .getElementById("age")
          .value
      ),

    university:
      document
        .getElementById("university")
        .value
        .trim(),

    field:
      document
        .getElementById("field")
        .value
        .trim(),

    bio:
      document
        .getElementById("bio")
        .value
        .trim(),

    interests:

      interests,

    photos:

      [...newProfilePhotos],

    prompts: [

      {
        question:
          "My ideal Sunday...",

        answer:
          document
            .getElementById("prompt1")
            .value
            .trim()
      },

      {
        question:
          "Something I'm passionate about...",

        answer:
          document
            .getElementById("prompt2")
            .value
            .trim()
      }

    ]

  };


  saveState();


  state.screen =
    "discover";


  render();

}


/* =========================
   DISCOVER
========================= */

function renderDiscover() {

  if (state.activeMatch) {

    renderMatch();

    return;
  }


  const available =
    profiles.filter(

      profile =>

        !state.passed.includes(
          profile.id
        ) &&

        !state.likes.includes(
          profile.id
        )

    );


  const profile =
    available[0];


  currentPhotoIndex = 0;


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

                  <h1>
                    Someone new
                  </h1>

                  <p class="subtext">
                    Take your time.
                    You only need one person.
                  </p>

                </div>


                <article
                  class="profile-card"
                >


                  <div
                    class="profile-photo"
                  >

                    <img
                      id="profileImage"
                      src="${escapeHtml(
                        profile.photos[0]
                      )}"
                      alt="${escapeHtml(
                        profile.name
                      )}"
                    >


                    <button
                      class="photo-arrow photo-prev"
                      onclick="previousPhoto(${profile.id})"
                    >
                      ‹
                    </button>


                    <button
                      class="photo-arrow photo-next"
                      onclick="nextPhoto(${profile.id})"
                    >
                      ›
                    </button>


                    <div
                      class="photo-indicators"
                    >

                      ${profile.photos
                        .map(

                          (_, index) => `

                            <span
                              class="photo-dot ${
                                index === 0
                                  ? "active"
                                  : ""
                              }"
                            ></span>

                          `

                        )
                        .join("")}

                    </div>

                  </div>


                  <div
                    class="profile-info"
                  >

                    <div
                      class="profile-name"
                    >
                      ${escapeHtml(
                        profile.name
                      )},
                      ${profile.age}
                    </div>


                    <div
                      class="profile-meta"
                    >
                      🎓
                      ${escapeHtml(
                        profile.university
                      )}
                    </div>


                    <div class="badge">
                      ${escapeHtml(
                        profile.field
                      )}
                    </div>


                    <p class="bio">
                      ${escapeHtml(
                        profile.bio
                      )}
                    </p>


                    ${
                      profile.prompts

                        ? profile.prompts
                            .map(

                              prompt => `

                                <div
                                  class="profile-prompt"
                                >

                                  <div
                                    class="prompt-question"
                                  >
                                    ${escapeHtml(
                                      prompt.question
                                    )}
                                  </div>

                                  <div
                                    class="prompt-answer"
                                  >
                                    ${escapeHtml(
                                      prompt.answer
                                    )}
                                  </div>

                                </div>

                              `

                            )
                            .join("")

                        : ""
                    }


                    ${
                      profile.interests &&
                      profile.interests.length

                        ? `

                          <div
                            class="interests-title"
                          >
                            Interests
                          </div>


                          <div
                            class="interest-tags"
                          >

                            ${profile.interests
                              .map(

                                interest => `

                                  <span
                                    class="interest-tag"
                                  >
                                    ${escapeHtml(
                                      interest
                                    )}
                                  </span>

                                `

                              )
                              .join("")}

                          </div>

                        `

                        : ""
                    }

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

                  <strong>
                    Remember:
                  </strong>

                  once you match,
                  you'll focus on that person
                  instead of continuing to swipe.

                </div>

              `

              : `

                <div class="match-card">

                  <h2>
                    No more profiles
                  </h2>

                  <p class="subtext">
                    You've reached the end
                    of the demo.
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


/* =========================
   PHOTO NAVIGATION
========================= */

function nextPhoto(id) {

  const profile =
    profiles.find(
      profile =>
        profile.id === id
    );


  if (!profile) {
    return;
  }


  currentPhotoIndex++;


  if (
    currentPhotoIndex >=
    profile.photos.length
  ) {

    currentPhotoIndex = 0;

  }


  updateProfilePhoto(
    profile
  );

}


function previousPhoto(id) {

  const profile =
    profiles.find(
      profile =>
        profile.id === id
    );


  if (!profile) {
    return;
  }


  currentPhotoIndex--;


  if (currentPhotoIndex < 0) {

    currentPhotoIndex =
      profile.photos.length - 1;

  }


  updateProfilePhoto(
    profile
  );

}


function updateProfilePhoto(
  profile
) {

  const image =
    document.getElementById(
      "profileImage"
    );


  if (!image) {
    return;
  }


  image.src =
    profile.photos[
      currentPhotoIndex
    ];


  const dots =
    document.querySelectorAll(
      ".photo-dot"
    );


  dots.forEach(
    (dot, index) => {

      dot.classList.toggle(

        "active",

        index ===
          currentPhotoIndex

      );

    }
  );

}


/* =========================
   PASS
========================= */

function passProfile(id) {

  if (
    !state.passed.includes(id)
  ) {

    state.passed.push(id);

  }


  saveState();


  render();

}


/* =========================
   CHECK MATCH
========================= */

function checkForMatch(
  profileId
) {

  const youLikedThem =
    state.likes.includes(
      profileId
    );


  const theyLikedYou =
    incomingLikes.includes(
      profileId
    );


  return (
    youLikedThem &&
    theyLikedYou
  );

}


/* =========================
   LIKE
========================= */

function likeProfile(id) {

  const profile =
    profiles.find(
      profile =>
        profile.id === id
    );


  if (!profile) {
    return;
  }


  if (state.activeMatch) {

    alert(
      "You already have an active match. Get to know them first."
    );

    return;
  }


  if (
    !state.likes.includes(id)
  ) {

    state.likes.push(id);

  }


  if (
    checkForMatch(id)
  ) {

    state.activeMatch =
      profile;


    state.messages = [

      {
        sender: "them",

        text:
          `Hey ${state.user.name}! Nice to match with you.`
      }

    ];


    state.screen =
      "match";

  }

  else {

    state.screen =
      "discover";

  }


  saveState();


  render();

}


/* =========================
   MATCH
========================= */

function renderMatch() {

  const match =
    state.activeMatch;


  if (!match) {

    state.screen =
      "discover";

    render();

    return;
  }


  app.innerHTML = `

    <div class="app-shell">

      <main class="phone">

        <section
          class="screen center-screen"
        >


          <div class="logo">
            Uni<span>Match</span>
          </div>


          <div
            class="match-card"
          >

            <div class="match-avatar">
              ${escapeHtml(
                match.initials
              )}
            </div>


            <div
              class="match-hearts"
            >
              ♥ ♥
            </div>


            <h1>
              It's a match!
            </h1>


            <p class="match-name">
              You and
              ${escapeHtml(
                match.name
              )}
            </p>


            <p class="subtext">
              You both liked each other.
            </p>


            <div
              class="one-match-box"
            >

              <strong>
                This is your one active match.
              </strong>

              <p>
                Take your time getting
                to know each other.
                You won't see new profiles
                while this match is active.
              </p>

            </div>


            <button
              class="btn btn-primary"
              onclick="go('chat')"
            >
              Start chatting
            </button>


            <button
              class="btn btn-secondary"
              onclick="endMatch()"
            >
              End match
            </button>


          </div>


        </section>


        ${nav("match")}


      </main>

    </div>

  `;

}


/* =========================
   CHAT
========================= */

function renderChat() {

  const match =
    state.activeMatch;


  if (!match) {

    state.screen =
      "discover";

    render();

    return;
  }


  app.innerHTML = `

    <div class="app-shell">

      <main class="phone">

        <section
          class="screen chat"
        >


          <div class="topbar">


            <button
              class="icon-btn"
              onclick="go('match')"
            >
              ←
            </button>


            <div>

              <strong>
                ${escapeHtml(
                  match.name
                )}
              </strong>

              <div class="profile-meta">
                Your active match
              </div>

            </div>


            <button
              class="icon-btn"
              onclick="endMatch()"
            >
              End
            </button>


          </div>


          <div class="messages">

            ${state.messages
              .map(

                message => `

                  <div
                    class="message ${
                      message.sender === "me"
                        ? "me"
                        : "them"
                    }"
                  >
                    ${escapeHtml(
                      message.text
                    )}
                  </div>

                `

              )
              .join("")}

          </div>


          <form
            class="chat-form"
            onsubmit="sendMessage(event)"
          >

            <input
              id="messageInput"
              maxlength="500"
              required
              placeholder="Write a message..."
            >


            <button
              type="submit"
            >
              Send
            </button>

          </form>


        </section>


        ${nav("chat")}


      </main>

    </div>

  `;

}


/* =========================
   SEND MESSAGE
========================= */

function sendMessage(event) {

  event.preventDefault();


  const input =
    document.getElementById(
      "messageInput"
    );


  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  state.messages.push({

    sender: "me",

    text: text

  });


  saveState();


  render();

}


/* =========================
   PROFILE
========================= */

function renderProfile() {

  const user =
    state.user;


  if (!user) {

    state.screen =
      "signup";

    render();

    return;
  }


  app.innerHTML = `

    <div class="app-shell">

      <main class="phone">

        <section class="screen">


          <div class="topbar">

            <div class="logo">
              Uni<span>Match</span>
            </div>

          </div>


          <div class="match-card">


            ${
              user.photos &&
              user.photos.length

                ? `

                  <div
                    class="profile-gallery"
                  >

                    ${user.photos
                      .map(

                        (photo, index) => `

                          <div
                            class="profile-gallery-item"
                          >

                            <img
                              src="${escapeHtml(
                                photo
                              )}"
                              alt="Profile photo ${
                                index + 1
                              }"
                            >

                          </div>

                        `

                      )
                      .join("")}

                  </div>

                `

                : `

                  <div
                    class="match-avatar"
                  >
                    ${escapeHtml(
                      user.name
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                `
            }


            <h1>
              ${escapeHtml(
                user.name
              )},
              ${user.age}
            </h1>


            <p class="profile-meta">
              ${escapeHtml(
                user.university
              )}
            </p>


            <div class="badge">
              ${escapeHtml(
                user.field
              )}
            </div>


            <p class="bio">
              ${escapeHtml(
                user.bio
              )}
            </p>


            ${
              user.prompts

                ? user.prompts
                    .filter(
                      prompt =>
                        prompt.answer
                    )
                    .map(

                      prompt => `

                        <div
                          class="profile-prompt"
                        >

                          <div
                            class="prompt-question"
                          >
                            ${escapeHtml(
                              prompt.question
                            )}
                          </div>

                          <div
                            class="prompt-answer"
                          >
                            ${escapeHtml(
                              prompt.answer
                            )}
                          </div>

                        </div>

                      `

                    )
                    .join("")

                : ""
            }


            ${
              user.interests &&
              user.interests.length

                ? `

                  <div
                    class="interests-title"
                  >
                    Interests
                  </div>


                  <div
                    class="interest-tags"
                  >

                    ${user.interests
                      .map(

                        interest => `

                          <span
                            class="interest-tag"
                          >
                            ${escapeHtml(
                              interest
                            )}
                          </span>

                        `

                      )
                      .join("")}

                  </div>

                `

                : ""
            }


          </div>


          <!-- EDIT PROFILE -->

          <button
            class="btn btn-primary"
            onclick="go('editProfile')"
          >
            Edit Profile
          </button>


          <!-- RESET -->

          <button
            class="btn btn-secondary"
            onclick="resetPrototype()"
          >
            Reset prototype
          </button>


        </section>


        ${nav("profile")}


      </main>

    </div>

  `;

}


/* =========================
   EDIT PROFILE
========================= */

function renderEditProfile() {

  const user =
    state.user;


  if (!user) {

    state.screen =
      "signup";

    render();

    return;
  }


  app.innerHTML = `

    <div class="app-shell">

      <main class="phone">

        <section class="screen">


          <div class="topbar">

            <button
              class="icon-btn"
              onclick="go('profile')"
            >
              ←
            </button>


            <div class="logo">
              Uni<span>Match</span>
            </div>


            <div></div>

          </div>


          <h1>
            Edit Profile
          </h1>


          <p class="subtext">
            Update your information
            whenever you want.
          </p>


          <form
            class="form"
            onsubmit="saveProfileChanges(event)"
          >


            <!-- CURRENT PHOTOS -->

            ${
              user.photos &&
              user.photos.length

                ? `

                  <div class="field">

                    <label>
                      Current photos
                    </label>


                    <div
                      class="profile-gallery"
                    >

                      ${user.photos
                        .map(

                          (photo, index) => `

                            <div
                              class="profile-gallery-item"
                            >

                              <img
                                src="${escapeHtml(
                                  photo
                                )}"
                                alt="Photo ${
                                  index + 1
                                }"
                              >

                            </div>

                          `

                        )
                        .join("")}

                    </div>

                  </div>

                `

                : ""
            }


            <!-- NEW PHOTOS -->

            <div class="field">

              <label for="editPhotos">
                Replace photos
              </label>


              <input
                id="editPhotos"
                type="file"
                accept="image/*"
                multiple
                onchange="handleEditPhotos(event)"
              >


              <small
                class="profile-meta"
              >
                Select up to 3 new photos.
                Leave empty to keep your current photos.
              </small>


              <div
                id="editPhotoPreview"
                class="profile-photo-preview"
              ></div>

            </div>


            <!-- NAME -->

            <div class="field">

              <label for="editName">
                First name
              </label>


              <input
                id="editName"
                type="text"
                value="${escapeHtml(
                  user.name
                )}"
                maxlength="30"
                required
              >

            </div>


            <!-- AGE -->

            <div class="field">

              <label for="editAge">
                Age
              </label>


              <input
                id="editAge"
                type="number"
                value="${user.age}"
                min="18"
                max="99"
                required
              >

            </div>


            <!-- UNIVERSITY -->

            <div class="field">

              <label for="editUniversity">
                University
              </label>


              <input
                id="editUniversity"
                type="text"
                value="${escapeHtml(
                  user.university
                )}"
                required
              >

            </div>


            <!-- FIELD -->

            <div class="field">

              <label for="editField">
                What do you study?
              </label>


              <input
                id="editField"
                type="text"
                value="${escapeHtml(
                  user.field
                )}"
                required
              >

            </div>


            <!-- BIO -->

            <div class="field">

              <label for="editBio">
                About you
              </label>


              <textarea
                id="editBio"
                maxlength="300"
                required
              >${escapeHtml(
                user.bio
              )}</textarea>

            </div>


            <!-- INTERESTS -->

            <div class="field">

              <label for="editInterests">
                Interests
              </label>


              <input
                id="editInterests"
                type="text"
                value="${escapeHtml(
                  (user.interests || [])
                    .join(", ")
                )}"
                maxlength="100"
              >

            </div>


            <!-- PROMPT 1 -->

            <div class="field">

              <label for="editPrompt1">
                My ideal Sunday...
              </label>


              <textarea
                id="editPrompt1"
                maxlength="200"
              >${
                user.prompts &&
                user.prompts[0]
                  ? escapeHtml(
                      user.prompts[0]
                        .answer
                    )
                  : ""
              }</textarea>

            </div>


            <!-- PROMPT 2 -->

            <div class="field">

              <label for="editPrompt2">
                Something I'm passionate about...
              </label>


              <textarea
                id="editPrompt2"
                maxlength="200"
              >${
                user.prompts &&
                user.prompts[1]
                  ? escapeHtml(
                      user.prompts[1]
                        .answer
                    )
                  : ""
              }</textarea>

            </div>


            <button
              class="btn btn-primary"
              type="submit"
            >
              Save Changes
            </button>


            <button
              class="btn btn-secondary"
              type="button"
              onclick="go('profile')"
            >
              Cancel
            </button>


          </form>


        </section>


      </main>

    </div>

  `;

}


/* =========================
   EDIT PHOTO UPLOAD
========================= */

function handleEditPhotos(event) {

  const files =
    Array.from(
      event.target.files || []
    );


  if (files.length > 3) {

    alert(
      "You can add up to 3 photos."
    );

    event.target.value = "";

    newProfilePhotos = [];

    renderEditPhotoPreview();

    return;
  }


  if (files.length === 0) {

    newProfilePhotos = [];

    renderEditPhotoPreview();

    return;
  }


  newProfilePhotos = [];

  let loaded = 0;


  files.forEach(file => {

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      return;
    }


    const reader =
      new FileReader();


    reader.onload = () => {

      newProfilePhotos.push(
        reader.result
      );

      loaded++;


      if (
        loaded === files.length
      ) {

        renderEditPhotoPreview();

      }

    };


    reader.readAsDataURL(file);

  });

}


/* =========================
   EDIT PHOTO PREVIEW
========================= */

function renderEditPhotoPreview() {

  const preview =
    document.getElementById(
      "editPhotoPreview"
    );


  if (!preview) {
    return;
  }


  preview.innerHTML =
    newProfilePhotos
      .map(

        (photo, index) => `

          <div
            class="profile-photo-preview-item"
          >

            <img
              src="${escapeHtml(
                photo
              )}"
              alt="New photo ${
                index + 1
              }"
            >

            <span>
              ${
                index === 0
                  ? "Main photo"
                  : `Photo ${index + 1}`
              }
            </span>

          </div>

        `

      )
      .join("");

}


/* =========================
   SAVE PROFILE CHANGES
========================= */

function saveProfileChanges(event) {

  event.preventDefault();


  const interests =
    document
      .getElementById(
        "editInterests"
      )
      .value
      .split(",")
      .map(
        interest =>
          interest.trim()
      )
      .filter(
        interest =>
          interest.length > 0
      );


  state.user.name =
    document
      .getElementById(
        "editName"
      )
      .value
      .trim();


  state.user.age =
    Number(
      document
        .getElementById(
          "editAge"
        )
        .value
    );


  state.user.university =
    document
      .getElementById(
        "editUniversity"
      )
      .value
      .trim();


  state.user.field =
    document
      .getElementById(
        "editField"
      )
      .value
      .trim();


  state.user.bio =
    document
      .getElementById(
        "editBio"
      )
      .value
      .trim();


  state.user.interests =
    interests;


  state.user.prompts = [

    {
      question:
        "My ideal Sunday...",

      answer:
        document
          .getElementById(
            "editPrompt1"
          )
          .value
          .trim()
    },

    {
      question:
        "Something I'm passionate about...",

      answer:
        document
          .getElementById(
            "editPrompt2"
          )
          .value
          .trim()
    }

  ];


  /*
    Only replace photos if
    the user selected new ones.
  */

  if (
    newProfilePhotos.length > 0
  ) {

    state.user.photos =
      [...newProfilePhotos];

  }


  saveState();


  newProfilePhotos = [];


  state.screen =
    "profile";


  render();

}


/* =========================
   NAVIGATION
========================= */

function nav(active) {

  return `

    <nav class="nav">


      <button
        class="${
          active === "discover"
            ? "active"
            : ""
        }"
        onclick="go('discover')"
      >
        Discover
      </button>


      <button
        class="${
          active === "match" ||
          active === "chat"
            ? "active"
            : ""
        }"
        onclick="go(
          state.activeMatch
            ? 'chat'
            : 'discover'
        )"
      >

        ${
          state.activeMatch
            ? "My match"
            : "Match"
        }

      </button>


      <button
        class="${
          active === "profile"
            ? "active"
            : ""
        }"
        onclick="go('profile')"
      >
        Profile
      </button>


    </nav>

  `;

}


/* =========================
   GO TO SCREEN
========================= */

function go(screen) {

  if (

    !state.user &&

    [
      "discover",
      "match",
      "chat",
      "profile",
      "editProfile"
    ].includes(screen)

  ) {

    screen =
      "signup";

  }


  if (

    screen === "discover" &&
    state.activeMatch

  ) {

    screen =
      "match";

  }


  state.screen =
    screen;


  render();

}


/* =========================
   END MATCH
========================= */

function endMatch() {

  if (!state.activeMatch) {
    return;
  }


  const confirmed =
    confirm(
      "End this match? You will be able to discover people again."
    );


  if (!confirmed) {
    return;
  }


  state.activeMatch =
    null;


  state.messages =
    [];


  saveState();


  state.screen =
    "discover";


  render();

}


/* =========================
   RESET
========================= */

function resetPrototype() {

  localStorage.removeItem(
    "unimatch_user"
  );

  localStorage.removeItem(
    "unimatch_match"
  );

  localStorage.removeItem(
    "unimatch_passed"
  );

  localStorage.removeItem(
    "unimatch_likes"
  );

  localStorage.removeItem(
    "unimatch_messages"
  );


  state.user =
    null;

  state.activeMatch =
    null;

  state.passed =
    [];

  state.likes =
    [];

  state.messages =
    [];


  newProfilePhotos =
    [];


  currentPhotoIndex =
    0;


  state.screen =
    "welcome";


  render();

}


/* =========================
   START APP
========================= */

render();