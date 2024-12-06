import React, { useState } from 'react';
<<<<<<< HEAD
import './timeline.css';

// ダミーデータの定義
const dummyData = [
  {
    icon: 'https://via.placeholder.com/40', // ダミーアイコン
    username: '1',
    photo: 'https://via.placeholder.com/300', // 投稿写真
    likes: 10
  },
  {
    icon: 'https://via.placeholder.com/40',
    username: '2',
    photo: 'https://via.placeholder.com/300', // 写真がない場合
    likes: 5
  },
  {
    icon: 'https://via.placeholder.com/40',
    username: '3',
    photo: 'https://via.placeholder.com/300',
    likes: 20
  }
];

function Timeline() {
  // 状態を保持するための useState
  const [likes, setLikes] = useState(
    dummyData.map((item) => ({
      isLiked: false, // 初期状態はいいねされていない
      count: item.likes
    }))
  );

  // いいねボタンを押したときの処理
  const handleLike = (index) => {
    setLikes((prevLikes) =>
      prevLikes.map((like, i) =>
        i === index
          ? {
              isLiked: !like.isLiked, // いいね状態を反転
              count: like.isLiked ? like.count - 1 : like.count + 1 // カウントの増減
            }
          : like
      )
    );
=======
import { Link } from 'react-router-dom';
import './timeline.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Timeline() {
  const dummyData = [
    {
      id: 1,
      icon: 'https://via.placeholder.com/40',
      username: 'user1',
      photo: 'https://www.cubeinc.co.jp/wp/wp-content/uploads/2020/05/koheimatsushita20220922-2.jpg',
      likes: 10,
      description: '東京の風景です。',
      timestamp: '2024-01-15T12:00:00'
    },
    {
      id: 2,
      icon: 'https://via.placeholder.com/40',
      username: 'user2',
      photo: 'https://fc.niziu.com/files/4/n120/public/assets/images/page/1st_anniversary/kuji/kuji_item01.jpg',
      likes: 5,
      description: '大阪の夜景です。',
      timestamp: '2024-01-15T13:30:00'
    },
    {
      id: 3,
      icon: 'https://via.placeholder.com/40',
      username: 'user3',
      photo: 'https://via.placeholder.com/300',
      likes: 20,
      description: '北海道の自然です。',
      timestamp: '2024-01-15T14:45:00'
    }
  ];

  const [likes, setLikes] = useState(
    dummyData.map(item => ({
      count: item.likes,
      isLiked: false
    }))
  );

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
>>>>>>> shoma_front
  };

  return (
    <div className="timeline-container">
<<<<<<< HEAD
      {dummyData.map((item, index) => (
        <div className="timeline-item" key={index}>
          {/* アイコンとユーザーネーム */}
          <div className="user-info">
            <div className="user-icon">
              <img src={item.icon} alt={`${item.username}`} />
            </div>
            <div className="user-name">{item.username}</div>
          </div>
          
          {/* 写真の空欄または画像 */}
          <div className="photo-placeholder">
            {item.photo ? (
              <img src={item.photo} alt={`${item.username}の投稿画像`} />
            ) : (
              "写真がここに入ります"
            )}
          </div>
          
          {/* いいねマーク */}
          <div className="like-section">
            <button
              className={`like-button ${likes[index].isLiked ? 'liked' : ''}`}
              onClick={() => handleLike(index)}
            >
              {likes[index].isLiked ? '❤️' : '🤍'} {likes[index].count} いいね
            </button>
=======
      <h2>タイムライン</h2>
      {dummyData.map((item, index) => (
        <div key={item.id} className="post-card">
          <div className="post-header">
            <div className="user-info">
              <img src={item.icon} alt={`${item.username}のアイコン`} className="user-icon" />
              <Link to={`/user/${item.username}`} className="username-link">
                {item.username}
              </Link>
            </div>
            <span className="timestamp">{formatDate(item.timestamp)}</span>
          </div>
          
          <div className="post-image">
            <img src={item.photo} alt={`${item.username}の投稿`} />
          </div>
          
          <div className="post-content">
            <div className="like-section">
              <button
                className={`like-button ${likes[index].isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(index)}
              >
                {likes[index].isLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{likes[index].count}</span>
              </button>
            </div>
            <p className="description">{item.description}</p>
>>>>>>> shoma_front
          </div>
        </div>
      ))}
    </div>
  );
}

<<<<<<< HEAD
export default Timeline;
=======
export default Timeline;
>>>>>>> shoma_front
