import { SessionUser } from "../auth/SessionUser";

declare global {
  // Express.User を Mongoose ドキュメント型へマージ拡張
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface User extends SessionUser {}
  }
}
