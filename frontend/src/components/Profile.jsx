import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { MapContainer, TileLayer } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Profile.css';
import JapanMap from './JapanMap';


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
                    src="https://via.placeholder.com/150" 
                    alt="プロフィール画像" 
                    className="profile-image" 
                />
                <div className="profile-info">
                    <h2>UserName</h2>
                    <div className="profile-stats">
                        <span><strong>投稿</strong> {posts.length}</span>
                        <span><strong>フォロワー</strong> 100</span>
                        <span><strong>フォロー中</strong> 150</span>
                    </div>
                    <div className="profile-bio">
                        <p>Profile-bio</p>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <div className="section-header">
                    <h3>最近の投稿</h3>
                    <Link to="/posts" className="view-all-link">すべて見る</Link>
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
                    {recentPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="post">
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
                            console.log(`選択された都道府県: ${prefName}`);
                        }}
                    />
                        
                      
                </div>
            </div>
        </div>
    );
}

export default Profile;