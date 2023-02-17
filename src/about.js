import lodash from "lodash"
import { createDomText } from "./utils/dom"
const title = createDomText("h1", "this is about page")
const subTitle = createDomText("h2", "this is about page subTitle")
const description1 = createDomText("p", "this is description 1")
const descriptionShine = createDomText("p", "this is Shine's test")
const description2 = createDomText("p", "this is description 2")
const description3 = createDomText("p", "this is description sss4sssfeeesssff4")

lodash.isEmpty('')
const app = document.querySelector("#app")
app.appendChild(title)
app.appendChild(subTitle)
app.appendChild(description1)
app.appendChild(description2)
app.appendChild(description3)
app.appendChild(descriptionShine)