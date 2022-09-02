export class User {
  constructor(
    private accessToken: string,
    public email: string,
    public first_name: string,
    public last_name: string,
    public id: number,
    public img: string,
    public regionId: number,
    public role: string,
    public userContacts: string[]
  ) // public lang?: string
  {}
  getToken() {
    return this.accessToken;
  }
}