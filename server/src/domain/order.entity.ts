export class Order {
  constructor(
    public id: string,
    public items: string[],
    public total: number,
  ) {}

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + parseFloat(item), 0);
  }
}
