import React, { useState } from 'react';
import './NewPost.css';

const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

function NewPost({ onAddPost }) {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [prefecture, setPrefecture] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (image && description && prefecture) {
            onAddPost({ image, description, prefecture, date: new Date() });
            setImage(null);
            setDescription('');
            setPrefecture('');
            e.target.reset();
            setIsFullScreen(false);
            document.body.style.overflow = 'auto';
        } else {
            alert('画像、都道府県、説明を入力してください。');
        }
    };

    return (
        <div className={`new-post-container ${isFullScreen ? 'full-screen' : ''}`}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="prefecture">都道府県:</label>
                    <select
                        id="prefecture"
                        value={prefecture}
                        onChange={(e) => setPrefecture(e.target.value)}
                        required
                    >
                        <option value="" disabled>選択してください</option>
                        {prefectures.map((pref, index) => (
                            <option key={index} value={pref}>{pref}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="image">画像:</label>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
                </div>
                {image && (
                    <div className="image-preview">
                        <img src={image} alt="プレビュー" />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="description">説明:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="説明を入力してください..."
                        required
                    ></textarea>
                </div>
                <button type="submit" className="submit-button">投稿する</button>
            </form>
        </div>
    );
}

export default NewPost;