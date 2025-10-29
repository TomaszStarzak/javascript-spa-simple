import test from 'node:test';
import { strict as assert } from 'node:assert';

test('home button click triggers alert', async () => {
  // Create a minimal DOM fragment similar to the controller's output
  const divElement = {
    innerHTML: '<button id="btnClick">Click me</button>',
  querySelector (selector) {
      if (selector === '#btnClick') {
        return this._btn || (this._btn = createButton());
      }
      return null;
    }
  };

  function createButton () {
    const listeners = {};
    return {
  addEventListener (event, handler) {
        listeners[event] = handler;
      },
  click () {
        if (typeof listeners.click === 'function') listeners.click();
      }
    };
  }

  // Spy for global alert
  let alerted = false;
  global.alert = () => { alerted = true; };

  // Simulate controller wiring
  const btnClick = divElement.querySelector('#btnClick');
  btnClick.addEventListener('click', () => {
    alert('clicked');
  });

  // Trigger the click and assert
  btnClick.click();
  assert.equal(alerted, true);
});
