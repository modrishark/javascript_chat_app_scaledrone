const CLIENT_ID = "cWfbpG2HRkmiDDAh"; //4cNswoNqM2wVFHPg

const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
    timestamp: new Date().toLocaleString("hr-HR"),
  },
});

let members = [];

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");

  const room = drone.subscribe("observable-room");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });

  room.on("members", (m) => {
    members = m;
    updateMembersDOM();
  });

  room.on("member_join", (member) => {
    members.push(member);
    updateMembersDOM();
  });

  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on("data", (text, member) => {
    if (member) {
      const timestamp = member.clientData.timestamp;
      addMessageToListDOM(text, member, timestamp);
    } else {
    }
  });
});
drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

function getRandomName() {
  const firstName = [
    "Ivan",
    "Marko",
    "Josip",
    "Ante",
    "Mario",
    "Nikola",
    "Petar",
    "Tomislav",
    "Igor",
    "Ivica",
    "Stjepan",
    "Robert",
    "Davor",
    "Marin",
    "Darko",
    "Mirko",
    "Luka",
    "Dario",
    "Irena",
    "Ana",
    "Sanja",
    "Martina",
    "Maja",
    "Katarina",
    "Jelena",
    "Kristina",
    "Marina",
    "Ivana",
    "Nina",
    "Ivona",
    "Lana",
    "Monika",
    "Diana",
    "Tamara",
    "Dunja",
    "Ivana",
    "Sara",
    "Lucija",
    "Lea",
    "Elena",
    "Tina",
    "Ivanka",
    "Adrijana",
    "Ema",
    "Ljiljana",
    "Lara",
    "Matea",
    "Klara",
    "Dora",
    "Tea",
    "Lana",
    "Iva",
    "Magdalena",
    "Sandra",
    "Barbara",
    "Natalija",
  ];

  const lastName = [
    "Horvat",
    "Kovačević",
    "Babić",
    "Novak",
    "Jurić",
    "Kovačić",
    "Vuković",
    "Knežević",
    "Marković",
    "Petrović",
    "Đurić",
    "Tomljanović",
    "Marić",
    "Kovač",
    "Jakovljević",
    "Tomić",
    "Kukić",
    "Pavlović",
    "Bosnić",
    "Milić",
    "Grgić",
    "Blažević",
    "Šimić",
    "Vidović",
    "Filipović",
    "Kolar",
    "Šarić",
    "Matić",
    "Radić",
    "Lukić",
    "Milanović",
    "Đukić",
    "Petković",
    "Popović",
    "Vukić",
    "Barišić",
    "Nikolić",
    "Klarić",
    "Kovačević",
    "Martinović",
    "Jovanović",
    "Ilić",
    "Pavlović",
    "Krznarić",
    "Vulić",
    "Balić",
    "Rukavina",
    "Kralj",
    "Kovačić",
    "Pavlović",
    "Sikirić",
    "Horvat",
    "Knežević",
    "Babić",
    "Perić",
    "Hodak",
    "Jurić",
    "Tomljanović",
  ];

  return (
    firstName[Math.floor(Math.random() * firstName.length)] +
    " " +
    lastName[Math.floor(Math.random() * lastName.length)]
  );
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const DOM = {
  membersCount: document.querySelector(".members-count"),
  membersList: document.querySelector(".members-list"),
  messages: document.querySelector(".messages"),
  input: document.querySelector(".message-form__input"),
  form: document.querySelector(".message-form"),
};

DOM.form.addEventListener("submit", sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === "") {
    return;
  }
  DOM.input.value = "";
  drone.publish({
    room: "observable-room",
    message: value,
  });
}

function updateMembersDOM() {
  if (members.length === 0) {
    DOM.membersCount.innerText =
      "There are no users connected to the room, please check Channel ID";
  } else if (members.length === 1) {
    DOM.membersCount.innerText = "There is only 1 user connected in the room:";
  } else {
    DOM.membersCount.innerText = `There are ${members.length} users connected in the room:`;
  }

  DOM.membersList.innerHTML = "";
  members.forEach((member) => {
    const memberElement = createMemberElement(member, true);
    DOM.membersList.appendChild(memberElement);
  });
}

function createMemberElement(member, includeID = false) {
  const { id, name, color } = member.clientData;
  const el = document.createElement("div");
  if (includeID) {
    el.innerHTML = `ID: ${member.id} | Username: ${name}`;
  } else {
    el.innerHTML = `${name}`;
  }
  el.className = "member";
  el.style.color = color;
  return el;
}

function createMessageElement(text, member, timestamp) {
  const { id } = member;
  const el = document.createElement("div");
  const memberElement = createMemberElement(member);
  el.appendChild(memberElement);

  const timestampElement = document.createElement("div");
  timestampElement.className = "message-timestamp";
  timestampElement.textContent = timestamp;
  el.appendChild(timestampElement);

  const lineBreak = document.createElement("br");
  el.appendChild(lineBreak);

  const textElement = document.createElement("div");
  textElement.className = "message-text";
  textElement.textContent = text;
  el.appendChild(textElement);

  el.className = "message";

  if (id === drone.clientId) {
    el.classList.add("sent-message");
  } else {
    el.classList.add("incoming-message");
  }
  console.log(
    "Message " +
      "'" +
      text +
      "'" +
      " is from user:" +
      "'" +
      member.clientData.name +
      "'" +
      " which ID is:" +
      "'" +
      member.id +
      "'"
  );
  return el;
}

function addMessageToListDOM(text, member, timestamp) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member, timestamp));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}

const toggle = document.getElementById("toggle");

toggle.addEventListener("change", () => {
  if (document.body.classList.contains("light-mode")) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  }
});
