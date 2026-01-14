import React, { useEffect, useState } from 'react';
import { fetchProjects, fetchTags, fetchArtefacts } from '../api/api';

function ArtefactBrowsePage() {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [status, setStatus] = useState('');
  const [artefacts, setArtefacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await fetchArtefacts(filters);
      setArtefacts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [p, t] = await Promise.all([fetchProjects(false), fetchTags()]);
        setProjects(p);
        setTags(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    load({
      projectId: selectedProject || undefined,
      tagId: selectedTag || undefined,
      status: status || undefined
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, selectedTag, status]);

  return (
    <div className="card">
      <h2>Search & browse knowledge</h2>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <label className="hint">Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">All</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="hint">Tag</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="hint">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any</option>
            <option value="Trusted">Trusted</option>
            <option value="PendingReview">PendingReview</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="hint">Loading…</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Project</th>
              <th>Status</th>
              <th>Confidentiality</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {artefacts.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.ownerName}</td>
                <td>{a.projectName || '-'}</td>
                <td>
                  <span
                    className={
                      a.status === 'Trusted'
                        ? 'badge badge-success'
                        : 'badge badge-warning'
                    }
                  >
                    {a.status}
                  </span>
                </td>
                <td>{a.confidentiality}</td>
                <td>{a.tags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ArtefactBrowsePage;
