import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import { User } from "../interfaces/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (req && req.cookies) {
          return req.cookies["access_token"]
        }
        return null
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY ?? "",
    });

  }

  async validate(payload: User) {
    return { 
      userId: payload.id, 
    }
  }
}