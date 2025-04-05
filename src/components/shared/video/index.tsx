interface VideoOutletProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

const VideoOutlet: React.FC<VideoOutletProps> = ({
  src = "/assets/default-video.mp4",
  width = 35,
  height = 35,
  fill = false,
  className = "",
  autoPlay = false,
  controls = true,
  loop = false,
}) => {
  return (
    <video
      src={src}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      loop={loop}
      style={fill ? { width: "100%", height: "100%" } : {}}
    />
  );
};

export default VideoOutlet;
