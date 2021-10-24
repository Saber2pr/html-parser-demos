import { parse } from './core/html-parser'
import { parse2 } from './core/html-parser-2'
import { parse3 } from './core/html-parser-3'
import { parse4 } from './core/html-parser-4'

const input = `<div class="root" ><span id="text" ></span></div>`

// console.log(JSON.stringify(parse(input), null, 2))
// console.log(JSON.stringify(parse2(input), null, 2))
// console.log(JSON.stringify(parse3(input), null, 2))
console.log(JSON.stringify(parse4(input), null, 2))
