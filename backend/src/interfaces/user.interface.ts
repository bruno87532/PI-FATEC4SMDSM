export interface DataUpdateUser {
  password?: string;
  randomCode?: string;
  randomCodeExpiration?: Date;
  isActivate?: Date;
  typeUser?: "COMMON" | "ADVERTISER";
  phone?: string;
  name?: string;
  advertiserName?: string;
  email?: string;
};
