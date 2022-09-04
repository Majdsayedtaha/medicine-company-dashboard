export class User {
  constructor(
    private accessToken: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public id: number,
    public img: string,
    public regionId: number,
    public role: string,
    public userContacts: string[],
    public isAuth?: boolean,
  ) // public lang?: string
  {}
  getToken() {
    return this.accessToken;
  }
}
