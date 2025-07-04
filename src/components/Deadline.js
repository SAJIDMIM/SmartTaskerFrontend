import React from 'react';

const priorityColors = {
  High: '#dc2626',
  Medium: '#d97706',
  Low: '#2563eb',
};

const DeadlineReminder = ({ tasks }) => {
  const today = new Date().toISOString().slice(0, 10);

  // Titles to exclude
  const excludedTitles = ['finish project', 'call mom', 'buy groceries'];

  const upcomingTasks = tasks
    .filter(task =>
      task.dueDate &&
      task.dueDate.slice(0, 10) >= today &&
      !excludedTitles.includes(task.title.toLowerCase())
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  if (upcomingTasks.length === 0) {
    return <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No upcoming deadlines.</p>;
  }

  return (
    <div style={styles.deadlineContainer}>
      {upcomingTasks.map(task => (
        <div
          key={task._id}
          style={{ ...styles.deadlineCard, borderColor: priorityColors[task.priority] || '#999' }}
        >
          <h3 style={styles.taskTitle}>{task.title}</h3>
          <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p>
            <strong>Priority:</strong>{' '}
            <span style={{ color: priorityColors[task.priority] || '#999', fontWeight: '700' }}>
              {task.priority}
            </span>
          </p>
          <p><strong>Category:</strong> {task.category}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  deadlineContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  deadlineCard: {
    border: '3px solid',
    borderRadius: '12px',
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    color: '#111',
  },
  taskTitle: {
    margin: '0 0 10px',
  },
};

export default DeadlineReminder;
