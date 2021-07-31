import React, {useEffect, useRef} from "react";

function Video({name, stream}: { name: string, stream:MediaStream}) {
    const video = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        video.current && (video.current.srcObject = stream);
    })
    return (<div>
        <p>{name}</p>
        <video ref={video}  autoPlay={true}/>
    </div>)
}

export default Video