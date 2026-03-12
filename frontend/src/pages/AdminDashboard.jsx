import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import './Pages.css';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [savingUserId, setSavingUserId] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [
          overviewResponse,
          usersResponse,
          activityResponse,
          quizResponse,
          resultResponse,
        ] = await Promise.all([
          adminAPI.getOverview(),
          adminAPI.getUsers(),
          adminAPI.getActivity(),
          adminAPI.getQuizzes(),
          adminAPI.getResults(),
        ]);

        setOverview(overviewResponse.data);
        setUsers(usersResponse.data.users || []);
        setActivity(activityResponse.data.activity || []);
        setQuizzes(quizResponse.data.quizzes || []);
        setResults(resultResponse.data.results || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const dashboardStats = useMemo(() => {
    return [
      { label: 'Total Users', value: overview?.stats?.totalUsers || 0 },
      { label: 'Total Quizzes', value: overview?.stats?.totalQuizzes || 0 },
      { label: 'Total Results', value: overview?.stats?.totalResults || 0 },
    ];
  }, [overview]);

  const handleRoleChange = async (userId, nextRole) => {
    const currentUser = users.find((user) => user._id === userId);

    if (!currentUser || currentUser.role === nextRole) {
      return;
    }

    try {
      setSavingUserId(userId);
      setActionMessage('');
      await adminAPI.updateUserRole(userId, nextRole);
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId ? { ...user, role: nextRole } : user
        )
      );
      setActionMessage('User role updated.');
    } catch (err) {
      setActionMessage(
        err.response?.data?.message || 'Failed to update user role.'
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and related quizzes/results?')) {
      return;
    }

    try {
      setSavingUserId(userId);
      setActionMessage('');
      await adminAPI.deleteUser(userId);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId)
      );
      setQuizzes((currentQuizzes) =>
        currentQuizzes.filter((quiz) => String(quiz.creatorId) !== userId)
      );
      setResults((currentResults) =>
        currentResults.filter((result) => String(result.userId) !== userId)
      );
      setActivity((currentActivity) =>
        currentActivity.filter((item) => String(item.user?.id) !== userId)
      );
      setOverview((currentOverview) =>
        currentOverview
          ? {
              ...currentOverview,
              stats: {
                ...currentOverview.stats,
                totalUsers: Math.max((currentOverview.stats?.totalUsers || 1) - 1, 0),
              },
            }
          : currentOverview
      );
      setActionMessage('User deleted successfully.');
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setSavingUserId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-hero">
        <div>
          <p className="admin-kicker">Admin Console</p>
          <h1>Dedicated admin dashboard</h1>
          <p>
            Manage users, inspect activity, and review every quiz and result
            with the responsible user attached.
          </p>
        </div>
        <div className="action-buttons">
          <Link to="/create-quiz" className="btn-primary">
            Create Quiz
          </Link>
          <Link to="/my-quizzes" className="btn-secondary">
            Manage Quizzes
          </Link>
          <Link to="/quiz-list" className="btn-secondary">
            Candidate View
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {actionMessage && <div className="success-message">{actionMessage}</div>}

      <div className="admin-stats-grid">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <span className="admin-stat-label">{stat.label}</span>
            <strong className="admin-stat-value">{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-panels">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>User Management</h2>
            <span>{users.length} users</span>
          </div>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Quizzes</th>
                    <th>Attempts</th>
                    <th>Average</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.username}</strong>
                        <div className="admin-table-meta">{user.email}</div>
                      </td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(user._id, event.target.value)
                          }
                          disabled={savingUserId === user._id}
                          className="admin-select"
                        >
                          <option value="admin">admin</option>
                          <option value="creator">creator</option>
                          <option value="candidate">candidate</option>
                        </select>
                      </td>
                      <td>{user.stats?.createdQuizCount || 0}</td>
                      <td>{user.stats?.attemptCount || 0}</td>
                      <td>
                        {user.stats?.averageScore !== null
                          ? `${user.stats.averageScore}%`
                          : 'n/a'}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={savingUserId === user._id}
                          className="admin-danger-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>User Activity</h2>
            <span>{activity.length} items</span>
          </div>
          {activity.length === 0 ? (
            <p>No activity found.</p>
          ) : (
            <div className="admin-list">
              {activity.slice(0, 10).map((item) => (
                <article key={item.id} className="admin-list-item">
                  <div>
                    <h3>{item.user?.username || 'System activity'}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="admin-timestamp">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2>Quiz List By User</h2>
          <span>{quizzes.length} quizzes</span>
        </div>
        {quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Created By</th>
                  <th>Questions</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.creatorName}</td>
                    <td>{quiz.questions?.length || 0}</td>
                    <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/quiz-results/${quiz._id}`} className="admin-inline-link">
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2>Result List By User</h2>
          <span>{results.length} results</span>
        </div>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Submitted By</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id}>
                    <td>{result.quizTitle}</td>
                    <td>{result.username}</td>
                    <td>
                      {result.score}/{result.totalQuestions}
                    </td>
                    <td>{result.percentage}%</td>
                    <td>{new Date(result.createdAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/quiz-result/${result._id}`} className="admin-inline-link">
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
