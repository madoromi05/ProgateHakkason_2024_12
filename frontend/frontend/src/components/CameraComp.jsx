import React, { useRef, useEffect, useState } from 'react';
import { FaSync, FaTimes } from 'react-icons/fa';
import './CameraComp.css';

const CameraComp = ({ onPhotoCapture, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startCamera = async () => {
        try {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: isFrontCamera ? 'user' : 'environment',
                    width: { ideal: dimensions.width },
                    height: { ideal: dimensions.height }
                },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play()
                        .then(() => setIsStreaming(true));
                };
            }
        } catch (err) {
            console.error('カメラの起動に失敗:', err);
            setError('カメラの起動に失敗しました');
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isFrontCamera]);

    const switchCamera = () => {
        setIsFrontCamera(!isFrontCamera);
    };

    const capturePhoto = () => {
        if (!isStreaming || !videoRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const context = canvas.getContext('2d');

        const videoAspect = video.videoWidth / video.videoHeight;
        const screenAspect = dimensions.width / dimensions.height;

        let drawWidth = dimensions.width;
        let drawHeight = dimensions.height;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspect > screenAspect) {
            drawWidth = dimensions.height * videoAspect;
            offsetX = -(drawWidth - dimensions.width) / 2;
        } else {
            drawHeight = dimensions.width / videoAspect;
            offsetY = -(drawHeight - dimensions.height) / 2;
        }

        if (isFrontCamera) {
            context.scale(-1, 1);
            context.translate(-dimensions.width, 0);
        }
        
        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        canvas.toBlob((blob) => {
            if (onPhotoCapture && blob) {
                onPhotoCapture(blob);
            }
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="camera-container">
            <div className="camera-preview-wrapper">
                <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline
                    className={`camera-preview ${isFrontCamera ? 'mirror' : ''}`}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {error ? (
                <div className="camera-error">
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    <div className="camera-top-controls">
                        <button 
                            onClick={onCancel}
                            className="control-button cancel-button"
                            aria-label="キャンセル"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="camera-controls">
                        <button 
                            onClick={switchCamera}
                            className="control-button switch-camera-button"
                            disabled={!isStreaming}
                            aria-label="カメラ切り替え"
                        >
                            <FaSync />
                        </button>
                        <button 
                            onClick={capturePhoto}
                            className="capture-button"
                            disabled={!isStreaming}
                            aria-label="撮影"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CameraComp;