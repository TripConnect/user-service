import {UserInfo} from "node-proto-lib/protos/user_service_pb";
import {Cacheable} from "@type-cacheable/core";
import NodeCache from 'node-cache';
import { useAdapter } from '@type-cacheable/node-cache-adapter';
import {USER_REPOSITORY} from "./repository";

const client = new NodeCache();
const clientAdapter = useAdapter(client);

class UserService {
  @Cacheable({
    cacheKey: (args: any[]) => `FIND_USER_${args[0]}`,
    client: clientAdapter,
    ttlSeconds: 4 * 60 * 60,
  })
  public async findUser(userId: string): Promise<UserInfo | null> {
    let user = await USER_REPOSITORY.findOne({ where: { id: userId } });

    if (!user) return null;

    return new UserInfo()
      .setId(user.id)
      .setDisplayName(user.display_name)
      .setAvatar(user.avatar)
      .setEnabledTwofa(user.enabled_twofa);
  }
}

export default new UserService();
