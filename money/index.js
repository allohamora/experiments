const assert = require('assert').strict;
const currency = require('currency.js');
const tsMoney = require('ts-money');
const dineroJs = require('dinero.js');

const expected = '5.00';

const currencyWay = () => currency(10).subtract(5).toString();
const tsMoneyWay = () => {
  const { Money, Currencies: { USD } } = tsMoney;

  return new Money(1000, USD).subtract(new Money(500, USD)).toString();
}
const dineroWay = () => dineroJs({ amount: 1000, currency: 'USD' })
  .subtract(dineroJs({ amount: 500, currency: 'USD' }))
  .toFormat('0.00')

const check = (ways) => ways.forEach(way => {
  const groupName = way.name;
  console.group(groupName);
  try {
    const actual = way();
    assert.strictEqual(actual, expected);

    console.log(actual);
  } catch (error) {
    console.error(error);
  }
  console.groupEnd(groupName);
});

check([currencyWay, tsMoneyWay, dineroWay]);

// my choice is currency.js