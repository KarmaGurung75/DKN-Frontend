// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../api/api';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchDashboardSummary();
        if (mounted) {
          setSummary(data);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) {
          setError('Failed to load dashboard.');
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading dashboard…</div>;
  if (error) return <div className="error-banner">{error}</div>;

  // Defensive mapping so we don't crash if field names differ slightly
  const communityCount =
    summary.communityCount ??
    summary.workspaceCount ??
    0;
  const artefactCount = summary.artefactCount ?? 0;
  const expertCount =
    summary.expertCount ??
    summary.consultantCount ??
    0;
  const ruleCount = summary.governanceRuleCount ?? 0;
  const trustedRate = summary.trustedPercentage ?? '–';
  const crossRegionRate = summary.crossRegionPercentage ?? '–';
  const updatesPending =
    summary.pendingRuleUpdates ??
    summary.pendingCount ??
    0;
  const recent = summary.recentArtefacts ?? [];

  return (
    <div className="dashboard-page">
      {/* HEADER + PULSE */}
      <section className="dashboard-header">
        <div>
          <div className="dashboard-kicker">Knowledge Governance</div>
          <h1 className="dashboard-title">
            Digital Knowledge Network Operations Console
          </h1>
          <p className="dashboard-text">
            Monitor how consultants, communities and governance rules are using the
            Digital Knowledge Network to capture, review and reuse project knowledge
            across regions and client accounts.
          </p>
        </div>

        <aside className="dashboard-pulse">
          <h3 className="dashboard-pulse-title">Today&apos;s pulse</h3>
          <ul className="dashboard-pulse-list">
            <li>
              <span className="pulse-label">Review backlog</span>
              <span className="pulse-value">
                {updatesPending} artefact{updatesPending === 1 ? '' : 's'} awaiting review
              </span>
            </li>
            <li>
              <span className="pulse-label">Trusted coverage</span>
              <span className="pulse-value">
                {trustedRate !== '–' ? `${trustedRate} trusted` : 'Trust level stable'}
              </span>
            </li>
            <li>
              <span className="pulse-label">Communities active</span>
              <span className="pulse-value">
                {communityCount} active
              </span>
            </li>
            <li>
              <span className="pulse-label">Expert participation</span>
              <span className="pulse-value">
                {crossRegionRate !== '–'
                  ? `${crossRegionRate} cross-region profiles`
                  : `${expertCount} expert profiles`}
              </span>
            </li>
          </ul>
          <div className="dashboard-pulse-foot">
            Snapshot based on the latest activity in the knowledge graph.
          </div>
        </aside>
      </section>

      {/* METRICS ROW */}
      <section className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-label">Communities</div>
          <div className="metric-value">{communityCount}</div>
          <div className="metric-foot">
            +{summary.communitiesDelta ?? 0} newly active this quarter
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Artefacts under governance</div>
          <div className="metric-value">{artefactCount}</div>
          <div className="metric-foot">
            {trustedRate !== '–'
              ? `${trustedRate} currently trusted`
              : 'Trust level stable'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Expert profiles</div>
          <div className="metric-value">{expertCount}</div>
          <div className="metric-foot">
            {crossRegionRate !== '–'
              ? `${crossRegionRate} cross-region`
              : 'Profiles active across regions'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Governance rules</div>
          <div className="metric-value">{ruleCount}</div>
          <div className="metric-foot">
            {updatesPending} rule-related updates in progress
          </div>
        </div>
      </section>

      {/* RECENT ARTEFACTS */}
      <section className="dashboard-card">
        <h3 className="dashboard-card-title">Recent knowledge artefacts</h3>
        {recent.length === 0 ? (
          <p className="dashboard-text">
            No knowledge artefacts have been captured yet. Use the <strong>Add artefact</strong>{' '}
            page to record playbooks, checklists or lessons learned from your current project.
          </p>
        ) : (
          <ul className="dashboard-list">
            {recent.map((a) => (
              <li key={a.id} className="dashboard-list-row">
                <div>
                  <div className="list-title">{a.title}</div>
                  <div className="list-sub">
                    {a.projectName && <span>{a.projectName} · </span>}
                    <span>{a.ownerName || a.owner}</span>
                  </div>
                </div>
                <div>
                  {a.status === 'Trusted' && (
                    <span className="status-badge status-badge--trusted">
                      TRUSTED
                    </span>
                  )}
                  {a.status === 'PendingReview' && (
                    <span className="status-badge status-badge--pending">
                      PENDING REVIEW
                    </span>
                  )}
                  {a.status === 'Draft' && (
                    <span className="status-badge status-badge--draft">
                      DRAFT
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MODEL COVERAGE */}
      <section className="dashboard-card">
        <h3 className="dashboard-card-title">Model coverage</h3>
        <p className="dashboard-text">
          The Digital Knowledge Network type model links regions, offices, workspaces,
          consultants, governance rules and client projects. This summary shows how much of
          that model is currently populated with real data from live engagements.
        </p>
        <div className="coverage-metrics">
          <div className="coverage-item">
            <span className="coverage-number">{communityCount}</span>
            <span className="coverage-label">active communities</span>
          </div>
          <div className="coverage-item">
            <span className="coverage-number">{expertCount}</span>
            <span className="coverage-label">expert profiles</span>
          </div>
          <div className="coverage-item">
            <span className="coverage-number">{artefactCount}</span>
            <span className="coverage-label">artefacts under governance</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
