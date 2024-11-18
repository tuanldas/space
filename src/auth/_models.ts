export interface AuthModel {
  access_token: string;
  refreshToken?: string;
  expires_in?: number;
  api_token: string;
}

export interface UserModel {
  uuid: string;
  username: string;
  password: string | undefined;
  email: string;
  first_name: string;
  last_name: string;
  fullname?: string;
  auth?: AuthModel;
}
