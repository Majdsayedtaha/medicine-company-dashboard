export class User {
  constructor(
    public email: string,
    public id: number,
    public user_name: string,
    public company_name: string,
    public company_address: string,
    public tel_number: string,
    private token: string,
    public lang: string
  ) {}
  getToken() {
    return this.token;
  }
}
