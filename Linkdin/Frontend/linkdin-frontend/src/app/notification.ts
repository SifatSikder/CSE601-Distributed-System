export class Notification {

    constructor(
        public _id: string = '',
        public receiverID: string = '',
        public postOwnerName: string = '',
        public postID: string = '',
        public status: string = '',
    ) { }
}
