import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import { FaMapMarkerAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import axios from 'axios';
import './UserProfile.css';
import 'leaflet/dist/leaflet.css';

function UserProfile() {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${username}/photos`);
                const sortedPosts = response.data.sort((a, b) => 
                    (b.timestamp || 0) - (a.timestamp || 0)
                );
                setPosts(sortedPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserPosts();
        }
    }, [username]);

    const recentPosts = posts.slice(0, 3);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    if (loading) {
        return <div className="loading">読み込み中...</div>;
    }

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <img 
                    src="https://via.placeholder.com/150" 
                    alt={`${username} profile`} 
                    className="profile-image" 
                />
                <div className="profile-info">
                    <div className="profile-header-top">
                        <h2>{username}</h2>
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
                        <span><strong>投稿</strong> {posts.length}</span>
                        <span><strong>フォロワー</strong> 100</span>
                        <span><strong>フォロー</strong> 150</span>
                    </div>
                    <div className="profile-bio">
                        <p>写真を撮るのが好きです</p>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <div className="section-header">
                    <h3>最近の投稿</h3>
                    {posts.length > 3 && (
                        <Link 
                            to={`/posts/${username}`} 
                            className="view-all-button"
                        >
                            すべて見る
                        </Link>
                    )}
                </div>
                <div className="posts-grid">
                    {recentPosts.map((post) => (
                        <div key={post.photoId} className="post">
                            <img 
                                src={post.imageUrl} 
                                alt={post.description}
                                onError={(e) => {
                                    console.error('Image load error:', e);
                                    e.target.src = 'https://via.placeholder.com/300';
                                }}
                            />
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
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;