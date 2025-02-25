import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaMapMarkerAlt } from 'react-icons/fa';
import './NewPostPage.css';
import CameraComp from './CameraComp';
import axios from 'axios';
import { useUser } from '../UserContext';

function NewPostPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [formData, setFormData] = useState({
        image: null,
        imagePreview: null,
        location: '',
        description: ''
    });
    const [showCamera, setShowCamera] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const prefectures = [
        "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
        "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
        "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
        "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
        "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
        "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
        "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
    ];

    const handlePhotoCapture = (blob) => {
        setFormData({
            ...formData,
            image: blob,
            imagePreview: URL.createObjectURL(blob)
        });
        setShowCamera(false);
    };

    const handleCancel = () => {
        if (showCamera) {
            setShowCamera(false);
        } else {
            navigate(-1);
        }
    };

    const handleRetake = () => {
        setShowCamera(true);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (isSubmitting || !user) return;

        setIsSubmitting(true);
        const data = new FormData();
        data.append('file', formData.image);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('userId', user.username);

        try {
            await axios.post('http://localhost:5000/upload-photo', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('投稿が完了しました！');
            setIsSubmitting(false);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('---------------------', error);
            alert(error.response?.data?.error || 'エラーが発生しました');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="new-post-page">
            {showCamera ? (
                <div className="camera-wrapper">
                    <CameraComp 
                        onPhotoCapture={handlePhotoCapture}
                        onCancel={handleCancel}
                    />
                </div>
            ) : (
                <>
                    {!formData.imagePreview ? (
                        <div className="new-post-container">
                            <h2>新規投稿</h2>
                            <div className="camera-start-container">
                                <button 
                                    onClick={() => setShowCamera(true)}
                                    className="camera-start-button"
                                >
                                    <FaCamera />
                                    <span>タップしてカメラを起動</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="new-post-container">
                            <h2>新規投稿</h2>
                            <div className="new-post-form">
                                <div className="preview-container">
                                    <img 
                                        src={formData.imagePreview} 
                                        alt="プレビュー" 
                                        className="image-preview"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleRetake}
                                        className="retake-button"
                                    >
                                        <FaCamera /> 撮り直す
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FaMapMarkerAlt className="input-icon" />
                                        ロケーション
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
                                    <label htmlFor="description">説明</label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                        placeholder="写真の説明を入力してください"
                                    />
                                </div>
                            </div>
                            <div className="form-buttons">
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="cancel-button"
                                    disabled={isSubmitting}
                                >
                                    キャンセル
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSubmit}
                                    className="submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '投稿中...' : '投稿する'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default NewPostPage;