import React, {useEffect, useRef, useState} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// @ts-ignore
import {MainContainer, ChatContainer, Avatar, VoiceCallButton, VideoCallButton, ConversationHeader, MessageList, Message, MessageInput} from '@chatscope/chat-ui-kit-react';
import './App.css';
import VideoService from './video-service'
import Video from "./Video";

function App() {
    const [streams, setStreams] = useState<{ stream:MediaStream, name:string }[]>([])
    const [peerId, setPeerId] = useState('')
    const [destPeerId, setDestPeerId] = useState('')
    const [messages, setMessages] = useState<{ message: string, sendTime: string, sender: string, direction: 'incoming' | 'outgoing' }[]>([])
    const [message, setMessage] = useState('bp')
    const vs = useRef(VideoService);
    useEffect(() => {
        console.log('rerendered')
        VideoService.receiveStream = receiveStream;
        VideoService.receiveData = receiveMessage;
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
        vs.current.sendData(destPeerId, message)
        setMessages(m => [...m, {
            message: message,
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
            <div className="videosContainer">
                {streams.map((s, i) => <Video key={s.name} name={s.name} stream={s.stream}/>)}
            </div>
            <div style={{position: "absolute", top: 0, left:0, width:'100%', height:'100%'}}>
                <MainContainer>

                    <ChatContainer>
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
                        <MessageList>
                            {messages.map((m, index) => <Message key={index} model={m}/>)}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onChange={(e: React.SetStateAction<string>) => setMessage(e)}
                                      onSend={sendMessage}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default App;
