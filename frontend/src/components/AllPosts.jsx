import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import './AllPosts.css';

function AllPosts() {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${username}/photos`);
                console.log('Fetched posts:', response.data); // デバッグ用
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserPosts();
        }
    }, [username]);

    if (loading) {
        return <div className="loading">読み込み中...</div>;
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return '日付なし';
        const date = new Date(timestamp);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="all-posts-container">
            <h2>{username}の投稿一覧</h2>
            <div className="posts-grid">
                {posts.map((post) => (
                    <div key={post.photoId} className="post">
                        <img 
                            src={post.imageUrl} 
                            alt={post.description}
                            onError={(e) => {
                                console.error('Image load error:', e);
                                e.target.src = 'https://via.placeholder.com/300';
                            }}
                        />
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
            {posts.length === 0 && (
                <p className="no-posts">投稿がありません</p>
            )}
        </div>
    );
}

export default AllPosts;