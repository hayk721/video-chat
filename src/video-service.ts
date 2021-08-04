import Peer from 'peerjs'

export interface Room {
    id: string;
    dataConnection?: Peer.DataConnection;
    mediaConnection?: Peer.MediaConnection;
    mediaStream?: MediaStream;
    myMediaStream?: MediaStream;

}

class VideoService {
    private peerId!: string;
    private rooms: Room[] = [];
    private readonly peer: Peer;

    constructor() {
        this.peer = new Peer(undefined, {
           /* host: 'localhost',
            port: 9000,
            path: '/myapp',*/
            debug: 2
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
        this.peer.on('disconnected',  () =>{
            console.log('Connection lost. Please reconnect');
            // Workaround for peer.reconnect deleting previous id
            this.peer.id = this.peerId;
            this.peer.reconnect();
        });
        this.peer.on('close', function() {
            console.log('Connection destroyed');
        });
        this.peer.on('error', function (err) {
            console.log(err);
        });
    }

    private initDataConnection(conn: Peer.DataConnection){


        conn.on('data', (data: any) => this.receiveData(conn.peer, data));
        const room = this.rooms.find(r => r.id === conn.peer)
        if(room){
            room.dataConnection = conn
        }else{
            this.rooms.push({id: conn.peer, dataConnection:conn})
            this.newPeer(this.rooms)
        }
        conn.on('error', (e) => {
            console.log('connection error: ' + conn.peer, e);
        })
        conn.on('close', () => {
            console.log('data connection closed: ' + conn.peer);
            const room = this.rooms.find(r => r.id === conn.peer)
            if(room){
                room.mediaConnection?.close()
                console.log('media connection closed: ' + conn.peer);
                this.peerDeleted(room.id)
                this.rooms.splice(this.rooms.indexOf(room), 1)

            }
        })
    }

    private async initMediaConnection(mediaConnection: Peer.MediaConnection, myMediaStream?: MediaStream, initiator= false){
        try {
            mediaConnection.on('close', () => {
                console.log('connection closed: ' + mediaConnection.peer);
            })
            mediaConnection.on('error', (e) => {
                console.log('connection error: ' + mediaConnection.peer, e);
            })
            if(!myMediaStream){
                myMediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
            }
            let room: Room | undefined = this.rooms.find(r => r.id === mediaConnection.peer)
            if(room){
                room.mediaConnection = mediaConnection
                room.myMediaStream = myMediaStream
            }else{
               room = { id:mediaConnection.peer, mediaConnection, myMediaStream }
               this.rooms.push(room)
               this.newPeer(this.rooms)
            }
            mediaConnection.on('stream', (stream) => {
                if(room){
                    room.mediaStream = stream ;
                    this.receiveStream(room.id, room.mediaStream)
                }
            });

            if(!initiator){

                mediaConnection.answer(myMediaStream);
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
                const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
                const mediaConnection = this.peer.call(destPeerId, mediaStream);
                this.startDataConnection(destPeerId);
                await this.initMediaConnection(mediaConnection, mediaStream, true)

            }catch (e) {
                console.log(e);
            }

        }

    }
    readonly sendData = (id: string, data: any) => {
       const room = this.rooms.find(r => r.id === id)
        if (room && room.dataConnection && room.dataConnection.open) {
            room.dataConnection?.send(data)
        }else {
            console.log('Connection is closed');
        }
    }
    toggleCamera = (id: string) => {
        const room = this.rooms.find(r => r.id === id)
        if(room && room.myMediaStream?.active)
            return room.myMediaStream.getVideoTracks().map(t => t.enabled = !t.enabled).every(v => v)
    }
    toggleAudio = (id: string) => {
        const room = this.rooms.find(r => r.id === id)
        if(room && room.myMediaStream?.active)
            return room.myMediaStream.getAudioTracks().map(t => t.enabled = !t.enabled).every(v => v)
    }
    receiveData = (id: string, data: any) => {

    }
    receiveStream = (id: string, stream: MediaStream) => {
        //video.current && (video.current.srcObject = stream);
    }
    newPeer = (peer: Room[]) => {
        //video.current && (video.current.srcObject = stream);
    }
    peerDeleted = (id: string) => {
        //video.current && (video.current.srcObject = stream);
    }

    onRegister = (id: string) => {

    }
}

export default new VideoService()