import React, { useState } from 'react';
import './Profile.css';
import NewPost from './NewPost';
import MapSection from './Map';
import './Map.css';

// 初期の都道府県と写真データ
const prefecturePhotosInitial = [
    {
        id: 1,
        prefecture: '東京都',
        position: [35.6895, 139.6917],
        images: [
            {
                url: 'https://www.cubeinc.co.jp/wp/wp-content/uploads/2020/05/koheimatsushita20220922-2.jpg',
                description: '東京の風景'
            },
            {
                url: 'https://via.placeholder.com/300x200.png?text=東京2',
                description: '東京タワー'
            }
        ]
    },
    {
        id: 2,
        prefecture: '大阪府',
        position: [34.6937, 135.5023],
        images: [
            {
                url: 'https://fc.niziu.com/files/4/n120/public/assets/images/page/1st_anniversary/kuji/kuji_item01.jpg',
                description: '大阪の夜景'
            },
            {
                url: 'https://via.placeholder.com/300x200.png?text=大阪2',
                description: '大阪城'
            }
        ]
    },
    {
        id: 3,
        prefecture: '北海道',
        position: [43.0667, 141.3500],
        images: [
            {
                url: 'https://via.placeholder.com/300x200.png?text=北海道1',
                description: '北海道の自然'
            },
            {
                url: 'https://via.placeholder.com/300x200.png?text=北海道2',
                description: '札幌の街並み'
            }
        ]
    },
    // 他の都道府県も同様に追加
];

function Profile() {
    const [prefecturePhotos, setPrefecturePhotos] = useState(prefecturePhotosInitial);

    const handleAddPost = (newPost) => {
        const existingPrefecture = prefecturePhotos.find(pref => pref.prefecture === newPost.prefecture);

        if (existingPrefecture) {
            // 既存の都道府県に画像を追加
            const updatedPrefectures = prefecturePhotos.map(pref => {
                if (pref.prefecture === newPost.prefecture) {
                    return {
                        ...pref,
                        images: [...pref.images, { url: newPost.image, description: newPost.description }]
                    };
                }
                return pref;
            });
            setPrefecturePhotos(updatedPrefectures);
        } else {
            // 新しい都道府県を追加
            const newPrefecture = {
                id: prefecturePhotos.length + 1, // IDを適切に設定
                prefecture: newPost.prefecture,
                position: getPrefecturePosition(newPost.prefecture), // 都道府県の座標を取得する関数を実装
                images: [{ url: newPost.image, description: newPost.description }]
            };
            setPrefecturePhotos([...prefecturePhotos, newPrefecture]);
        }
    };

    // 都道府県名から座標を取得する関数の例
    const getPrefecturePosition = (prefectureName) => {
        const positions = {
            '東京都': [35.6895, 139.6917],
            '大阪府': [34.6937, 135.5023],
            '北海道': [43.0667, 141.3500],
            // 他の都道府県も追加
        };
        return positions[prefectureName] || [36.2048, 138.2529]; // デフォルトの位置
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src="https://ogre.natalie.mu/artist/48196/20230705/tanakakei_art202306.jpg?imwidth=640&imdensity=1" alt="プロフィール画像" className="profile-image" />
                <div className="profile-info">
                    <h2>shoma_0710</h2>
                    <div className="profile-stats">
                        <span><strong>フォロワー</strong> 100</span>
                        <span><strong>フォロー中</strong> 150</span>
                        <span><strong>投稿</strong> {prefecturePhotos.reduce((acc, pref) => acc + pref.images.length, 0)}</span>
                    </div>
                </div>
            </div>
            <div className="profile-bio">
                <p>翔眞です。よろしくお願いします。</p>
            </div>

            {/* 新規投稿コンポーネントの追加 */}
            <NewPost onAddPost={handleAddPost} />

            {/* マップセクションの追加 */}
            <MapSection prefecturePhotos={prefecturePhotos} />
        </div>
    );
}

export default Profile;