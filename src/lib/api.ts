const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('questfy_token');
}

function setToken(token: string) {
  localStorage.setItem('questfy_token', token);
}

function clearToken() {
  localStorage.removeItem('questfy_token');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============ AUTH ============

export async function login(email: string, password: string) {
  const data = await apiFetch<{ user: any; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const data = await apiFetch<{ user: any; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}

// ============ USER ============

export function getProfile() {
  return apiFetch<any>('/users/me');
}

export function getStats() {
  return apiFetch<any>('/users/me/stats');
}

export function getAchievements() {
  return apiFetch<any>('/users/me/achievements');
}

// ============ QUESTIONS ============

export function getQuestions(params?: { subject?: string; difficulty?: string; page?: number; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.subject) q.set('subject', params.subject);
  if (params?.difficulty) q.set('difficulty', params.difficulty);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return apiFetch<any>(`/questions?${q}`);
}

export function getRandomQuestion(subject?: string, difficulty?: string) {
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (difficulty) q.set('difficulty', difficulty);
  return apiFetch<any>(`/questions/random?${q}`);
}

export function getQuestion(id: string) {
  return apiFetch<any>(`/questions/${id}`);
}

// ============ GAME ============

export function answerQuestion(questionId: string, selectedAltId: string) {
  return apiFetch<any>('/game/answer', {
    method: 'POST',
    body: JSON.stringify({ questionId, selectedAltId }),
  });
}

export function getDashboard() {
  return apiFetch<any>('/game/dashboard');
}

// ============ MISSIONS ============

export function getMissions() {
  return apiFetch<any>('/missions');
}

export function getMyMissions() {
  return apiFetch<any>('/missions/my');
}

export function assignMission(missionId: string) {
  return apiFetch<any>('/missions/assign', {
    method: 'POST',
    body: JSON.stringify({ missionId }),
  });
}

export function updateMissionProgress(missionId: string, progress: number) {
  return apiFetch<any>('/missions/progress', {
    method: 'POST',
    body: JSON.stringify({ missionId, progress }),
  });
}

// ============ RANKING ============

export function getRanking(season = '2026', page = 1, limit = 50) {
  return apiFetch<any>(`/ranking?season=${season}&page=${page}&limit=${limit}`);
}

export function getMyRanking(season = '2026') {
  return apiFetch<any>(`/ranking/me?season=${season}`);
}

export { getToken, setToken, clearToken };
