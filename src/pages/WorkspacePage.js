// src/pages/WorkspacePage.js
import React, { useEffect, useState } from 'react';
import {
  fetchAllWorkspaces,
  fetchMyWorkspaces,
  joinWorkspace
} from '../api/api';

function WorkspacePage() {
  const [allWorkspaces, setAllWorkspaces] = useState([]);
  const [myWorkspaces, setMyWorkspaces] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [all, mine] = await Promise.all([
        fetchAllWorkspaces(),
        fetchMyWorkspaces()
      ]);
      setAllWorkspaces(all);
      setMyWorkspaces(mine);
    } catch (e) {
      console.error(e);
      setMessage('Failed to load workspaces.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleJoin = async (id) => {
    setMessage('');
    try {
      const res = await joinWorkspace(id);
      setMessage(
        `Joined workspace. Member count for workspace: ${res.memberCount}`
      );
      await load(); // reload lists so membership status updates
    } catch (e) {
      console.error(e);
      setMessage(
        e.response?.data?.message || 'Failed to join workspace.'
      );
    }
  };

  const isMember = (workspaceId) =>
    myWorkspaces.some((w) => w.id === workspaceId);

  return (
    <div className="card">
      <h2>Workspaces</h2>
      <p className="hint">
        Workspaces support collaboration in a project or community (BR9).
        Join a workspace to collaborate on artefacts and share knowledge.
      </p>
      {message && <p className="hint">{message}</p>}

      {/* MY WORKSPACES */}
      <h3>My workspaces</h3>
      {myWorkspaces.length === 0 ? (
        <p className="hint">You are not a member of any workspace yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {myWorkspaces.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.type}</td>
                <td>{w.projectName || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ALL WORKSPACES */}
      <h3 style={{ marginTop: '1.5rem' }}>All workspaces</h3>
      {allWorkspaces.length === 0 ? (
        <p className="hint">No workspaces defined.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Project</th>
              <th>Membership</th>
            </tr>
          </thead>
          <tbody>
            {allWorkspaces.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.type}</td>
                <td>{w.projectName || '-'}</td>
                <td>
                  {isMember(w.id) ? (
                    <span className="badge badge-success">Member</span>
                  ) : (
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => handleJoin(w.id)}
                    >
                      Join
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkspacePage;
