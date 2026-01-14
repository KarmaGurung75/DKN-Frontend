import React, { useEffect, useState } from 'react';
import { fetchGovernanceRules } from '../api/api';
import { useAuth } from '../auth/AuthContext';

function GovernanceRulesPage() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchGovernanceRules();
        setRules(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!user || (user.role !== 'KnowledgeChampion' && user.role !== 'GovCouncil')) {
    return (
      <div className="card">
        <h2>Governance rules</h2>
        <p className="error">You do not have governance permissions.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Governance rules catalog</h2>
      <p className="hint">
        These rules are used when validating artefacts (BR5, BR6, BR7).
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Max review (months)</th>
            <th>Retention (years)</th>
            <th>Mandatory metadata</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={r.id}>
              <td>{r.artefact_category}</td>
              <td>{r.name}</td>
              <td>{r.max_review_interval_months}</td>
              <td>{r.retention_years}</td>
              <td>{r.mandatory_metadata}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GovernanceRulesPage;
