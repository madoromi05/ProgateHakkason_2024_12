import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import L from 'leaflet';
import './UserProfile.css';
import 'leaflet/dist/leaflet.css';

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function UserProfile() {
    const { username } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    
    const [userData] = useState({
        username: username,
        profileImage: 'https://via.placeholder.com/150',
        followers: 234,
        following: 156,
        bio: 'Photography enthusiast',
        posts: [
            {
                id: 1,
                imageUrl: 'https://via.placeholder.com/300',
                location: 'Tokyo',
                description: 'Tokyo Landscape',
                coordinates: [35.6895, 139.6917]
            },
            {
                id: 2,
                imageUrl: 'https://via.placeholder.com/300',
                location: 'Osaka',
                description: 'Osaka Night View',
                coordinates: [34.6937, 135.5023]
            }
        ]
    });

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <img 
                    src={userData.profileImage} 
                    alt={`${userData.username} profile`} 
                    className="profile-image" 
                />
                <div className="profile-info">
                    <div className="profile-header-top">
                        <h2>{userData.username}</h2>
                        <button 
                            className={`follow-button ${isFollowing ? 'following' : ''}`}
                            onClick={handleFollow}
                        >
                            {isFollowing ? (
                                <>
                                    <FaUserCheck /> フォロー中
                                </>
                            ) : (
                                <>
                                    <FaUserPlus /> フォロー
                                </>
                            )}
                        </button>
                    </div>
                    <div className="profile-stats">
                        <span><strong>投稿</strong> {userData.posts.length}</span>
                        <span><strong>フォロワー</strong> {userData.followers}</span>
                        <span><strong>フォロー</strong> {userData.following}</span>
                    </div>
                    <div className="profile-bio">
                        <p>{userData.bio}</p>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <h3>最近の投稿</h3>
                <div className="posts-grid">
                    {userData.posts.map((post) => (
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
                <h3>撮影場所</h3>
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
                        {userData.posts.map((post) => (
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

export default UserProfile;