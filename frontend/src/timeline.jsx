import React, { useState } from 'react';
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
    photo: null, // 写真がない場合
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
  };

  return (
    <div className="timeline-container">
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
