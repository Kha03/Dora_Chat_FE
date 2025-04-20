import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import peerService from "../../../utils/peerService";
import { SOCKET_EVENTS } from "../../../utils/constant";
import { socket } from "../../../utils/socketClient";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { endCall, endCall as endCallAction } from "../callSlice";
import { useNavigate } from "react-router-dom";

export default function AudioCallComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCall } = useSelector((state) => state.call);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const localAudioRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(0);

    const partner =
        currentCall.conversation?.members?.find((m) => m.userId !== user._id) || {};
    const partnerName = partner?.name || "Đang kết nối...";
    const partnerAvatar = partner?.avatar || "";

    const didInitRef = useRef(false);

    // AudioCallComponent.jsx
    useEffect(() => {
        const startCall = async () => {
            if (didInitRef.current) return;
            didInitRef.current = true;

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: { ideal: 44100 },
                    channelCount: { ideal: 1 },
                    echoCancellation: { ideal: true },
                    noiseSuppression: { ideal: true },
                    autoGainControl: { ideal: false },
                }
            });



            localAudioRef.current.srcObject = stream;

            // init peerService 1 lần với initiator đúng vai trò
            await peerService.init({
                userId: user._id,
                peerId: currentCall.peerId,            // uuid của bạn
                conversationId: currentCall.conversationId,
                stream,
                initiator: currentCall.initiator,
            });

            // lắng nghe remote stream
            peerService.onRemoteStream((stream) => {
                setRemoteStreams((prev) => ({ ...prev, remote: stream }));
                setIsConnecting(false);
            });
        };

        startCall();
        return () => {
            peerService.endCall();
        };
    }, []);


    useEffect(() => {
        const handleEnded = ({ userId }) => {
            console.log(`📴 Cuộc gọi đã kết thúc từ phía ${userId}`);
            peerService.endCall();
            dispatch(endCall());
            setTimeout(() => {
                navigate("/home");
            }, 300);
        };

        socket.on(SOCKET_EVENTS.CALL_ENDED, handleEnded);
        return () => socket.off(SOCKET_EVENTS.CALL_ENDED, handleEnded);
    }, []);


    const toggleMute = () => {
        const muted = peerService.toggleAudio();
        setIsMuted(muted);
    };

    // 2) Khi bất kỳ bên nào emit CALL_ENDED, cả hai đều endCall
    useEffect(() => {
        const onCallEnded = ({ conversationId }) => {
            if (conversationId !== currentCall?.conversationId) return;
            console.log("📞 Call ended by remote");
            handleEndCall();
        };
        socket.on(SOCKET_EVENTS.CALL_ENDED, onCallEnded);
        return () => {
            socket.off(SOCKET_EVENTS.CALL_ENDED, onCallEnded);
        };
    }, [currentCall]);

    // 3) Khi user nhấn nút kết thúc, endCall sạch sẽ và notify server qua peerService
    const handleEndCall = async () => {
        console.log("📞 Ending call...");
        // 3.1 dọn peer & media & socket listeners
        await peerService.endCall();

        // 3.2 reset các ref/state để lần sau startCall() có thể chạy lại
        didInitRef.current = false;
        if (localAudioRef.current) localAudioRef.current.srcObject = null;
        setRemoteStreams(null);
        setIsConnecting(true);

        // 3.3 reset redux
        dispatch(endCallAction());

        setTimeout(() => {
            navigate("/home");
        }, 300);
    };


    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white ">
            {isConnecting && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                        <Mic className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-white text-2xl font-semibold mb-2">
                        {partnerName}
                    </h2>
                    <p className="text-gray-300">Đang kết nối...</p>
                </div>
            )}

            {duration > 0 && (
                <div className="mt-4 text-sm text-gray-400">
                    ⏱️ Thời gian cuộc gọi: {Math.floor(duration / 60)} phút {duration % 60} giây
                </div>
            )}


            {/* Local Audio (muted) */}
            <audio ref={localAudioRef} autoPlay muted />

            {/* Remote Audio */}
            {Object.entries(remoteStreams).map(([id, stream]) => (
                <audio
                    key={id}
                    autoPlay
                    ref={(el) => {
                        if (el) el.srcObject = stream;
                    }}
                />
            ))}

            {/* UI Info  Controls */}
            <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-800 rounded-lg shadow-lg">
                <div className="w-24 h-24 rounded-full overflow-hidden ">
                    {partnerAvatar ? (
                        <img
                            src={partnerAvatar}
                            alt={partnerName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                                {partnerName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{partnerName}</h2>
                <p className="text-gray-400 mb-6">Cuộc gọi âm thanh</p>

                <div className="flex space-x-6 mt-4">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full ${isMuted ? "bg-red-500" : "bg-gray-700"}`}
                    >
                        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="p-4 rounded-full bg-red-600"
                    >
                        <PhoneOff className="h-6 w-6 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
