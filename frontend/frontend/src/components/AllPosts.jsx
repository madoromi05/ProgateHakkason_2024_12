import React, { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './AllPosts.css';

function AllPosts() {
    const [posts] = useState([
        {
            id: 1,
            imageUrl: 'https://via.placeholder.com/300',
            location: '東京都',
            description: '東京の風景',
            date: '2024-01-20',
            coordinates: [35.6895, 139.6917]
        },
        {
            id: 2,
            imageUrl: 'https://via.placeholder.com/300',
            location: '大阪府',
            description: '大阪の夜景',
            date: '2024-01-19',
            coordinates: [34.6937, 135.5023]
        },
        {
            id: 3,
            imageUrl: 'https://via.placeholder.com/300',
            location: '北海道',
            description: '北海道の自然',
            date: '2024-01-18',
            coordinates: [43.0667, 141.3500]
        },
        // 必要に応じて投稿を追加
    ]);

    return (
        <div className="all-posts-container">
            <h2>全ての投稿</h2>
            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <img src={post.imageUrl} alt={post.description} />
                        <div className="post-overlay">
                            <div className="post-info">
                                <p className="post-location">
                                    <FaMapMarkerAlt /> {post.location}
                                </p>
                                <p className="post-description">{post.description}</p>
                                <p className="post-date">{post.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllPosts;