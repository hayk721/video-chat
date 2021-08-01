import React, {useEffect, useRef, useState} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// @ts-ignore
import {MainContainer, ChatContainer,Search,ConversationList, Sidebar,Conversation,Avatar, VoiceCallButton, VideoCallButton, ConversationHeader, MessageList, Message, MessageInput} from '@chatscope/chat-ui-kit-react';
import './App.css';
import VideoService, { Room } from './video-service'
import VideoContainer from "./Video";
(window as any).xx = VideoService
function App() {
    const [streams, setStreams] = useState<{ stream:MediaStream, name:string }[]>([])
    const [peers, setPears] = useState<Room[]>([])
    const [peerId, setPeerId] = useState('')
    const [destPeerId, setDestPeerId] = useState('')
    const [messages, setMessages] = useState<{ message: string, sendTime: string, sender: string, direction: 'incoming' | 'outgoing' }[]>([])
    const [message, setMessage] = useState('bp')
    let msg: string = '';
    const vs = useRef(VideoService);
    useEffect(() => {
        console.log('rerendered')
        VideoService.receiveStream = receiveStream;
        VideoService.receiveData = receiveMessage;
        VideoService.newPeer = newPeer;
        VideoService.peerDeleted = peerDeleted;
        VideoService.onRegister = id => setPeerId(id);
    }, [])


    /**
     *
     */
    const connectToPeer = async () => {
        try {
            await vs.current.startDataConnection(destPeerId)
        } catch (e) {
            console.log(e);
        }

    }
    /**
     *
     */
    const call = async () => {
        try {
            await vs.current.startMediaConnection(destPeerId)
        } catch (e) {
            console.log(e);
        }

    }
    /**
     *
     */
    const newPeer = ($pear: Room[]) => {
        setPears([...$pear])
    }
    /**
     *
     */
    const peerDeleted = (id: string) => {
        setPears(peers => {
            const index = peers.findIndex((p) => p.id === id)
            peers.splice(index, 1)
            return [...peers]
        })
    }
    /**
     *
     */
    const receiveStream = (id: string, stream: MediaStream) => {


        console.log(id,'receiveStream88888888888888888888',streams);
        setStreams(st => {
            const s = st.find((s) => s.name === id)
            s ? (s.stream = stream) : st.push({stream, name: id})
            return [...st]
        })

    }
    /**
     *
     */
    const sendMessage = () => {
        vs.current.sendData(destPeerId, msg)
        setMessages(m => [...m, {
            message: msg,
            sendTime: '09:56',
            sender: peerId,
            direction: 'outgoing',
            position: "single"
        }])


    }
    /**
     *
     */
    const receiveMessage = (id: string, message: string) => {
        setDestPeerId(id)
        setMessages(m => [...m, {
            message: message,
            sendTime: '09:56',
            sender: id,
            direction: 'incoming',
            position: "single"
        }])

    }
    return (
        <div className="App">
            <div style={{position: "absolute", top: 0, left:0, width:'100%', height:'100%'}}>
                <MainContainer>
                   {/* <Sidebar position="left" scrollable={false}>
                        <Search placeholder="Search..." />
                        <ConversationList>
                            <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                                <Avatar src={'lillyIco'} name="Lilly" status="available" />
                            </Conversation>

                            <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                                <Avatar src={'joeIco'} name="Joe" status="dnd" />
                            </Conversation>

                            <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
                                <Avatar src={'emilyIco'} name="Emily" status="available" />
                            </Conversation>

                            <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
                                <Avatar src={'kaiIco'} name="Kai" status="unavailable" />
                            </Conversation>

                            <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
                                <Avatar src={'akaneIco'} name="Akane" status="eager" />
                            </Conversation>

                            <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
                                <Avatar src={'eliotIco'} name="Eliot" status="away" />
                            </Conversation>

                            <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you" active>
                                <Avatar src={'zoeIco'} name="Zoe" status="dnd" />
                            </Conversation>

                            <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
                                <Avatar src={'patrikIco'} name="Patrik" status="invisible" />
                            </Conversation>

                        </ConversationList>
                    </Sidebar>*/}
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        <Avatar src={'https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg'} name="Emily" />
                        <ConversationHeader.Content userName="Emily" info="Active 10 mins ago" >
                            <p>peer id: {peerId}</p>
                            <div>

                                <input type="text" onChange={(e) => setDestPeerId(e.target.value)}/>
                                <button onClick={connectToPeer}> call</button>
                            </div>
                        </ConversationHeader.Content>
                        <ConversationHeader.Actions>
                            <VoiceCallButton title="Start voice call" onClick={call}/>
                            <VideoCallButton title="Start video call" />
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <VideoContainer peers={peers} toggleCamera={vs.current.toggleCamera} toggleAudio={vs.current.toggleAudio}>
                        <p></p>
                    </VideoContainer>
                    <ChatContainer>

                        <MessageList>
                            {messages.map((m, index) => <Message key={index} model={m}>
                                <Message.Footer sender="Emily" sentTime="just now" />
                                <Avatar src={'https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg'} name="Akane" />
                            </Message>)}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onChange={(e: string) =>( msg = e)}
                                      onSend={sendMessage}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default App;
