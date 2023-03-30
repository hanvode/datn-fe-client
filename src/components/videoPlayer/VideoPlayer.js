import { useEffect, useRef } from "react";

const VideoPlayer = ({ id, publicId, ...props }) => {
  const videoRef = useRef();
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  // Store the Cloudinary window instance to a ref when the page renders

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = window.cloudinary;

    playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "dnykvbriw",
      secure: true,
    });
  }, []);

  return (
    <div
      style={{ width:  `${props.width}`, height: ` ${props.height}` }}
    >
      <video
        ref={videoRef}
        id={id}
        className="cld-video-player cld-fluid"
        controls
      //   autoPlay
        data-cld-public-id={publicId}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;
