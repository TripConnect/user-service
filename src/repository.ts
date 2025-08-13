import sequelize from "./database/models";
import User from "./database/models/user";
import UserCredential from "./database/models/user-credential";
import { Repository, Model } from 'sequelize-typescript';

function createRepository<M extends Model>(model: new () => M): Repository<M> {
  const repository = sequelize.getRepository(model);
  const originalFindOne = repository.findOne.bind(repository);

  repository.findOne = async (options: any = {}) => {
    return originalFindOne({
      ...options,
      raw: true
    });
  };

  return repository;
}

// Use the wrapper function to create repositories
export const userRepository = createRepository(User);
export const userCredentialRepository = createRepository(UserCredential);
