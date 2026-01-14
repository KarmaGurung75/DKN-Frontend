import React, { useEffect, useState } from 'react';
import { fetchPendingArtefacts, reviewArtefact } from '../api/api';
import { useAuth } from '../auth/AuthContext';

function GovernancePendingPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await fetchPendingArtefacts();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (id, decision) => {
    setMessage('');
    try {
      await reviewArtefact(id, decision);
      setMessage(`Decision '${decision}' recorded.`);
      await load();
    } catch (e) {
      console.error(e);
      setMessage(e.response?.data?.message || 'Review failed');
    }
  };

  if (!user || (user.role !== 'KnowledgeChampion' && user.role !== 'GovCouncil')) {
    return (
      <div className="card">
        <h2>Governance</h2>
        <p className="error">You do not have governance permissions.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Pending artefacts for review</h2>
      {message && <p className="hint">{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Category</th>
            <th>Conf.</th>
            <th>Created</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.ownerName}</td>
              <td>{a.category}</td>
              <td>{a.confidentiality}</td>
              <td>{a.created_on}</td>
              <td>{a.tags}</td>
              <td>
                <button
                  className="btn btn-small btn-primary"
                  onClick={() => handleDecision(a.id, 'approve')}
                >
                  Approve
                </button>{' '}
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => handleDecision(a.id, 'reject')}
                >
                  Reject
                </button>{' '}
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => handleDecision(a.id, 'retire')}
                >
                  Retire
                </button>{' '}
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => handleDecision(a.id, 'outdated')}
                >
                  Mark outdated
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GovernancePendingPage;
