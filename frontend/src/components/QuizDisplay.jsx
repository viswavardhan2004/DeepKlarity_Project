import React, { useState } from 'react';

const QuizDisplay = ({ data }) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    if (!data) return null;

    const handleOptionSelect = (qIndex, option) => {
        if (submitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [qIndex]: option
        }));
    };

    const handleSubmit = () => {
        let newScore = 0;
        data.quiz.forEach((q, idx) => {
            if (userAnswers[idx] === q.answer) {
                newScore++;
            }
        });
        setScore(newScore);
        setSubmitted(true);
    };

    const handleRetake = () => {
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    return (
        <div>
            <div className="mb-4">
                <h2>{data.title}</h2>
                <p className="text-muted">{data.summary}</p>
                <div style={{ marginTop: '1rem' }}>
                    {data.related_topics && data.related_topics.map((topic, i) => (
                        <span key={i} className="tag">{topic}</span>
                    ))}
                </div>
            </div>

            <hr style={{ borderColor: '#e5e7eb', margin: '2rem 0' }} />

            <div className="quiz-questions">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Quiz ({data.quiz.length} Questions)</h3>
                    {submitted && (
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
                            Score: {score} / {data.quiz.length}
                        </div>
                    )}
                </div>

                {data.quiz.map((q, idx) => {
                    return (
                        <div key={idx} style={{
                            background: 'rgba(0,0,0,0.02)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Q{idx + 1}. {q.question}</span>
                                <span className={`tag`} style={{ fontSize: '0.7rem', height: 'fit-content' }}>
                                    {q.difficulty}
                                </span>
                            </div>

                            <div className="options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                                {q.options.map((opt, optIdx) => {
                                    let style = {
                                        padding: '0.75rem',
                                        background: 'white',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: submitted ? 'default' : 'pointer',
                                        transition: 'all 0.2s'
                                    };

                                    // Selection Logic
                                    if (userAnswers[idx] === opt) {
                                        style.borderColor = '#6366f1';
                                        style.background = '#eef2ff';
                                    }

                                    // Result Logic
                                    if (submitted) {
                                        if (opt === q.answer) {
                                            style.borderColor = '#10b981'; // Green for correct
                                            style.background = '#d1fae5';
                                        } else if (userAnswers[idx] === opt && opt !== q.answer) {
                                            style.borderColor = '#ef4444'; // Red for wrong selected
                                            style.background = '#fee2e2';
                                        } else {
                                            style.opacity = 0.6;
                                        }
                                    }

                                    return (
                                        <div
                                            key={optIdx}
                                            onClick={() => handleOptionSelect(idx, opt)}
                                            style={style}
                                        >
                                            {opt}
                                        </div>
                                    );
                                })}
                            </div>

                            {submitted && (
                                <div style={{
                                    marginTop: '1rem',
                                    fontSize: '0.9rem',
                                    color: '#4b5563',
                                    borderLeft: '4px solid #6366f1',
                                    paddingLeft: '0.75rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    padding: '0.5rem'
                                }}>
                                    <strong>Explanation:</strong> {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    {!submitted ? (
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={Object.keys(userAnswers).length !== data.quiz.length}
                            style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={handleRetake}
                            style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}
                        >
                            Take Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizDisplay;
