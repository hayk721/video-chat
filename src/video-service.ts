import Peer from 'peerjs'

interface Room {
    id: string;
    dataConnection?: Peer.DataConnection;
    mediaConnection?: Peer.MediaConnection;
    mediaStream?: MediaStream;
}

class VideoService {
    private peerId?: string;
    private rooms: Room[] = [];
    private readonly peer: Peer;

    constructor() {
        this.peer = new Peer(undefined, {
            debug: 0
        })
        this.initPeer();
    }

    initPeer() {
        this.peer.on('open', (id) => {
            this.peerId = id;
            this.peer.on('connection', this.initDataConnection.bind(this));
            this.peer.on('call', this.initMediaConnection.bind(this));
            this.onRegister(id);
        });
    }

    private initDataConnection(conn: Peer.DataConnection){
        conn.on('data', (data: any) => this.receiveData(conn.peer, data));
        console.log(this, '888888888888888888')
        const room = this.rooms.find(r => r.id === conn.peer)
        room ? room.dataConnection = conn : this.rooms.push({id: conn.peer, dataConnection:conn})
    }

    private async initMediaConnection(mediaConnection: Peer.MediaConnection, initiator= false){
        try {
            mediaConnection.on('close', () => {
                console.log('connection closed: ' + mediaConnection.peer);
            })
            let room: Room | undefined = this.rooms.find(r => r.id === mediaConnection.peer)
            if(room){
                room.mediaConnection = mediaConnection
            }else{
               room = { id:mediaConnection.peer, mediaConnection }
               this.rooms.push(room)
            }
            mediaConnection.on('stream', (stream) => {
                if(room){
                    room.mediaStream = stream ;
                    this.receiveStream(room.id, room.mediaStream)
                }
            });

            if(!initiator){
                const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
                mediaConnection.answer(mediaStream);
            }
            return
        } catch (e) {
            console.log(e);
        }
    }

    startDataConnection(destPeerId: string) {
        console.log('trying to connect with peer: ' + destPeerId);
        if (destPeerId) {
            const dataConnection = this.peer.connect(destPeerId)
            dataConnection.on('open', () => this.initDataConnection(dataConnection))
        }

    }
    async startMediaConnection(destPeerId: string){
        if(destPeerId){
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
                const mediaConnection = this.peer.call(destPeerId, mediaStream);
                await this.initMediaConnection(mediaConnection, true)
            }catch (e) {
                console.log(e);
            }

        }

    }
    readonly sendData = (id: string, data: any) => {
       const room = this.rooms.find(r => r.id === id)
        room && (room.dataConnection?.send(data))
    }
    receiveData = (id: string, data: any) => {

    }
    receiveStream = (id: string, stream: MediaStream) => {
        //video.current && (video.current.srcObject = stream);
    }

    onRegister = (id: string) => {

    }
}

export default new VideoService()