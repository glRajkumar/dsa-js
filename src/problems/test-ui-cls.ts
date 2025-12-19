
function hashFn(str: string = "", tableSize: number) {
  let hash = 13
  const len = str.length

  for (let i = 0; i < len; i++) {
    hash = (hash * str.charCodeAt(i)) % tableSize
  }

  return hash
}

export class HashTable {
  #count = 0
  size: number
  table: Map<string, any>[]

  constructor(size?: number) {
    this.size = size || 7
    this.table = new Array(this.size)

    for (let i = 0; i < this.size; i++) {
      this.table[i] = new Map()
    }
  }

  #resize() {
    const newTable = new Array(this.size * 2)
    const newSize = newTable.length

    for (let i = 0; i < newSize; i++) {
      newTable[i] = new Map()
    }

    this.table.forEach((item) => {
      if (item.size > 0) {
        item.forEach((val, key) => {
          const id = hashFn(key, newSize)
          newTable[id].set(key, val)
        })
      }
    })

    this.table = newTable
    this.size = this.size * 2
  }

  add(key: string, data: any) {
    const loadFactor = this.#count / this.size
    if (loadFactor > 0.8) {
      this.#resize()
    }

    const id = hashFn(key, this.size)
    this.table[id].set(key, data)
    this.#count++
  }

  remove(key: string) {
    const id = hashFn(key, this.size)
    this.table[id].delete(key)
    this.#count--
  }

  find(key: string) {
    const id = hashFn(key, this.size)
    return this.table[id].get(key)
  }

  isEmpty() {
    return this.#count === 0
  }

  getData() {
    return this.table
  }

  getLength() {
    return this.#count
  }
}

export class MathTools {
  multiply(a: number, b: number): number {
    return a * b
  }

  async delayedMultiply(a: number, b: number): Promise<number> {
    await new Promise((r) => setTimeout(r, 200))
    return a * b
  }
}

export class UserProfile {
  public name: string
  public age: number

  public readonly id: string

  private password: string
  private loginAttempts: number = 0

  constructor(name: string, age: number, id: string, password: string) {
    this.name = name
    this.age = age
    this.id = id
    this.password = password
  }

  public updateAge(newAge: number): void {
    this.age = newAge
  }

  public authenticate(pass: string): boolean {
    const isValid = this.validatePassword(pass)
    this.loginAttempts++

    return isValid
  }

  private validatePassword(pass: string): boolean {
    return pass === this.password
  }

  public getProfile() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      loginAttempts: this.loginAttempts,
    }
  }
}

interface Address {
  street: string;
  city: string;
  zipCode: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  addresses: Address[];
  metadata: Map<string, any>;
}

interface Product {
  id: number;
  name: string;
  price: number;
  tags: Set<string>;
}

export class DataStore {
  private name: string;
  private age: number;
  private isActive: boolean;

  private tags: Set<string>;
  private scores: Map<string, number>;
  private hobbies: string[];

  private profile: { username: string; bio: string };

  private users: User[];
  private productsByCategory: Map<string, Product[]>;
  private categoryTags: Map<string, Set<string>>;
  private nestedArray: { items: number[]; metadata: Map<string, string> }[];

  constructor() {
    this.name = "John Doe";
    this.age = 30;
    this.isActive = true;

    this.tags = new Set(["typescript", "programming", "nodejs"]);
    this.scores = new Map([
      ["math", 95],
      ["science", 88],
      ["history", 92]
    ]);
    this.hobbies = ["reading", "gaming", "hiking"];

    this.profile = {
      username: "johndoe123",
      bio: "Software developer"
    };

    this.users = [
      {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        addresses: [
          { street: "123 Main St", city: "Boston", zipCode: 12345 },
          { street: "456 Oak Ave", city: "NYC", zipCode: 67890 }
        ],
        metadata: new Map([
          ["role", "admin"],
          ["joinDate", "2024-01-15"]
        ])
      }
    ];

    this.productsByCategory = new Map([
      [
        "electronics",
        [
          {
            id: 1,
            name: "Laptop",
            price: 999,
            tags: new Set(["computer", "portable", "work"])
          },
          {
            id: 2,
            name: "Phone",
            price: 699,
            tags: new Set(["mobile", "communication"])
          }
        ]
      ],
      [
        "books",
        [
          {
            id: 3,
            name: "TypeScript Guide",
            price: 39,
            tags: new Set(["programming", "education"])
          }
        ]
      ]
    ]);

    this.categoryTags = new Map([
      ["electronics", new Set(["tech", "gadgets", "devices"])],
      ["books", new Set(["literature", "education", "reading"])]
    ]);

    this.nestedArray = [
      {
        items: [1, 2, 3],
        metadata: new Map([
          ["type", "numbers"],
          ["count", "3"]
        ])
      },
      {
        items: [4, 5, 6],
        metadata: new Map([
          ["type", "sequence"],
          ["count", "3"]
        ])
      }
    ];
  }

  getName(): string {
    return this.name;
  }

  getAge(): number {
    return this.age;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getTags(): Set<string> {
    return new Set(this.tags)
  }

  getScores(): Map<string, number> {
    return new Map(this.scores)
  }

  getScore(subject: string): number | undefined {
    return this.scores.get(subject);
  }

  getHobbies(): string[] {
    return [...this.hobbies]
  }

  getProfile(): { username: string; bio: string } {
    return { ...this.profile }
  }

  getUsers(): User[] {
    return JSON.parse(JSON.stringify(this.users))
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getProductsByCategory(category: string): Product[] | undefined {
    return this.productsByCategory.get(category);
  }

  getCategoryTags(category: string): Set<string> | undefined {
    return this.categoryTags.get(category);
  }

  getNestedArray(): { items: number[]; metadata: Map<string, string> }[] {
    return this.nestedArray.map(item => ({
      items: [...item.items],
      metadata: new Map(item.metadata)
    }));
  }

  updateName(name: string): void {
    this.name = name;
  }

  updateAge(age: number): void {
    this.age = age;
  }

  updateIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }

  removeTag(tag: string): boolean {
    return this.tags.delete(tag);
  }

  updateScore(subject: string, score: number): void {
    this.scores.set(subject, score);
  }

  deleteScore(subject: string): boolean {
    return this.scores.delete(subject);
  }

  addHobby(hobby: string): void {
    this.hobbies.push(hobby);
  }

  removeHobby(hobby: string): void {
    this.hobbies = this.hobbies.filter(h => h !== hobby);
  }

  updateProfile(username?: string, bio?: string): void {
    if (username !== undefined) this.profile.username = username;
    if (bio !== undefined) this.profile.bio = bio;
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  updateUserEmail(userId: number, newEmail: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.email = newEmail;
      return true;
    }
    return false;
  }

  addAddressToUser(userId: number, address: Address): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.addresses.push(address);
      return true;
    }
    return false;
  }

  updateUserMetadata(userId: number, key: string, value: any): boolean {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.metadata.set(key, value);
      return true;
    }
    return false;
  }

  addProductToCategory(category: string, product: Product): void {
    const products = this.productsByCategory.get(category);
    if (products) {
      products.push(product);
    } else {
      this.productsByCategory.set(category, [product]);
    }
  }

  addTagToProduct(category: string, productId: number, tag: string): boolean {
    const products = this.productsByCategory.get(category);
    if (products) {
      const product = products.find(p => p.id === productId);
      if (product) {
        product.tags.add(tag);
        return true;
      }
    }
    return false;
  }

  addCategoryTag(category: string, tag: string): void {
    const tags = this.categoryTags.get(category);
    if (tags) {
      tags.add(tag);
    } else {
      this.categoryTags.set(category, new Set([tag]));
    }
  }

  addNestedItem(items: number[], metadata: Map<string, string>): void {
    this.nestedArray.push({ items, metadata });
  }

  updateNestedItemMetadata(index: number, key: string, value: string): boolean {
    if (index >= 0 && index < this.nestedArray.length) {
      this.nestedArray[index].metadata.set(key, value);
      return true;
    }
    return false;
  }

  displayAll(): void {
    console.log("=== Primitive Types ===")
    console.log("Name:", this.name)
    console.log("Age:", this.age)
    console.log("Is Active:", this.isActive)

    console.log("\n=== Collections ===")
    console.log("Tags:", Array.from(this.tags))
    console.log("Scores:", Object.fromEntries(this.scores))
    console.log("Hobbies:", this.hobbies)

    console.log("\n=== Object ===")
    console.log("Profile:", this.profile)

    console.log("\n=== Nested Structures ===")
    console.log("Users:", JSON.stringify(this.users, null, 2))
    console.log("\nProducts by Category:")
    this.productsByCategory.forEach((products, category) => {
      console.log(`  ${category}:`, products)
    })
  }
}
