import React, { useEffect, useState } from 'react';
import {
  fetchProjects,
  fetchTags,
  fetchMyWorkspaces,
  createArtefact
} from '../api/api';

function ArtefactCreatePage() {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [confidentiality, setConfidentiality] = useState('Internal');
  const [category, setCategory] = useState('Cloud');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [reviewDueOn, setReviewDueOn] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [p, t, w] = await Promise.all([
          fetchProjects(true),
          fetchTags(),
          fetchMyWorkspaces()
        ]);
        setProjects(p);
        setTags(t);
        setWorkspaces(w);

        if (!reviewDueOn) {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          setReviewDueOn(date.toISOString().slice(0, 10));
        }
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTag = (id) => {
    setSelectedTagIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        title,
        description,
        projectId: projectId || null,
        workspaceId: workspaceId || null,
        confidentiality,
        category,
        tagIds: selectedTagIds,
        reviewDueOn
      };
      const res = await createArtefact(payload);
      setMessage(res.message || 'Artefact created.');
      setTitle('');
      setDescription('');
      setSelectedTagIds([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create artefact');
    }
  };

  return (
    <div className="card">
      <h2>Add knowledge artefact</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cloud Migration Playbook"
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">-- Not linked --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.clientName})
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Workspace</label>
          <select
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
          >
            <option value="">-- Not linked --</option>
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} [{w.type}]
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Confidentiality</label>
          <select
            value={confidentiality}
            onChange={(e) => setConfidentiality(e.target.value)}
          >
            <option>Internal</option>
            <option>ClientConfidential</option>
            <option>Restricted</option>
          </select>
        </div>
        <div className="form-row">
          <label>Category (matches GovernanceRule)</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Cloud / CaseStudy / HowTo ..."
          />
        </div>
        <div className="form-row">
          <label>Review due on</label>
          <input
            type="date"
            value={reviewDueOn}
            onChange={(e) => setReviewDueOn(e.target.value)}
          />
          <span className="hint">
            Must comply with max review interval from governance rule.
          </span>
        </div>
        <div className="form-row">
          <label>Tags</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {tags.map((t) => (
              <label key={t.id} style={{ fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(t.id)}
                  onChange={() => toggleTag(t.id)}
                  style={{ marginRight: '0.25rem' }}
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="hint">{message}</p>}
        <button className="btn btn-primary" type="submit">
          Save artefact
        </button>
      </form>
    </div>
  );
}

export default ArtefactCreatePage;
