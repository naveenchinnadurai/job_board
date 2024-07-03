import { User } from "../services/auth.service"; // Adjust this import

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
