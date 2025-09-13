const apiURL = 'http://localhost:3333/paciente';
const tabla = document.getElementById('tabla-pacientes');
const modal = document.getElementById('modal-paciente');
const tituloModal = document.getElementById('modal-titulo-paciente');

let modo = 'crear';
let pacienteEditando = null;

// Carga y muestra todos los pacientes en la tabla
async function cargarPacientes() {
  tabla.innerHTML = '';
  const res = await fetch(apiURL);
  const pacientes = await res.json();

  pacientes.forEach(paciente => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${paciente.idpaciente}</td>
      <td>${paciente.documento}</td>
      <td>${paciente.nombres}</td>
      <td>${paciente.telefono}</td>
      <td>${paciente.correo}</td>
      <td>${paciente.direccion}</td>
      <td>
        <button class="btn-editar" onclick="abrirModalEditarPaciente(${paciente.idpaciente})">✏️</button>
        <button class="btn-eliminar" onclick="eliminarPaciente(${paciente.idpaciente})">🗑️</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Abre el modal para crear un nuevo paciente
function abrirModalCrearPaciente() {
  modo = 'crear';
  pacienteEditando = null;
  tituloModal.textContent = 'Crear Paciente';
  limpiarFormularioPaciente();
  modal.style.display = 'flex';
}

// Abre el modal para editar un paciente existente
async function abrirModalEditarPaciente(id) {
  modo = 'editar';
  const res = await fetch(`${apiURL}/${id}`);
  const paciente = await res.json();
  pacienteEditando = id;

  tituloModal.textContent = 'Editar Paciente';
  document.getElementById('documento').value = paciente.documento;
  document.getElementById('nombre').value = paciente.nombres;
  document.getElementById('telefono').value = paciente.telefono;
  document.getElementById('correo').value = paciente.correo;
  document.getElementById('direccion').value = paciente.direccion;

  modal.style.display = 'flex';
}

// Cierra el modal de paciente
function cerrarModalPaciente() {
  modal.style.display = 'none';
}

// Limpia los campos del formulario
function limpiarFormularioPaciente() {
  document.getElementById('documento').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('correo').value = '';
  document.getElementById('direccion').value = '';
}

// Guarda o actualiza un paciente
async function guardarPaciente() {
  const documento = document.getElementById('documento').value;
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;
  const direccion = document.getElementById('direccion').value;

  const datos = {
    t1: documento,
    t2: nombre,
    t3: telefono,
    t4: correo,
    t5: direccion
  };

  if (modo === 'crear') {
    await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  } else if (modo === 'editar') {
    await fetch(`${apiURL}/${pacienteEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  }

  cerrarModalPaciente();
  cargarPacientes();
}

// Elimina un paciente
async function eliminarPaciente(id) {
  // Evitamos usar 'confirm' porque no funciona en el entorno de Canvas.
  // La acción se ejecutará directamente al hacer clic.
  await fetch(`${apiURL}/${id}`, {
    method: 'DELETE'
  });

  cargarPacientes();
}

// Inicializa la carga de la tabla al cargar la página
cargarPacientes();