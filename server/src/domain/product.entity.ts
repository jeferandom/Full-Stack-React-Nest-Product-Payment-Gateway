export class Product {
  constructor(
    public productId: string,
    public name: string,
    public price: number,
    public description: string,
    public image: string,
    public unitsInStock: number,
    public unitsOnOrder: number,
  ) {}
}
