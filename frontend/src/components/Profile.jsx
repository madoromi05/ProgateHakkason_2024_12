import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Profile.css';
import 'leaflet/dist/leaflet.css';

function Profile() {
    const [posts] = useState([
        {
            id: 1,
            imageUrl: 'https://www.cubeinc.co.jp/wp/wp-content/uploads/2020/05/koheimatsushita20220922-2.jpg',
            location: '東京都',
            description: '東京の風景',
            date: '2024-01-20',
            coordinates: [35.6895, 139.6917]
        },
        {
            id: 2,
            imageUrl: 'https://fc.niziu.com/files/4/n120/public/assets/images/page/1st_anniversary/kuji/kuji_item01.jpg',
            location: '大阪府',
            description: '大阪の夜景',
            date: '2024-01-19',
            coordinates: [34.6937, 135.5023]
        },
        {
            id: 3,
            imageUrl: 'https://via.placeholder.com/300',
            location: '北海道',
            description: '北海道の自然',
            date: '2024-01-18',
            coordinates: [43.0667, 141.3500]
        }
    ]);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img 
                    src="https://ogre.natalie.mu/artist/48196/20230705/tanakakei_art202306.jpg?imwidth=640&imdensity=1" 
                    alt="プロフィール画像" 
                    className="profile-image" 
                />
                <div className="profile-info">
                    <h2>shoma_0710</h2>
                    <div className="profile-stats">
                        <span><strong>投稿</strong> {posts.length}</span>
                        <span><strong>フォロワー</strong> 100</span>
                        <span><strong>フォロー中</strong> 150</span>
                    </div>
                    <div className="profile-bio">
                        <p>翔眞です。よろしくお願いします。</p>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <div className="section-header">
                    <h3>最近の投稿</h3>
                    <Link to="/posts" className="view-all-link">すべて見る</Link>
                </div>
                <div className="posts-grid">
                    {posts.slice(0, 3).map((post) => (
                        <div key={post.id} className="post">
                            <img src={post.imageUrl} alt={post.description} />
                            <div className="post-overlay">
                                <div className="post-info">
                                    <p className="post-location">
                                        <FaMapMarkerAlt /> {post.location}
                                    </p>
                                    <p className="post-description">{post.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="profile-section">
                <div className="section-header">
                    <h3>撮影場所</h3>
                </div>
                <div className="map-container">
                    <MapContainer 
                        center={[36.2048, 138.2529]} 
                        zoom={5} 
                        style={{ height: '400px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {posts.map((post) => (
                            <Marker key={post.id} position={post.coordinates}>
                                <Popup>
                                    <div className="popup-content">
                                        <img 
                                            src={post.imageUrl} 
                                            alt={post.description} 
                                            className="popup-image"
                                        />
                                        <p className="popup-location">{post.location}</p>
                                        <p className="popup-description">{post.description}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Profile;