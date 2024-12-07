import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './timeline.css';
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

function Timeline() {
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/photos');
        const sortedPhotos = response.data.sort((a, b) => 
          (b.timestamp || 0) - (a.timestamp || 0)
        );
        setPhotos(sortedPhotos);
        setLikes(sortedPhotos.map(photo => ({
          count: 0,
          isLiked: false
        })));
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
    
    // 1時間ごとに写真を再取得（署名付きURLの更新のため）
    const interval = setInterval(fetchPhotos, 3600000);
    
    return () => clearInterval(interval);
  }, []);

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="timeline-container">
      <h2>タイムライン</h2>
      {photos.map((photo, index) => (
        <div key={photo.photoId} className="post-card">
          <div className="post-header">
            <div className="user-info">
              <img src="https://via.placeholder.com/40" alt={`${photo.userId}のアイコン`} className="user-icon" />
              <Link to={`/user/${photo.userId}`} className="username-link">
                {photo.userId}
              </Link>
            </div>
            <span className="timestamp">{formatDate(photo.timestamp)}</span>
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
      ))}
    </div>
  );
}

export default Timeline;
