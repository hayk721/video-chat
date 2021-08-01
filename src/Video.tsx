import React, {useEffect, useRef, useState} from "react";
import micOn from './assets/mic-on.svg'
import camOn from './assets/cam-on.svg'
import callOn from './assets/call-on.svg'
import micOff from './assets/mic-off.svg'
import camOff from './assets/cam-off.svg'
import callOff from './assets/call-off.svg'
import call from './assets/phone.png'
import {Room} from "./video-service";
function Video({name, stream, myStream, toggleCamera, toggleAudio}: {
    name: string,
    stream?:MediaStream;
    myStream?:MediaStream;
    toggleCamera: (id:string) => boolean | undefined;
    toggleAudio: (id:string) => boolean | undefined;
}) {
    const video = useRef<HTMLVideoElement>(null);
    const myVideo = useRef<HTMLVideoElement>(null);
    const [sound, setSound] = useState<boolean | undefined>(true)
    const [camera, setCamera] = useState<boolean | undefined>(true)
    useEffect(() => {
        video.current && stream && (video.current.srcObject = stream);
        myVideo.current && myStream && (myVideo.current.srcObject = myStream);
    })
    const toggleSound = () => {
        toggleAudio(name)
        setSound(!sound)
    }
    const toggleVideo = () => {
        toggleCamera(name)
        setCamera(!camera)
    }

    return (<div className="videoWrapper">

        <div className="header-btns">
            {/*<p>{name}</p>*/}
            <div className="avatar-block blur-block">
                <img src={'https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg'}  alt=""/>
                <div>
                    <p>Patient</p>
                    <p>Alice Teylor</p>
                </div>
            </div>
            <div className="blur-block timer">
                <span>13:09</span>
            </div>
            <div className="peers-block">
                <video className="peer" ref={myVideo}  autoPlay={true}/>
            </div>

        </div>
        <video ref={video}  autoPlay={true}>

        </video>
        <div className="control-btns">
            <button className={"control-btn blur-block" + (sound ? '' : ' off')} onClick={toggleSound}>
                <img src={sound ? micOn : micOff} alt=""/>
            </button>
            <button className={"control-btn blur-block deny"}>
                <img src={callOn} alt=""/>
            </button>
            <button className={'control-btn blur-block' + (camera ? '' : ' off')}  onClick={toggleVideo}>
                <img src={camera ? camOn : camOff} alt=""/>
            </button>
        </div>
    </div>)
}
interface VideoContainerProps{
 peers: Room[],
 toggleCamera: (id:string) => boolean | undefined;
 toggleAudio: (id:string) => boolean | undefined;
 children?:JSX.Element;
}
const MVideo = React.memo(Video)
function VideoContainer({peers, toggleCamera, toggleAudio, children}: VideoContainerProps) {
    return (<div className="videosBlock">
        {/*{children}*/}
        <div className="videosContainer" >
            {peers.map((s, i) => <Video key={s.id} name={s.id} stream={s.mediaStream} myStream={s.myMediaStream}  toggleCamera={toggleCamera} toggleAudio={toggleAudio}/> ) }
        </div>
        <div><p>hello</p></div>
       </div>)
}
export default React.memo(VideoContainer)
//
//     if(prevProps.peers[0] && nextProps.peers[0] && prevProps.peers[0].mediaConnection && nextProps.peers[0].mediaConnection){
//         return prevProps.peers[0].mediaConnection.open === nextProps.peers[0].mediaConnection.open
//     }
//     return false
// })