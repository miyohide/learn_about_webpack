import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());

const div_element = document.getElementsByTagName('div')[0];
const span_element = document.createElement('span');
span_element.innerHTML = 'this is span';
div_element.replaceWith(span_element);
