import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './timeline.css';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaClock, FaSync } from 'react-icons/fa';
import axios from 'axios';

function Timeline() {
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const postDate = new Date(parseInt(timestamp));
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}時間前`;
    } else {
      return postDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/photos');
      const now = new Date();
      const oneDayAgo = now.getTime() - (24 * 60 * 60 * 1000);

      const recentPhotos = response.data.filter(photo => {
        const photoDate = new Date(parseInt(photo.timestamp));
        return photoDate.getTime() > oneDayAgo;
      });

      const sortedPhotos = recentPhotos.sort((a, b) => 
        (b.timestamp || 0) - (a.timestamp || 0)
      );

      console.log('Fetched recent photos:', sortedPhotos);
      setPhotos(sortedPhotos);
      setLikes(sortedPhotos.map(photo => ({
        count: 0,
        isLiked: false
      })));
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
  };

  const handleLike = (index) => {
    setLikes(prevLikes => {
      const newLikes = [...prevLikes];
      newLikes[index] = {
        count: newLikes[index].count + (newLikes[index].isLiked ? -1 : 1),
        isLiked: !newLikes[index].isLiked
      };
      return newLikes;
    });
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>タイムライン</h2>
        <button 
          className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSync className="refresh-icon" />
          {refreshing ? '更新中...' : '更新'}
        </button>
      </div>
      {photos.length === 0 ? (
        <p className="no-posts">24時間以内の投稿はありません</p>
      ) : (
        photos.map((photo, index) => (
          <div key={photo.photoId} className="post-card">
            <div className="post-header">
              <div className="user-info">
                <img src="https://via.placeholder.com/40" alt={`${photo.userId}のアイコン`} className="user-icon" />
                <Link to={`/user/${photo.userId}`} className="username-link">
                  {photo.userId}
                </Link>
              </div>
              <span className="timestamp">
                <FaClock className="clock-icon" /> {formatDate(photo.timestamp)}
              </span>
            </div>
            
            <div className="post-image">
              <img src={photo.imageUrl} alt={photo.description} />
            </div>
            
            <div className="post-content">
              <div className="post-info">
                <div className="location">
                  <FaMapMarkerAlt /> {photo.location}
                </div>
                <div className="like-section">
                  <button
                    className={`like-button ${likes[index].isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(index)}
                  >
                    {likes[index].isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{likes[index].count}</span>
                  </button>
                </div>
              </div>
              <p className="description">{photo.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Timeline;
