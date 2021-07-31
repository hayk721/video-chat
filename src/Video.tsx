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
function VideoContainer({streams}: { streams:{ stream: MediaStream, name: string }[] }) {
    return (<div className="videosContainer">
            {streams.map((s, i) => <Video key={s.name} name={s.name} stream={s.stream}/>)}
        </div>)
}

export default React.memo(VideoContainer)