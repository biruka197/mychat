import '/style.css'
const form = document.querySelector('form')
const chatContainer = document.querySelector("#chat_container")
let loadInterval;
function loader(e) {
  e.textContent = "";
  loadInterval = setInterval(() => {
    e.textContent += '.'
    if (e.textContent === ".....") {
      e.textContent = ""
    }
  }, 300)
}

function typeText(e, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      e.innerHTML += text.charAt(index);

      index++;
      console.log(text.length)

    } else {

      clearInterval(interval)
      console.log("oll");
    }
  }, 20)
}
function genarateUniqueId() {
  const timestamp = Date.now();
  const randomnumber = Math.random();
  const randomHex = randomnumber.toString(16)
  return `id-${timestamp}-${randomHex}`
}
function chatStrip(isAi, value, unId) {
  return (
    `<div class="wrapper ${isAi && "ai"} style="overflow: scroll;">
     
        <div class="o" style="background: none; display:flex;">
        <div class="profile" >
        <img src= ${isAi ? "https://source.unsplash.com/random/300×300" : "https://source.unsplash.com/random/300×300"}/>
      </div>

    <div class="message" id=${unId || "e"}>
        ${value}
    </div>
        </div>
             
  </div>
   
  `
  )
}
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += chatStrip(false, data.get("prompt"))
  form.reset()
  const unId = genarateUniqueId()
  chatContainer.innerHTML += chatStrip(true, " ", unId)
  chatContainer.scrollTop = chatContainer.scrollHeight
  const messageDiv = document.getElementById(unId)
  loader(messageDiv);

  const response = await fetch("https://burachat.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify({
      prompt: data.get("prompt")
    })
  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = ""
  if (response.ok) {
    const data = await response.json()
    const parse = data.bot.trim();
    // console.log(parse)
    typeText(messageDiv, parse)

  }
  else {
    const err = await response.text()
    messageDiv.innerHTML = "error"
    console.log(err)
  }
}
form.addEventListener("submit", handleSubmit)