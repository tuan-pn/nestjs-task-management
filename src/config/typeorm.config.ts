import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as config from 'config';

const dbCfg = config.get('db');
console.log('db :: ', dbCfg);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbCfg.type,
  host: process.env.RDS_HOSTNAME || dbCfg.host,
  port: process.env.DRS_PORT || dbCfg.port,
  username: process.env.RDS_USERNAME || dbCfg.username,
  password: process.env.RDS_PASSWORD || dbCfg.password,
  database: process.env.RDS_DB_NAME || dbCfg.database,
  entities: [path.join(__dirname, '/../**/*.entity.{ts,js}')],
  synchronize: process.env.TYPEORM_SYNC || dbCfg.synchronize,
  logger: 'debug',
};
