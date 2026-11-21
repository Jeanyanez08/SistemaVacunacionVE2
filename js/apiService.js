const BASE_URL = 'http://localhost:5000/api';

export async function consultarPacienteAPI(cedula) {
  const res = await fetch(`${BASE_URL}/pacientes/${encodeURIComponent(cedula)}`);
  return await res.json();
}

export async function registrarPacienteAPI(datos) {
  const res = await fetch(`${BASE_URL}/pacientes/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

export async function registrarVacunaAPI(datos) {
  const res = await fetch(`${BASE_URL}/vacunas/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

export async function anexarExamenAPI(datos) {
  const res = await fetch(`${BASE_URL}/examenes/anexar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}