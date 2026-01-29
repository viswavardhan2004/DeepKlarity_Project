import { useState } from 'react';
import QuizDisplay from './QuizDisplay';

const GenerateQuiz = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const handleGenerate = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`${API_BASE}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to generate quiz');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Paste Wikipedia Article URL (e.g., https://en.wikipedia.org/wiki/Python_(programming_language))"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    className="btn-primary"
                    onClick={handleGenerate}
                    disabled={loading || !url}
                >
                    {loading ? 'Generating...' : 'Generate Quiz'}
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loading && <div className="loading-spinner"></div>}

            {result && <QuizDisplay data={result} />}
        </div>
    );
};

export default GenerateQuiz;
