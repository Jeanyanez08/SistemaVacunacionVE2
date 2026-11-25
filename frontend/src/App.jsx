import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const estadoInicialPersona = {
  cedula: '',
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  correo: '',
  telefono: ''
};

const estadoInicialVacuna = {
  cedula: '',
  vacuna: 'BCG',
  lote: '',
  centro_salud: '1',
  fecha_aplicacion: new Date().toISOString().slice(0, 10),
  nro_dosis: 1
};

const estadoInicialExamen = {
  cedula: '',
  nombre_archivo: '',
  ruta_archivo: ''
};

export default function App() {
  const [personas, setPersonas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [examenes, setExamenes] = useState([]);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Crear / Editar Persona
  const [editPersonaId, setEditPersonaId] = useState(null);
  const [formPersona, setFormPersona] = useState(estadoInicialPersona);

  // Crear Vacuna
  const [formVacuna, setFormVacuna] = useState(estadoInicialVacuna);

  // Editar Vacuna
  const [editVacunaId, setEditVacunaId] = useState(null);
  const [formEditVacuna, setFormEditVacuna] = useState({
    vacuna: '',
    lote: '',
    centro_salud: '1',
    fecha_aplicacion: '',
    nro_dosis: 1
  });

  // Crear Examen
  const [formExamen, setFormExamen] = useState(estadoInicialExamen);

  // Editar Examen
  const [editExamenId, setEditExamenId] = useState(null);
  const [formEditExamen, setFormEditExamen] = useState({
    nombre_archivo: '',
    ruta_archivo: ''
  });

  const limpiarAlertas = () => {
    setMensaje('');
    setError('');
  };

  const cargarTodo = async () => {
    try {
      const [rPer, rVac, rExa] = await Promise.all([
        fetch(`${API_URL}/pacientes`),
        fetch(`${API_URL}/vacunas`),
        fetch(`${API_URL}/examenes`)
      ]);

      const dPer = await rPer.json();
      const dVac = await rVac.json();
      const dExa = await rExa.json();

      if (dPer.ok) setPersonas(dPer.data || []);
      if (dVac.ok) setVacunas(dVac.data || []);
      if (dExa.ok) setExamenes(dExa.data || []);
    } catch {
      setError('No se pudo conectar con http://localhost:5000. Verifica que el backend esté encendido.');
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // --- PERSONAS: CREAR, EDITAR (PUT) Y ELIMINAR (DELETE) ---
  const guardarPersona = async (e) => {
    e.preventDefault();
    limpiarAlertas();

    const url = editPersonaId
      ? `${API_URL}/pacientes/${editPersonaId}`
      : `${API_URL}/pacientes/registrar`;
    const method = editPersonaId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPersona)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo guardar la persona');
        return;
      }

      setMensaje(data.mensaje || data.message || (editPersonaId ? 'Persona actualizada' : 'Persona registrada'));
      setEditPersonaId(null);
      setFormPersona(estadoInicialPersona);
      cargarTodo();
    } catch {
      setError('Error de conexión al guardar la persona');
    }
  };

  const prepararEditarPersona = (p) => {
    limpiarAlertas();
    setEditPersonaId(p.id_personas);
    setFormPersona({
      cedula: p.cedula || '',
      nombres: p.nombres || '',
      apellidos: p.apellidos || '',
      fecha_nacimiento: p.fecha_nacimiento ? String(p.fecha_nacimiento).slice(0, 10) : '',
      correo: p.correo || '',
      telefono: p.telefono || ''
    });
  };

  const eliminarPersona = async (id_personas) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/pacientes/${id_personas}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo eliminar la persona');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Persona eliminada');
      if (editPersonaId === id_personas) {
        setEditPersonaId(null);
        setFormPersona(estadoInicialPersona);
      }
      cargarTodo();
    } catch {
      setError('Error de conexión al eliminar la persona');
    }
  };

  // --- VACUNAS: REGISTRAR, EDITAR (PUT) Y ELIMINAR (DELETE) ---
  const registrarVacuna = async (e) => {
    e.preventDefault();
    limpiarAlertas();

    try {
      const res = await fetch(`${API_URL}/vacunas/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formVacuna)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo registrar la vacuna');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Dosis registrada');
      setFormVacuna({ ...formVacuna, lote: '', nro_dosis: 1 });
      cargarTodo();
    } catch {
      setError('Error de conexión al registrar la vacuna');
    }
  };

  const prepararEditarVacuna = (v) => {
    limpiarAlertas();
    setEditVacunaId(v.id_registro);
    setFormEditVacuna({
      vacuna: v.nombre_vacuna || String(v.id_vacunas || ''),
      lote: v.numero_lote || String(v.id_lote || ''),
      centro_salud: String(v.id_centros || '1'),
      fecha_aplicacion: v.fecha_aplicacion ? String(v.fecha_aplicacion).slice(0, 10) : '',
      nro_dosis: v.nro_dosis || 1
    });
  };

  const guardarEdicionVacuna = async (e) => {
    e.preventDefault();
    if (!editVacunaId) return;
    limpiarAlertas();

    try {
      const res = await fetch(`${API_URL}/vacunas/${editVacunaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEditVacuna)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo actualizar la vacuna');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Vacuna actualizada');
      setEditVacunaId(null);
      cargarTodo();
    } catch {
      setError('Error de conexión al actualizar la vacuna');
    }
  };

  const eliminarVacuna = async (id_registro) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/vacunas/${id_registro}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo eliminar la vacuna');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Vacuna eliminada');
      if (editVacunaId === id_registro) setEditVacunaId(null);
      cargarTodo();
    } catch {
      setError('Error de conexión al eliminar la vacuna');
    }
  };

  // --- EXAMENES: ANEXAR, EDITAR (PUT) Y ELIMINAR (DELETE) ---
  const anexarExamen = async (e) => {
    e.preventDefault();
    limpiarAlertas();

    try {
      const res = await fetch(`${API_URL}/examenes/anexar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formExamen)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo anexar el examen');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Examen anexado');
      setFormExamen(estadoInicialExamen);
      cargarTodo();
    } catch {
      setError('Error de conexión al anexar el examen');
    }
  };

  const prepararEditarExamen = (ex) => {
    limpiarAlertas();
    setEditExamenId(ex.id_examenes);
    setFormEditExamen({
      nombre_archivo: ex.nombre_archivo || '',
      ruta_archivo: ex.ruta_archivo || ''
    });
  };

  const guardarEdicionExamen = async (e) => {
    e.preventDefault();
    if (!editExamenId) return;
    limpiarAlertas();

    try {
      const res = await fetch(`${API_URL}/examenes/dictamen/${editExamenId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEditExamen)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo actualizar el examen');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Examen actualizado');
      setEditExamenId(null);
      cargarTodo();
    } catch {
      setError('Error de conexión al actualizar el examen');
    }
  };

  const eliminarExamen = async (id_examenes) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/examenes/${id_examenes}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || data.message || 'No se pudo eliminar el examen');
        return;
      }

      setMensaje(data.mensaje || data.message || 'Examen eliminado');
      if (editExamenId === id_examenes) setEditExamenId(null);
      cargarTodo();
    } catch {
      setError('Error de conexión al eliminar el examen');
    }
  };

  return (
    <div className="container my-4">
      <div className="card card-futurista p-4 mb-4">
        <h2 className="fw-bold mb-1">Sistema Nacional de Vacunación · CRUD React</h2>
        <p className="text-muted mb-0">Conectado a http://localhost:5000/api y base de datos sistema_vacunacion</p>
        {mensaje && <div className="alert alert-success mt-3 mb-0">{mensaje}</div>}
        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      </div>

      {/* 1. PERSONAS (CREAR / EDITAR / ELIMINAR) */}
      <div className="card card-futurista p-4 mb-4">
        <h4 className="fw-bold mb-3">
          {editPersonaId ? `Editar Persona #${editPersonaId}` : 'Registrar Persona'}
        </h4>

        <form onSubmit={guardarPersona} className="row g-3 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cédula (ej. 32456663)"
              value={formPersona.cedula}
              onChange={(e) => setFormPersona({ ...formPersona, cedula: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nombres"
              value={formPersona.nombres}
              onChange={(e) => setFormPersona({ ...formPersona, nombres: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Apellidos"
              value={formPersona.apellidos}
              onChange={(e) => setFormPersona({ ...formPersona, apellidos: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={formPersona.fecha_nacimiento}
              onChange={(e) => setFormPersona({ ...formPersona, fecha_nacimiento: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={formPersona.correo}
              onChange={(e) => setFormPersona({ ...formPersona, correo: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Teléfono"
              value={formPersona.telefono}
              onChange={(e) => setFormPersona({ ...formPersona, telefono: e.target.value })}
            />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-turquesa">
              {editPersonaId ? 'Guardar Cambios' : 'Registrar Persona'}
            </button>
            {editPersonaId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditPersonaId(null);
                  setFormPersona(estadoInicialPersona);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cédula</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">Sin personas registradas</td></tr>
              ) : (
                personas.map((p) => (
                  <tr key={p.id_personas}>
                    <td>{p.id_personas}</td>
                    <td><strong>{p.cedula}</strong></td>
                    <td>{p.nombres} {p.apellidos}</td>
                    <td>{p.correo || '-'}</td>
                    <td>{p.telefono || '-'}</td>
                    <td className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => prepararEditarPersona(p)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarPersona(p.id_personas)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. VACUNAS / DOSIS (CREAR / EDITAR / ELIMINAR) */}
      <div className="card card-futurista p-4 mb-4">
        <h4 className="fw-bold mb-3">Registro de Dosis de Vacunas</h4>

        <form onSubmit={registrarVacuna} className="row g-3 mb-4">
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Cédula"
              value={formVacuna.cedula}
              onChange={(e) => setFormVacuna({ ...formVacuna, cedula: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Vacuna"
              value={formVacuna.vacuna}
              onChange={(e) => setFormVacuna({ ...formVacuna, vacuna: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Lote o ID lote"
              value={formVacuna.lote}
              onChange={(e) => setFormVacuna({ ...formVacuna, lote: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="ID o nombre centro"
              value={formVacuna.centro_salud}
              onChange={(e) => setFormVacuna({ ...formVacuna, centro_salud: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Nro dosis"
              value={formVacuna.nro_dosis}
              onChange={(e) => setFormVacuna({ ...formVacuna, nro_dosis: Number(e.target.value) })}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-gob w-100">Cargar Dosis</button>
          </div>
        </form>

        {editVacunaId && (
          <form onSubmit={guardarEdicionVacuna} className="row g-3 mb-4 p-3 border rounded bg-light">
            <div className="col-12"><strong>Editando Dosis #{editVacunaId}</strong></div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Vacuna"
                value={formEditVacuna.vacuna}
                onChange={(e) => setFormEditVacuna({ ...formEditVacuna, vacuna: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Lote / ID lote"
                value={formEditVacuna.lote}
                onChange={(e) => setFormEditVacuna({ ...formEditVacuna, lote: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="ID / nombre centro"
                value={formEditVacuna.centro_salud}
                onChange={(e) => setFormEditVacuna({ ...formEditVacuna, centro_salud: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="Nro dosis"
                value={formEditVacuna.nro_dosis}
                onChange={(e) => setFormEditVacuna({ ...formEditVacuna, nro_dosis: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm">Guardar</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditVacunaId(null)}>Cancelar</button>
            </div>
          </form>
        )}

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cédula</th>
                <th>Ciudadano</th>
                <th>Vacuna</th>
                <th>Nro Dosis</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacunas.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">Sin dosis registradas</td></tr>
              ) : (
                vacunas.map((v) => (
                  <tr key={v.id_registro}>
                    <td>{v.id_registro}</td>
                    <td>{v.cedula}</td>
                    <td>{v.nombres} {v.apellidos}</td>
                    <td><strong>{v.nombre_vacuna || v.id_vacunas}</strong></td>
                    <td>{v.nro_dosis}</td>
                    <td className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => prepararEditarVacuna(v)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarVacuna(v.id_registro)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. EXAMENES (CREAR / EDITAR / ELIMINAR) */}
      <div className="card card-futurista p-4">
        <h4 className="fw-bold mb-3">Exámenes Externos</h4>

        <form onSubmit={anexarExamen} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cédula paciente"
              value={formExamen.cedula}
              onChange={(e) => setFormExamen({ ...formExamen, cedula: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre archivo (ej. serologia.pdf)"
              value={formExamen.nombre_archivo}
              onChange={(e) => setFormExamen({ ...formExamen, nombre_archivo: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Ruta o enlace del archivo"
              value={formExamen.ruta_archivo}
              onChange={(e) => setFormExamen({ ...formExamen, ruta_archivo: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-turquesa w-100">Anexar</button>
          </div>
        </form>

        {editExamenId && (
          <form onSubmit={guardarEdicionExamen} className="row g-3 mb-4 p-3 border rounded bg-light">
            <div className="col-12"><strong>Editando Examen #{editExamenId}</strong></div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre archivo"
                value={formEditExamen.nombre_archivo}
                onChange={(e) => setFormEditExamen({ ...formEditExamen, nombre_archivo: e.target.value })}
                required
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Ruta archivo"
                value={formEditExamen.ruta_archivo}
                onChange={(e) => setFormEditExamen({ ...formEditExamen, ruta_archivo: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm">Guardar</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditExamenId(null)}>Cancelar</button>
            </div>
          </form>
        )}

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ciudadano</th>
                <th>Archivo</th>
                <th>Ruta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {examenes.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">Sin exámenes anexados</td></tr>
              ) : (
                examenes.map((ex) => (
                  <tr key={ex.id_examenes}>
                    <td>{ex.id_examenes}</td>
                    <td>{ex.nombres} {ex.apellidos} ({ex.cedula})</td>
                    <td>{ex.nombre_archivo}</td>
                    <td>{ex.ruta_archivo}</td>
                    <td className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => prepararEditarExamen(ex)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarExamen(ex.id_examenes)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}