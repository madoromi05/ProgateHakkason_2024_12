import React from 'react';
import './timeline.css';

function Timeline() {
  return (
    <div className="timeline-container">
      <div className="timeline-item">
        {/* アイコンとユーザーネーム */}
        <div className="user-info">
          <div className="user-icon">〇</div>
          <div className="user-name">ユーザーネーム</div>
        </div>
        
        {/* 写真の空欄 */}
        <div className="photo-placeholder">
          写真がここに入ります
        </div>
        
        {/* いいねマーク */}
        <div className="like-section">
          <span className="like-icon">👍</span> いいね
        </div>
      </div>
    </div>
  );
}

export default Timeline;
