import { useState } from 'react';

export default function TaskCard({ task }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = task.content.length > 120;
    const displayContent = expanded || !isLong 
        ? task.content 
        : task.content.substring(0, 120) + '...';

    return (
        <div className="task-card">
        <h4 className="task-title">{task.title}</h4>

        <p className="task-content">
            {displayContent}
        </p>

        {isLong && (
            <button
            type="button"
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
            >
            {expanded ? 'Show less' : 'Read more'}
            </button>
        )}

            <div className="task-meta">
                <small>
                Posted on{' '}
                {new Date(task.createdAt).toLocaleString('en-PH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                })}
                </small>
            </div>
        </div>
    );
}