export class User {
  private _id: string;
  private _email: string;
  private _name?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    email: string,
    name?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get name(): string | undefined {
    return this._name;
  }

  set name(name: string | undefined) {
    this._name = name;
    this._updatedAt = new Date();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
