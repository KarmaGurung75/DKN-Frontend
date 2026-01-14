import axios from 'axios';

// Use env var in production, localhost in dev
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  // All your routes are mounted under /api in server.js
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false,
});


// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dkn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------- AUTH -------

export async function loginRequest(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function signupRequest(name, email, password) {
  const res = await api.post('/auth/signup', { name, email, password });
  return res.data;
}

export async function fetchMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

// ------- LOOKUPS -------

export async function fetchProjects(mine = false) {
  const res = await api.get('/projects', {
    params: mine ? { mine: true } : {}
  });
  return res.data;
}

export async function fetchTags() {
  const res = await api.get('/tags');
  return res.data;
}

export async function fetchMyWorkspaces() {
  const res = await api.get('/workspaces/mine');
  return res.data;
}

export async function joinWorkspace(id) {
  const res = await api.post(`/workspaces/${id}/join`);
  return res.data;
}

export async function fetchAllWorkspaces() {
  const res = await api.get('/workspaces');
  return res.data;
}

// ------- ARTEFACTS -------

export async function fetchArtefacts(filters = {}) {
  const res = await api.get('/artefacts', { params: filters });
  return res.data;
}

export async function createArtefact(payload) {
  const res = await api.post('/artefacts', payload);
  return res.data;
}

// ------- GOVERNANCE -------

export async function fetchGovernanceRules() {
  const res = await api.get('/governance/rules');
  return res.data;
}

export async function fetchPendingArtefacts() {
  const res = await api.get('/governance/pending-artefacts');
  return res.data;
}

export async function reviewArtefact(id, decision, comments = '') {
  const res = await api.post(`/governance/artefacts/${id}/review`, {
    decision,
    comments
  });
  return res.data;
}

// ------- ANALYTICS -------

export async function fetchLeaderboard(params = {}) {
  const res = await api.get('/analytics/leaderboard', { params });
  return res.data;
}


// Build a dashboard summary from existing endpoints, but never throw
export async function fetchDashboardSummary() {
  // Base shape so we always return something
  const summary = {
    communityCount: 0,
    artefactCount: 0,
    expertCount: 0,
    governanceRuleCount: 0,
    pendingCount: 0,
    trustedPercentage: '–',
    crossRegionPercentage: '–',
    pendingRuleUpdates: 0,
    communitiesDelta: 0,
    recentArtefacts: []
  };

  // 1) Artefacts
  try {
    const artefactsRaw = await fetchArtefacts();
    const artefacts = Array.isArray(artefactsRaw)
      ? artefactsRaw
      : (artefactsRaw && artefactsRaw.artefacts) || [];

    summary.artefactCount = artefacts.length;

    const trustedCount = artefacts.filter(
      (a) => a.status === 'Trusted'
    ).length;

    summary.trustedPercentage = summary.artefactCount
      ? Math.round((trustedCount * 100) / summary.artefactCount) + '%'
      : '–';

    summary.recentArtefacts = artefacts.slice(0, 5);
  } catch (err) {
    console.error('Dashboard: fetchArtefacts failed', err);
  }

  // 2) Pending artefacts
  try {
    const pendingRaw = await fetchPendingArtefacts();
    const pending = Array.isArray(pendingRaw) ? pendingRaw : pendingRaw || [];
    summary.pendingCount = pending.length;
    summary.pendingRuleUpdates = pending.length;
  } catch (err) {
    console.error('Dashboard: fetchPendingArtefacts failed', err);
  }

  // 3) Leaderboard (experts)
  try {
    const leaderboardRaw = await fetchLeaderboard();
    const leaderboard = Array.isArray(leaderboardRaw)
      ? leaderboardRaw
      : leaderboardRaw || [];
    summary.expertCount = leaderboard.length;
  } catch (err) {
    console.error('Dashboard: fetchLeaderboard failed', err);
  }

  // 4) Workspaces (communities)
  try {
    const allWorkspacesRaw = await fetchAllWorkspaces();
    const allWorkspaces = Array.isArray(allWorkspacesRaw)
      ? allWorkspacesRaw
      : allWorkspacesRaw || [];
    summary.communityCount = allWorkspaces.length;
  } catch (err) {
    console.error('Dashboard: fetchAllWorkspaces failed', err);
  }

  // 5) Governance rules
  try {
    const rulesRaw = await fetchGovernanceRules();
    const rules = Array.isArray(rulesRaw) ? rulesRaw : rulesRaw || [];
    summary.governanceRuleCount = rules.length;
  } catch (err) {
    console.error('Dashboard: fetchGovernanceRules failed', err);
  }

  // We don't really have cross-region stats, so keep '–'
  summary.crossRegionPercentage = '–';

  return summary;
}


export default api;
