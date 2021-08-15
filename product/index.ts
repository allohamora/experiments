const generateId = () => `${Math.random()}`;

abstract class Product {
  public id: string = generateId();

  public abstract applyToUser(user: string, amount: number): void
}

class Privilege extends Product {
  public applyToUser(user: string, amount: number) {
    console.log(`${amount} privilege applied to ${user}`);
  }
}

class Currency extends Product {
  public applyToUser(user: string, amount: number) {
    console.log(`${amount} currency applied to ${user}`);
  }
}

class Other extends Product {
  public applyToUser(user: string, amount: number) {
    console.log(`${amount} other applied to ${user}`);
  }
}

class ProductModel {
  public id: string = generateId();

  constructor(
    public productId: string, 
    public type: 'privilege' | 'currency' | 'other'
  ) {}
}

const generateArray = <V extends unknown>(getValue: () => V, length: number = 1) => {
  return Array.from({ length }, getValue);
}

const privileges = generateArray(() => new Privilege());
const currencies = generateArray(() => new Currency());
const others = generateArray(() => new Other());

const productModelToProduct = (productModel: ProductModel): Product => {
  switch (productModel.type) {
    case 'privilege':
      return privileges[0];
    case 'currency':
      return currencies[0];
    case 'other':
      return others[0];
  }
}

const productModels = [
  new ProductModel(privileges[0].id, 'privilege'),
  new ProductModel(currencies[0].id, 'currency'),
  new ProductModel(others[0].id, 'currency')
];

const products = productModels.map(productModel => productModelToProduct(productModel));

products.forEach(product => product.applyToUser('123', 1));