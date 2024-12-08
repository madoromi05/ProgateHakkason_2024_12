import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Profile.css';
import JapanMap from './JapanMap';

function UserProfile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${username}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${username}/photos`);
                const sortedPosts = response.data.sort((a, b) => 
                    (b.timestamp || 0) - (a.timestamp || 0)
                );
                setPosts(sortedPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserData();
        fetchUserPosts();
    }, [username]);

    const recentPosts = posts.slice(0, 3);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img 
                    src="https://via.placeholder.com/100" 
                    alt="プロフィール画像" 
                    className="profile-image" 
                />
                <div className="profile-info">
                    <h2>{userData?.username || username}</h2>
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-value">{posts.length}</span>
                            <span className="stat-label">投稿</span>
                        </div>
                        <span><strong>フォロワー</strong> 100</span>
                        <span><strong>フォロー中</strong> 150</span>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <div className="section-header">
                    <h3>最近の投稿</h3>
                    {posts.length > 3 && (
                        <Link 
                            to={`/user/${username}/posts`} 
                            className="view-all-button"
                        >
                            すべて見る
                        </Link>
                    )}
                </div>
                <div className="posts-grid">
                    {posts.slice(0, 3).map((post) => (
                        <div key={post.photoId} className="post">
                            <img src={post.imageUrl} alt={post.description} />
                            <div className="post-overlay">
                                <div className="post-info">
                                    <p className="post-location">
                                        <FaMapMarkerAlt /> {post.location}
                                    </p>
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
                    <JapanMap 
                        posts={posts}
                        onPrefectureClick={(prefecture) => {
                            console.log(`選択された都道府県: ${prefecture}`);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default UserProfile;