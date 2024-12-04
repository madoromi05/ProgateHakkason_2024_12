import React from 'react';
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
            <span className="like-icon">👍</span> {item.likes} いいね
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
