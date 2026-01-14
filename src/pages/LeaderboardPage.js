import React, { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api/api';
import { useAuth } from '../auth/AuthContext';

function LeaderboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await fetchLeaderboard({
          regionId: user.region_id,
          limit: 10
        });
        setRows(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="card">
      <h2>Consultant leaderboard</h2>
      <p className="hint">
        Ranking based on Trusted artefacts, pending contributions, governance
        actions and workspace participation.
      </p>
      {loading ? (
        <p className="hint">Loading…</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Consultant</th>
              <th>Role</th>
              <th>Office</th>
              <th>Trusted</th>
              <th>Pending</th>
              <th>Gov actions</th>
              <th>Workspaces</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                style={
                  r.id === user.id
                    ? { backgroundColor: '#eff6ff', fontWeight: 600 }
                    : {}
                }
              >
                <td>{idx + 1}</td>
                <td>{r.name}</td>
                <td>{r.role}</td>
                <td>{r.officeName}</td>
                <td>{r.trusted_count}</td>
                <td>{r.pending_count}</td>
                <td>{r.governance_actions}</td>
                <td>{r.workspace_count}</td>
                <td>{Math.round(r.score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaderboardPage;
