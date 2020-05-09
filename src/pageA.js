import * as logger from './libs/logger'
import * as calc from './libs/calc'

logger.debug('Message', 'pageA')
let e = document.getElementById('app')
e.innerText = `2 + 3 = ${calc.add(2, 3)}`
