import chalk from 'chalk';
import * as request from 'request-promise';
import { ICloudProvider } from '../interfaces/cloud-provider';
import { Server } from '../models/server';
import { ServerCreated } from '../models/server-created';

export class DigitalOceanCloudProvider implements ICloudProvider {

    protected baseUri: string = 'https://api.digitalocean.com/v2';

    constructor(
        protected apiKey: string,
        protected region: string,
    ) {

    }

    // TODO: Implement rollback strategy
    public async createServer(server: Server): Promise<ServerCreated> {
        const httpPOSTDropletsResponse: any = await this.httpPOSTDroplets(server);

        console.log(chalk.magenta(`Digital Ocean: Server Created with id '${httpPOSTDropletsResponse.droplet.id}'`));

        let httpGETDropletsResponse: any = null;

        while (!httpGETDropletsResponse || httpGETDropletsResponse.droplet.status !== 'active') {
            httpGETDropletsResponse = await this.httpGETDroplets(httpPOSTDropletsResponse.droplet.id);

            console.log(chalk.magenta(`Digital Ocean: Server Status '${httpGETDropletsResponse.droplet.status}'`));

            await this.wait(5000);
        }

        return null;
    }

    protected httpGETDroplets(id: string): Promise<any> {
        return request({
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
            json: true,
            method: 'GET',
            uri: `${this.baseUri}/droplets/${id}`,
        });
    }

    protected httpPOSTDroplets(server: Server): Promise<any> {
        return request({
            body: this.toServer(server),
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
            json: true,
            method: 'POST',
            uri: `${this.baseUri}/droplets`,
        });
    }

    protected toServer(server: Server): any {
        return {
            backups: false,
            ipv6: false,
            image: server.image,
            monitoring: true,
            name: server.name,
            private_networking: null,
            region: this.region,
            size: server.flavor,
            ssh_keys: ['de:f2:51:31:d8:b4:60:27:3a:b9:64:9f:3b:c0:6d:ee'], // TODO
            tags: server.tags,
            user_data: null,
            volumes: null,
        };
    }

    protected wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

}
