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

  useEffect(() => {
    if (user) {
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
      fetchUserPosts();
    } else {
      // サンプルデータを設定
      setPosts([
        {
          photoId: 'sample1',
          imageUrl: 'https://via.placeholder.com/300',
          location: 'Sample Location 1',
          description: 'Sample Description 1',
          latitude: 35.6895,
          longitude: 139.6917
        },
        {
          photoId: 'sample2',
          imageUrl: 'https://via.placeholder.com/300',
          location: 'Sample Location 2',
          description: 'Sample Description 2',
          latitude: 34.6937,
          longitude: 135.5023
        }
      ]);
    }
  }, [user]);

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src="https://ogre.natalie.mu/artist/48196/20230705/tanakakei_art202306.jpg" 
          alt="プロフィール画像" 
          className="profile-image" 
        />
        <div className="profile-info">
          <h2>{user ? user.username : 'サンプルユーザー'}</h2>
          <div className="profile-stats">
            <span><strong>投稿</strong> {posts.length}</span>
            <span><strong>フォロワー</strong> {user ? 100 : 'N/A'}</span>
            <span><strong>フォロー中</strong> {user ? 150 : 'N/A'}</span>
          </div>
          <div className="profile-bio">
            <p>{user ? '翔眞です。よろしくお願いします。' : 'これはサンプルユーザーのプロフィールです。'}</p>
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