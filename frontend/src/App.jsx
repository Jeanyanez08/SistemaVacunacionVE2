import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [pacientes, setPacientes] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Estado formulario Paciente (Crear / Editar)
  const [editandoId, setEditandoId] = useState(null);
  const [formPaciente, setFormPaciente] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    correo: '',
    telefono: '',
    ubicacion: 'San Juan de los Morros'
  });

  // Estado formulario Vacuna
  const [formVacuna, setFormVacuna] = useState({
    cedula: '',
    vacuna: '',
    lote: '',
    fecha_aplicacion: new Date().toISOString().slice(0, 10),
    centro_salud: 'Hospital Dr. Israel Ranuárez Balza'
  });

  // Estado formulario Examen
  const [formExamen, setFormExamen] = useState({
    cedula: '',
    tipo_examen: '',
    archivo_url: '',
    observacion: ''
  });

  const limpiarAlertas = () => {
    setMensaje('');
    setError('');
  };

  // READ: Cargar datos desde el backend
  const cargarTodo = async () => {
    try {
      const [resPac, resVac, resExa] = await Promise.all([
        fetch(`${API_URL}/pacientes`),
        fetch(`${API_URL}/vacunas`),
        fetch(`${API_URL}/examenes`)
      ]);

      const dataPac = await resPac.json();
      const dataVac = await resVac.json();
      const dataExa = await resExa.json();

      if (dataPac.ok) setPacientes(dataPac.data || []);
      if (dataVac.ok) setVacunas(dataVac.data || []);
      if (dataExa.ok) setExamenes(dataExa.data || []);
    } catch {
      setError('No se pudo conectar con el backend en http://localhost:5000. Verifica que node server.js esté corriendo.');
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // CREATE & UPDATE: Guardar o actualizar paciente
  const handleGuardarPaciente = async (e) => {
    e.preventDefault();
    limpiarAlertas();

    const url = editandoId
      ? `${API_URL}/pacientes/${editandoId}`
      : `${API_URL}/pacientes/registrar`;
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPaciente)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.mensaje || 'Error al guardar paciente');
        return;
      }

      setMensaje(data.mensaje || (editandoId ? 'Paciente actualizado' : 'Paciente registrado'));
      setEditandoId(null);
      setFormPaciente({
        cedula: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        correo: '',
        telefono: '',
        ubicacion: 'San Juan de los Morros'
      });
      cargarTodo();
    } catch {
      setError('Error de red al guardar el paciente');
    }
  };

  const iniciarEdicion = (p) => {
    limpiarAlertas();
    setEditandoId(p.id);
    setFormPaciente({
      cedula: p.cedula || '',
      nombres: p.nombres || '',
      apellidos: p.apellidos || '',
      fecha_nacimiento: p.fecha_nacimiento ? String(p.fecha_nacimiento).slice(0, 10) : '',
      correo: p.correo || '',
      telefono: p.telefono || '',
      ubicacion: p.ubicacion || ''
    });
  };

  // DELETE: Eliminar paciente
  const eliminarPaciente = async (id) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.mensaje || 'No se pudo eliminar el paciente');
        return;
      }
      setMensaje(data.mensaje || 'Paciente eliminado');
      cargarTodo();
    } catch {
      setError('Error de red al eliminar paciente');
    }
  };

  // CREATE: Registrar vacuna
  const handleRegistrarVacuna = async (e) => {
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
        setError(data.mensaje || 'Error al registrar vacuna');
        return;
      }
      setMensaje(data.mensaje || 'Vacuna registrada');
      setFormVacuna({ ...formVacuna, vacuna: '', lote: '' });
      cargarTodo();
    } catch {
      setError('Error de red al registrar vacuna');
    }
  };

  // DELETE: Eliminar vacuna
  const eliminarVacuna = async (id) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/vacunas/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.mensaje || 'No se pudo eliminar la vacuna');
        return;
      }
      setMensaje(data.mensaje || 'Vacuna eliminada');
      cargarTodo();
    } catch {
      setError('Error de red al eliminar vacuna');
    }
  };

  // CREATE: Anexar examen externo
  const handleAnexarExamen = async (e) => {
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
        setError(data.mensaje || 'Error al anexar examen');
        return;
      }
      setMensaje(data.mensaje || 'Examen anexado');
      setFormExamen({ cedula: '', tipo_examen: '', archivo_url: '', observacion: '' });
      cargarTodo();
    } catch {
      setError('Error de red al anexar examen');
    }
  };

  // UPDATE: Dictamen Subregión
  const cambiarDictamen = async (id, estado_promesa) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/examenes/dictamen/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado_promesa,
          dictamen_subregion: `Actualizado a ${estado_promesa}`
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.mensaje || 'Error al actualizar dictamen');
        return;
      }
      setMensaje(data.mensaje || 'Dictamen actualizado');
      cargarTodo();
    } catch {
      setError('Error de red al actualizar dictamen');
    }
  };

  // DELETE: Eliminar examen
  const eliminarExamen = async (id) => {
    limpiarAlertas();
    try {
      const res = await fetch(`${API_URL}/examenes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.mensaje || 'No se pudo eliminar examen');
        return;
      }
      setMensaje(data.mensaje || 'Examen eliminado');
      cargarTodo();
    } catch {
      setError('Error de red al eliminar examen');
    }
  };

  return (
    <div className="container my-4">
      <div className="card card-futurista p-4 mb-4">
        <h2 className="fw-bold mb-1">Gestión CRUD · Sistema Nacional de Vacunación</h2>
        <p className="text-muted mb-3">Operaciones en tiempo real conectadas a MySQL vía API (puerto 5000)</p>

        <div className="d-flex flex-wrap gap-2">
          <a href="login.html" className="btn btn-outline-primary btn-sm">Ir al Login Institucional</a>
          <a href="view/admin/dashboard.html" className="btn btn-outline-secondary btn-sm">Panel Admin</a>
          <a href="view/centro_salud/buscar_personas.html" className="btn btn-outline-secondary btn-sm">Centro de Salud</a>
          <a href="view/subregion/procesar_solicitud.html" className="btn btn-outline-secondary btn-sm">Subregión</a>
        </div>

        {mensaje && <div className="alert alert-success mt-3 mb-0">{mensaje}</div>}
        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      </div>

      {/* PACIENTES: CREATE, READ, UPDATE, DELETE */}
      <div className="card card-futurista p-4 mb-4">
        <h4 className="fw-bold mb-3">{editandoId ? `Editar Paciente #${editandoId}` : 'Registrar Paciente'}</h4>
        <form onSubmit={handleGuardarPaciente} className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cédula (ej. V12345678)"
              value={formPaciente.cedula}
              onChange={(e) => setFormPaciente({ ...formPaciente, cedula: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombres"
              value={formPaciente.nombres}
              onChange={(e) => setFormPaciente({ ...formPaciente, nombres: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Apellidos"
              value={formPaciente.apellidos}
              onChange={(e) => setFormPaciente({ ...formPaciente, apellidos: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={formPaciente.fecha_nacimiento}
              onChange={(e) => setFormPaciente({ ...formPaciente, fecha_nacimiento: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={formPaciente.correo}
              onChange={(e) => setFormPaciente({ ...formPaciente, correo: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Teléfono"
              value={formPaciente.telefono}
              onChange={(e) => setFormPaciente({ ...formPaciente, telefono: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Ubicación"
              value={formPaciente.ubicacion}
              onChange={(e) => setFormPaciente({ ...formPaciente, ubicacion: e.target.value })}
            />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-turquesa">
              {editandoId ? 'Guardar Cambios' : 'Agregar Paciente'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditandoId(null);
                  setFormPaciente({
                    cedula: '',
                    nombres: '',
                    apellidos: '',
                    fecha_nacimiento: '',
                    correo: '',
                    telefono: '',
                    ubicacion: 'San Juan de los Morros'
                  });
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
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">Sin pacientes registrados</td></tr>
              ) : (
                pacientes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><strong>{p.cedula}</strong></td>
                    <td>{p.nombres} {p.apellidos}</td>
                    <td>{p.ubicacion || '-'}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-warning" onClick={() => iniciarEdicion(p)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarPaciente(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VACUNAS: CREATE, READ, DELETE */}
      <div className="card card-futurista p-4 mb-4">
        <h4 className="fw-bold mb-3">Dosis de Vacunas Aplicadas</h4>
        <form onSubmit={handleRegistrarVacuna} className="row g-3 mb-4">
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Cédula paciente"
              value={formVacuna.cedula}
              onChange={(e) => setFormVacuna({ ...formVacuna, cedula: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Vacuna (ej. Fiebre Amarilla)"
              value={formVacuna.vacuna}
              onChange={(e) => setFormVacuna({ ...formVacuna, vacuna: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Lote"
              value={formVacuna.lote}
              onChange={(e) => setFormVacuna({ ...formVacuna, lote: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={formVacuna.fecha_aplicacion}
              onChange={(e) => setFormVacuna({ ...formVacuna, fecha_aplicacion: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-gob w-100">Registrar Dosis</button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cédula</th>
                <th>Paciente</th>
                <th>Vacuna</th>
                <th>Lote</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {vacunas.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">Sin dosis registradas</td></tr>
              ) : (
                vacunas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.cedula}</td>
                    <td>{v.nombres} {v.apellidos}</td>
                    <td><strong>{v.vacuna}</strong></td>
                    <td>{v.lote}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarVacuna(v.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXAMENES: CREATE, READ, UPDATE (DICTAMEN), DELETE */}
      <div className="card card-futurista p-4">
        <h4 className="fw-bold mb-3">Exámenes Externos · Subregión</h4>
        <form onSubmit={handleAnexarExamen} className="row g-3 mb-4">
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
              placeholder="Tipo de examen"
              value={formExamen.tipo_examen}
              onChange={(e) => setFormExamen({ ...formExamen, tipo_examen: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Observación"
              value={formExamen.observacion}
              onChange={(e) => setFormExamen({ ...formExamen, observacion: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-turquesa w-100">Anexar Examen</button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Tipo Examen</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {examenes.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">Sin exámenes anexados</td></tr>
              ) : (
                examenes.map((ex) => (
                  <tr key={ex.id}>
                    <td>{ex.id}</td>
                    <td>{ex.nombres} {ex.apellidos} ({ex.cedula})</td>
                    <td>{ex.tipo_examen}</td>
                    <td><span className="badge bg-info text-dark">{ex.estado_promesa || 'pendiente'}</span></td>
                    <td className="d-flex flex-wrap gap-1">
                      <button className="btn btn-sm btn-success" onClick={() => cambiarDictamen(ex.id, 'aprobado')}>Aprobar</button>
                      <button className="btn btn-sm btn-warning" onClick={() => cambiarDictamen(ex.id, 'rechazado')}>Rechazar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarExamen(ex.id)}>Eliminar</button>
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