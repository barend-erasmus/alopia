export class Server {

    constructor(
        public flavor: string,
        public image: string,
        public ipAddress: string,
        public meta: any,
        public name: string,
        public tags: string[],
    ) {

    }

}
