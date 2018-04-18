import { DigitalOceanCloudProvider } from './cloud-providers/digital-ocean';
import { AES256CTRCryptographyAlgorithm } from './cryptography-algorithms/aes-256-ctr';
import { ICloudProvider } from './interfaces/cloud-provider';
import { ICryptographyAlgorithm } from './interfaces/cryptography-algorithm';
import { Server } from './models/server';

const cryptographyAlgorithm: ICryptographyAlgorithm = new AES256CTRCryptographyAlgorithm('');

const digitalOceanAPIKeyEncrypted: string = 'eca2876ed0821c57fab18ba9ca19ab9fcdfd75b017dcf30552be5eb64adc9ff45dcc90839891937a8e6f3ac57affc33c533b565c4547bed9ff7b1c1bb03ee68b';

const cloudProvider: ICloudProvider = new DigitalOceanCloudProvider(cryptographyAlgorithm.decrypt(digitalOceanAPIKeyEncrypted), 'nyc1');

cloudProvider.createServer(new Server('s-1vcpu-1gb', 'ubuntu-17-10-x64', 'ip address', null, 'alopia', [
    'testing',
]));
