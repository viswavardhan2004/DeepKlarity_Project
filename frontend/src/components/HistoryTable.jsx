import { useEffect, useState } from 'react';
import QuizDisplay from './QuizDisplay';

const HistoryTable = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/history`);
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/quiz/${id}`);
            const data = await res.json();
            setSelectedQuiz(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Past Quizzes</h2>
                <button className="btn-primary btn-sm" onClick={fetchHistory}>Refresh</button>
            </div>

            {loading ? <div className="loading-spinner"></div> : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Original URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>
                                <td>{item.title}</td>
                                <td><a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Link</a></td>
                                <td>
                                    <button
                                        className="btn-primary btn-sm"
                                        onClick={() => fetchDetails(item.id)}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center">No history found. Generate a quiz first!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {selectedQuiz && (
                <div className="modal-overlay" onClick={() => setSelectedQuiz(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedQuiz(null)}>&times;</button>
                        <QuizDisplay data={selectedQuiz} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryTable;
