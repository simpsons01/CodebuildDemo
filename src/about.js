import { createDomText } from "./utils/dom"
const title = createDomText("h1", "this is about page")
const subTitle = createDomText("h2", "this is about page subTitle")
const description1 = createDomText("p", "this is about page description1")
const description2 = createDomText("p", "this is about page description2")
const description3 = createDomText("p", "this is about page description3")
const description5 = createDomText("p", "this is about page description5")
const description6 = createDomText("p", "this is about page description6")
const description7 = createDomText("p", "this is about page description7")
const descriptionShine = createDomText("p", "this is Shine's test")


const app = document.querySelector("#app")
app.appendChild(title)
app.appendChild(subTitle)
app.appendChild(description1)
app.appendChild(description2)
app.appendChild(description3)
app.appendChild(description5)
app.appendChild(description6)
app.appendChild(description7)
app.appendChild(descriptionShine)