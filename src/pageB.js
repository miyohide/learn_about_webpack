import * as calc from "./libs/calc"
import $ from 'jquery'

const e = $('#app')
e.text(`1 + 2 = ${calc.add(1, 2)}`)
for (let i = 0; i < 100; i++) {
 e.fadeToggle(500)
}
