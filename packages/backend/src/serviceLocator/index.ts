import UserDao from '@/daos/UserDao';
import ThreadDao from '@/daos/ThreadDao';
import MessageDao from '@/daos/MessageDao';

const instances: { [key: string]: any } = {};

export type ServiceTypes = {
  UserDao: typeof UserDao;
  ThreadDao: typeof ThreadDao;
  MessageDao: typeof MessageDao;
};

export default {
  set<K extends keyof ServiceTypes, V extends ServiceTypes[K]>(
    instanceId: K,
    instance: V
  ): void {
    instances[instanceId] = instance;
  },

  get<K extends keyof ServiceTypes, V extends ServiceTypes[K]>(
    instanceId: K
  ): V {
    return instances[instanceId];
  },
};
