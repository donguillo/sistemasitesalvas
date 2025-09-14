const medicoURL = "http://localhost:3333/medicos";
const pacienteURL = "http://localhost:3333/paciente"; // Asegúrate que sea plural si así definiste la ruta

// Estados separados para evitar conflictos
let modoMedico = "crear";
let idEditandoMedico = null;

let modoPaciente = "crear";
let idEditandoPaciente = null;

// ==================== MENÚ LATERAL ====================
function toggleSubmenu(entidad) {
    const submenu = document.getElementById(`submenu-${entidad}`);
    const arrow = document.getElementById(`arrow-${entidad}`);
    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    arrow.classList.toggle("up");
}

function mostrarSeccion(seccion) {
    const content = document.getElementById("main-content");

    if (seccion === "medico-crear") {
        content.innerHTML = `
      <h1>Gestión de Médicos</h1>
      <button class="btn-crear" onclick="abrirModalCrearMedico()">➕ Crear Médico</button>
      <table>
        <thead>
          <tr>
            <th><input type="text" id="buscar-id-medico" placeholder="🔍 ID"></th>
            <th><input type="text" id="buscar-nombres-medico" placeholder="🔍 Nombres"></th>
            <th><input type="text" id="buscar-especialidad-medico" placeholder="🔍 Especialidad"></th>
            <th><input type="text" id="buscar-telefono-medico" placeholder="🔍 Teléfono"></th>
            <th><input type="text" id="buscar-correo-medico" placeholder="🔍 Correo"></th>
            <th><input type="text" id="buscar-direccion-medico" placeholder="🔍 Dirección"></th>
            <th></th>
          </tr>
          <tr>
            <th>ID</th><th>Nombres</th><th>Especialidad</th><th>Teléfono</th>
            <th>Correo</th><th>Dirección</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-medicos"></tbody>
      </table>
    `;
        cargarMedicos();
        activarBuscadores("medico");
    }

    if (seccion === "paciente-crear") {
        content.innerHTML = `
      <h1>Gestión de Pacientes</h1>
      <button class="btn-crear" onclick="abrirModalCrearPaciente()">➕ Crear Paciente</button>
      <table>
        <thead>
          <tr>
            <th><input type="text" id="buscar-id-paciente" placeholder="🔍 ID"></th>
            <th><input type="text" id="buscar-documento-paciente" placeholder="🔍 Documento"></th>
            <th><input type="text" id="buscar-nombres-paciente" placeholder="🔍 Nombres"></th>
            <th><input type="text" id="buscar-telefono-paciente" placeholder="🔍 Teléfono"></th>
            <th><input type="text" id="buscar-correo-paciente" placeholder="🔍 Correo"></th>
            <th><input type="text" id="buscar-direccion-paciente" placeholder="🔍 Dirección"></th>
            <th></th>
          </tr>
          <tr>
            <th>ID</th><th>Documento</th><th>Nombres</th><th>Teléfono</th>
            <th>Correo</th><th>Dirección</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-pacientes"></tbody>
      </table>
    `;
        cargarPacientes();
        activarBuscadores("paciente");
    }

    if (seccion.endsWith("reporte")) {
        content.innerHTML = `
      <h1>Reporte de ${seccion.includes("medico") ? "Médicos" : "Pacientes"}</h1>
      <p>Aquí podrías generar estadísticas o exportar datos.</p>
    `;
    }
}

// ==================== MÉDICOS (CORRECTO) ====================
async function cargarMedicos(filtros = {}) {
    const tabla = document.getElementById("tabla-medicos");
    tabla.innerHTML = "";

    try {
        const res = await fetch(medicoURL);
        let medicos = await res.json();

        medicos = medicos.filter(m =>
            (!filtros.id || m.idmedico?.toString().includes(filtros.id)) &&
            (!filtros.nombres || m.nombres?.toLowerCase().includes(filtros.nombres.toLowerCase())) &&
            (!filtros.especialidad || m.especialidad?.toLowerCase().includes(filtros.especialidad.toLowerCase())) &&
            (!filtros.telefono || m.telefono?.includes(filtros.telefono)) &&
            (!filtros.correo || m.correo?.toLowerCase().includes(filtros.correo.toLowerCase())) &&
            (!filtros.direccion || m.direccion?.toLowerCase().includes(filtros.direccion.toLowerCase()))
        );

        medicos.forEach(medico => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${medico.idmedico}</td>
                <td>${medico.nombres}</td>
                <td>${medico.especialidad}</td>
                <td>${medico.telefono}</td>
                <td>${medico.correo}</td>
                <td>${medico.direccion}</td>
                <td>
                    <button class="btn-editar" onclick="abrirModalEditarMedico(${medico.idmedico})">✏️</button>
                    <button class="btn-eliminar" onclick="eliminarMedico(${medico.idmedico})">🗑️</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar médicos:", error);
        tabla.innerHTML = `<tr><td colspan="7">Error al cargar datos</td></tr>`;
    }
}

function abrirModalCrearMedico() {
    modoMedico = "crear";
    idEditandoMedico = null;
    document.getElementById("modal-titulo-medico").textContent = "Crear Médico";
    ["medico-t1", "medico-t2", "medico-t3", "medico-t4", "medico-t5"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("modal-medico").style.display = "flex";
}

async function abrirModalEditarMedico(id) {
    modoMedico = "editar";
    idEditandoMedico = id;

    try {
        const res = await fetch(`${medicoURL}/${id}`);
        const medico = await res.json();

        document.getElementById("modal-titulo-medico").textContent = "Editar Médico";
        document.getElementById("medico-t1").value = medico.nombres || "";
        document.getElementById("medico-t2").value = medico.especialidad || "";
        document.getElementById("medico-t3").value = medico.telefono || "";
        document.getElementById("medico-t4").value = medico.correo || "";
        document.getElementById("medico-t5").value = medico.direccion || "";

        document.getElementById("modal-medico").style.display = "flex";
    } catch (error) {
        console.error("Error al cargar médico:", error);
        alert("No se pudo cargar el médico.");
    }
}

async function guardarMedico() {
    const datos = {
        t1: document.getElementById("medico-t1").value.trim(),
        t2: document.getElementById("medico-t2").value.trim(),
        t3: document.getElementById("medico-t3").value.trim(),
        t4: document.getElementById("medico-t4").value.trim(),
        t5: document.getElementById("medico-t5").value.trim(),
    };

    if (!datos.t1 || !datos.t2 || !datos.t4) {
        alert("Nombres, especialidad y correo son obligatorios.");
        return;
    }

    try {
        if (modoMedico === "crear") {
            await fetch(medicoURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
        } else {
            await fetch(`${medicoURL}/${idEditandoMedico}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
        }
        cerrarModalMedico();
        cargarMedicos();
    } catch (error) {
        console.error("Error al guardar médico:", error);
        alert("Error al guardar.");
    }
}

async function eliminarMedico(id) {
    if (!confirm("¿Eliminar médico?")) return;
    try {
        await fetch(`${medicoURL}/${id}`, { method: "DELETE" });
        cargarMedicos();
    } catch (error) {
        console.error("Error al eliminar médico:", error);
    }
}

function cerrarModalMedico() {
    document.getElementById("modal-medico").style.display = "none";
}

// ==================== PACIENTES (CORREGIDO) ====================
async function cargarPacientes(filtros = {}) {
    const tabla = document.getElementById("tabla-pacientes");
    tabla.innerHTML = "";

    try {
        const res = await fetch(pacienteURL);
        let pacientes = await res.json();

        pacientes = pacientes.filter(p =>
            (!filtros.id || p.idpaciente?.toString().includes(filtros.id)) &&
            (!filtros.documento || p.documento?.includes(filtros.documento)) &&
            (!filtros.nombres || p.nombres?.toLowerCase().includes(filtros.nombres.toLowerCase())) &&
            (!filtros.telefono || p.telefono?.includes(filtros.telefono)) &&
            (!filtros.correo || p.correo?.toLowerCase().includes(filtros.correo.toLowerCase())) &&
            (!filtros.direccion || p.direccion?.toLowerCase().includes(filtros.direccion.toLowerCase()))
        );

        pacientes.forEach(paciente => {
            const fila = document.createElement("tr");
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
    } catch (error) {
        console.error("Error al cargar pacientes:", error);
        tabla.innerHTML = `<tr><td colspan="7">Error al cargar datos</td></tr>`;
    }
}

function abrirModalCrearPaciente() {
    modoPaciente = "crear";
    idEditandoPaciente = null;
    document.getElementById("modal-titulo-paciente").textContent = "Crear Paciente";
    ["paciente-t1", "paciente-t2", "paciente-t3", "paciente-t4", "paciente-t5"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("modal-paciente").style.display = "flex";
}

async function abrirModalEditarPaciente(id) {
    modoPaciente = "editar";
    idEditandoPaciente = id;

    try {
        const res = await fetch(`${pacienteURL}/${id}`);
        const paciente = await res.json();

        document.getElementById("modal-titulo-paciente").textContent = "Editar Paciente";
        document.getElementById("paciente-t1").value = paciente.documento || "";
        document.getElementById("paciente-t2").value = paciente.nombres || "";
        document.getElementById("paciente-t3").value = paciente.telefono || "";
        document.getElementById("paciente-t4").value = paciente.correo || "";
        document.getElementById("paciente-t5").value = paciente.direccion || "";

        document.getElementById("modal-paciente").style.display = "flex";
    } catch (error) {
        console.error("Error al cargar paciente:", error);
        alert("No se pudo cargar el paciente.");
    }
}

async function guardarPaciente() {
    const datos = {
        t1: document.getElementById("paciente-t1").value.trim(), // documento
        t2: document.getElementById("paciente-t2").value.trim(), // nombres
        t3: document.getElementById("paciente-t3").value.trim(), // telefono
        t4: document.getElementById("paciente-t4").value.trim(), // correo
        t5: document.getElementById("paciente-t5").value.trim(), // direccion
    };

    // Validación básica
    if (!datos.t1 || !datos.t2 || !datos.t4) {
        alert("Documento, nombres y correo son obligatorios.");
        return;
    }

    try {
        if (modoPaciente === "crear") {
            await fetch(pacienteURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
        } else {
            await fetch(`${pacienteURL}/${idEditandoPaciente}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });
        }
        cerrarModalPaciente();
        cargarPacientes();
    } catch (error) {
        console.error("Error al guardar paciente:", error);
        alert("Error al guardar el paciente.");
    }
}

async function eliminarPaciente(id) {
    if (!confirm("¿Eliminar paciente?")) return;
    try {
        await fetch(`${pacienteURL}/${id}`, { method: "DELETE" });
        cargarPacientes();
    } catch (error) {
        console.error("Error al eliminar paciente:", error);
    }
}

function cerrarModalPaciente() {
    document.getElementById("modal-paciente").style.display = "none";
}

// ==================== BUSCADORES ====================
function activarBuscadores(tipo) {
    const campos = tipo === "medico"
        ? ["id", "nombres", "especialidad", "telefono", "correo", "direccion"]
        : ["id", "documento", "nombres", "telefono", "correo", "direccion"];

    campos.forEach(campo => {
        const input = document.getElementById(`buscar-${campo}-${tipo}`);
        if (input) {
            input.addEventListener("keypress", e => {
                if (e.key === "Enter") {
                    const filtros = {};
                    campos.forEach(c => {
                        const val = document.getElementById(`buscar-${c}-${tipo}`)?.value || "";
                        if (val) filtros[c] = val;
                    });
                    tipo === "medico" ? cargarMedicos(filtros) : cargarPacientes(filtros);
                }
            });
        }
    });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", () => {
    const btnGuardarPaciente = document.getElementById("guardarPacienteBtn");
    if (btnGuardarPaciente) {
        btnGuardarPaciente.addEventListener("click", guardarPaciente);
    }

    // Asegurarse de que los modales se cierren al hacer clic fuera
    window.addEventListener("click", (e) => {
        const modalMedico = document.getElementById("modal-medico");
        const modalPaciente = document.getElementById("modal-paciente");
        if (e.target === modalMedico) cerrarModalMedico();
        if (e.target === modalPaciente) cerrarModalPaciente();
    });
});