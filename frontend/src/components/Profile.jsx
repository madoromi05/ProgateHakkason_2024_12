import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './Profile.css';
import JapanMap from './JapanMap';


function Profile() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user.username}/photos`);
          setPosts(response.data);
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