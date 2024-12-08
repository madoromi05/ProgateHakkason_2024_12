import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { MapContainer, TileLayer } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Profile.css';
import 'leaflet/dist/leaflet.css';

function Profile() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const defaultIcon = "https://via.placeholder.com/150";

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user.username}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const fetchUserPosts = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user.username}/photos`);
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
    }
  }, [user]);

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src={profileData?.profileIconUrl || defaultIcon}
          alt="プロフィール画像" 
          className="profile-image" 
        />
        <div className="profile-info">
          <h2>{user ? user.username : 'サンプルユーザー'}</h2>
          <div className="profile-stats">
            <span><strong>投稿</strong> {posts.length}</span>
            <span><strong>フォロワー</strong> {user ? 0 : 'N/A'}</span>
            <span><strong>フォロー中</strong> {user ? 0 : 'N/A'}</span>
          </div>
          <div className="profile-bio">
            <p>{profileData?.profileComment || 'プロフィールコメントはありません。'}</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h3>最近の投稿</h3>
          {user && posts.length > 3 && (
            <Link 
              to={`/posts/${user.username}`} 
              className="view-all-button"
            >
              すべて見る
            </Link>
          )}
        </div>
        <div className="posts-grid">
          {recentPosts.map((post) => (
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

export default Profile;