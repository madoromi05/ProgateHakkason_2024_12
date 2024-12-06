import React, { useState } from 'react';
import './NewPostPage.css';
import { FaImage, FaMapMarkerAlt } from 'react-icons/fa';

function NewPostPage() {
    const [formData, setFormData] = useState({
        image: null,
        imagePreview: null,
        location: '',
        description: ''
    });

    const prefectures = [
        "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
        "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
        "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
        "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
        "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
        "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
        "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('投稿データ:', formData);
        // ここで投稿処理を実装
    };

    return (
        <div className="new-post-page">
            <div className="new-post-container">
                <h2>新規投稿</h2>
                <form onSubmit={handleSubmit} className="new-post-form">
                    <div className="image-upload-section">
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden-input"
                        />
                        <label htmlFor="image-upload" className="upload-area">
                            {formData.imagePreview ? (
                                <img 
                                    src={formData.imagePreview} 
                                    alt="プレビュー" 
                                    className="image-preview"
                                />
                            ) : (
                                <div className="upload-placeholder">
                                    <FaImage className="upload-icon" />
                                    <p>画像を選択</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="form-group">
                        <label>
                            <FaMapMarkerAlt className="input-icon" />
                            撮影場所
                        </label>
                        <select
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            required
                        >
                            <option value="">都道府県を選択</option>
                            {prefectures.map(prefecture => (
                                <option key={prefecture} value={prefecture}>
                                    {prefecture}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>説明</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="写真の説明を入力してください"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        投稿する
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NewPostPage;