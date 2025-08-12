import sequelize from "./database/models";
import User from "./database/models/user";
import UserCredential from "./database/models/user_credential";

export const USER_REPOSITORY = sequelize.getRepository(User);
export const USER_CRIDENTIAL_REPOSITORY = sequelize.getRepository(UserCredential);
