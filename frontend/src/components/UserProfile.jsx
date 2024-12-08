import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Profile.css';
import 'leaflet/dist/leaflet.css';

function UserProfile() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const defaultIcon = "https://via.placeholder.com/150";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${username}`);
        setProfileData(response.data);
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src={profileData?.profileIconUrl || defaultIcon}
          alt="プロフィール画像" 
          className="profile-image" 
        />
        <div className="profile-info">
          <h2>{username}</h2>
          <div className="profile-stats">
            <span><strong>投稿</strong> {posts.length}</span>
            <span><strong>フォロワー</strong> 0</span>
            <span><strong>フォロー中</strong> 0</span>
          </div>
          <div className="profile-bio">
            <p>{profileData?.profileComment || 'プロフィールコメントはありません。'}</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h3>投稿</h3>
        </div>
        <div className="posts-grid">
          {posts.map((post) => (
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