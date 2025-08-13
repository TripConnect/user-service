import sequelize from "./database/models";
import User from "./database/models/user";
import UserCredential from "./database/models/user-credential";

export const userRepository = sequelize.getRepository(User);
export const userCredentialRepository = sequelize.getRepository(UserCredential);
