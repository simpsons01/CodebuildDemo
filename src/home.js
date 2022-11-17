import { createDomText } from "./utils/dom"
const title = createDomText("h1", "this is home page")
const subTitle = createDomText("h2", "this is home page subTitle")
const description1 = createDomText("p", "this is home page description1")
const description2 = createDomText("p", "this is home page description2")
const description3 = createDomText("p", "this is home page description3")
const footer = createDomText("p", "this is home page footer text")

const app = document.querySelector("#app")
app.appendChild(title)
app.appendChild(description1)
app.appendChild(description2)
app.appendChild(description3)
app.appendChild(subTitle)
app.appendChild(footer)