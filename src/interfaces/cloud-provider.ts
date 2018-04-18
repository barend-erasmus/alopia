import { Server } from '../models/server';
import { ServerCreated } from '../models/server-created';

export interface ICloudProvider {

    createServer(server: Server): Promise<ServerCreated>;

}
