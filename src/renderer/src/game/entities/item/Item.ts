export abstract class Item {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract use?(): void;
}
