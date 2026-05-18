const API_BASE = "http://localhost:8000"; 

export async function getMasters() {
  const response = await fetch(`${API_BASE}/masters`); 
  return response.json();
}

export async function getServices() {
  const response = await fetch(`${API_BASE}/services`);
  return response.json();
}

export async function getSchedule() {
  const response = await fetch(`${API_BASE}/schedule`);
  return response.json();
}
