export interface DataUpdateUser {
  password?: string;
  randomCode?: string;
  randomCodeExpiration?: Date;
  isActivate?: Date;
  typeUser?: "COMMON" | "ADVERTISER"
};