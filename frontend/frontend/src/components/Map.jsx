import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ImageGallery from 'react-image-gallery';
import Modal from './Modal';
import './Map.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'leaflet/dist/leaflet.css';

// マーカーアイコンの画像をインポート
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leafletのデフォルトアイコンを再設定
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function MapSection({ prefecturePhotos = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);

    const openGalleryModal = (images) => {
        if (!images) {
            console.error('imagesが未定義です');
            return;
        }
        const galleryItems = images.map(img => ({
            original: img.url,
            thumbnail: img.url,
            description: img.description
        }));
        setGalleryImages(galleryItems);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setGalleryImages([]);
    };

    return (
        <div className="map-section">
            <h3>所在地</h3>
            <MapContainer center={[36.2048, 138.2529]} zoom={5} scrollWheelZoom={false} className="map-container">
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {prefecturePhotos.map(photo => (
                    <Marker key={photo.id} position={photo.position}>
                        <Popup>
                            <div className="popup-content">
                                <h4>{photo.prefecture}</h4>
                                <div className="popup-images">
                                    {photo.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="popup-image-container"
                                            onClick={() => openGalleryModal(photo.images)}
                                        >
                                            <img src={img.url} alt={img.description} className="popup-image" />
                                            <p>{img.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* 画像ギャラリーモーダル */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {galleryImages && galleryImages.length > 0 ? (
                    <ImageGallery 
                        items={galleryImages} 
                        showPlayButton={false} 
                        showFullscreenButton={false} 
                    />
                ) : (
                    <p>画像がありません。</p>
                )}
            </Modal>
        </div>
    );
}

export default MapSection;