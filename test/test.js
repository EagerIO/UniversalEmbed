import EmbedBox from "embed-box"

document.addEventListener("DOMContentLoaded", () => {
  new EmbedBox({
    name: "Example Plugin",
    embedCode: "<script src='{{BASE_URL}}/examples/library.js'></script>"
  })
})
