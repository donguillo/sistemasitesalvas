const apiURL = 'http://localhost:3333/medicos';
  const tabla = document.getElementById('tabla-medicos');
  const modal = document.getElementById('modal');
  const tituloModal = document.getElementById('modal-titulo');

  let modo = 'crear';
  let medicoEditando = null;
  async function cargarMedicos() {
    tabla.innerHTML = '';
    const res = await fetch(apiURL);
    const medicos = await res.json();

    medicos.forEach(medico => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${medico.idmedico}</td>
        <td>${medico.nombres}</td>
        <td>${medico.especialidad}</td>
        <td>${medico.telefono}</td>
        <td>${medico.correo}</td>
        <td>${medico.direccion}</td>
        <td>
          <button class="btn-editar" onclick="abrirModalEditar(${medico.idmedico})">✏️</button>
          <button class="btn-eliminar" onclick="eliminarMedico(${medico.idmedico})">🗑️</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  function abrirModalCrear() {
    modo = 'crear';
    medicoEditando = null;
    tituloModal.textContent = 'Crear Médico';
    limpiarFormulario();
    modal.style.display = 'flex';
  }

  async function abrirModalEditar(id) {
    modo = 'editar';
    const res = await fetch(`${apiURL}/${id}`);
    const medico = await res.json();
    medicoEditando = id;

    tituloModal.textContent = 'Editar Médico';
    document.getElementById('nombre').value = medico.nombres;
    document.getElementById('especialidad').value = medico.especialidad;
    document.getElementById('telefono').value = medico.telefono;
    document.getElementById('correo').value = medico.correo;
    document.getElementById('direccion').value = medico.direccion;

    modal.style.display = 'flex';
  }

  function cerrarModal() {
    modal.style.display = 'none';
  }

  function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('especialidad').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('direccion').value = '';
  }

  async function guardarMedico() {
  const nombre = document.getElementById('nombre').value;
  const especialidad = document.getElementById('especialidad').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;
  const direccion = document.getElementById('direccion').value;

  const datos = {
    t1: nombre,
    t2: especialidad,
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
    await fetch(`${apiURL}/${medicoEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)  // <== USAMOS MISMA ESTRUCTURA
    });
  }

  cerrarModal();
  cargarMedicos();
}

async function eliminarMedico(id) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este médico?');
    if (!confirmar) return;

    await fetch(`${apiURL}/${id}`, {
      method: 'DELETE'
    });

    cargarMedicos();
  }

  // Inicializa
  cargarMedicos();
