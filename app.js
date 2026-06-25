const API_URL = "https://notas-backend-sxj2.onrender.com/api/notas";
const contenedorNotas = document.getElementById('contenedorNotas');
const notaForm = document.getElementById('notaForm');
const notaIdInput = document.getElementById('notaId');
const btnSubmit = document.getElementById('btnSubmit');

// 1. LEER (READ) - Cargar notas con botones de acción
async function cargarNotas() {
    try {
        const res = await fetch(API_URL);
        const notas = await res.json();
        
        contenedorNotas.innerHTML = '';
        
        if (notas.length === 0) {
            contenedorNotas.innerHTML = '<p>No hay notas aún. ¡Sé el primero!</p>';
            return;
        }

        notas.forEach(nota => {
            const div = document.createElement('div');
            div.className = 'nota';
            div.innerHTML = `
                <div class="autor">👤 ${nota.autor}</div>
                <p>${nota.contenido}</p>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button onclick="prepararEdicion(${nota.id}, '${nota.autor}', '${nota.contenido.replace(/'/g, "\\'")}')" style="background: #ffa500; font-size: 12px; padding: 5px 10px;">Editar</button>
                    <button onclick="eliminarNota(${nota.id})" style="background: #dc3545; font-size: 12px; padding: 5px 10px;">Eliminar</button>
                </div>
            `;
            contenedorNotas.appendChild(div);
        });
    } catch (error) {
        contenedorNotas.innerHTML = '<p>❌ Error al conectar con el servidor.</p>';
    }
}

// 2. CREAR (CREATE) O ACTUALIZAR (UPDATE) al enviar el formulario
notaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = notaIdInput.value;
    const autor = document.getElementById('autor').value;
    const contenido = document.getElementById('contenido').value;

    // Si el campo "id" tiene valor, significa que estamos EDITANDO; si no, estamos CREANDO.
    const esEdicion = id !== "";
    const url = esEdicion ? `${API_URL}/${id}` : API_URL;
    const metodo = esEdicion ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ autor, contenido })
        });

        if (res.ok) {
            notaForm.reset();
            notaIdInput.value = ""; // Limpiamos el ID oculto
            btnSubmit.innerText = "Publicar Nota"; // Restauramos el botón
            btnSubmit.style.background = "#0070f3";
            cargarNotas();
        }
    } catch (error) {
        alert('Error al procesar la nota');
    }
});

// 3. BORRAR (DELETE)
async function eliminarNota(id) {
    if (!confirm('¿Seguro que deseas eliminar esta nota?')) return;

    try {
const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            cargarNotas();
        }
    } catch (error) {
        alert('No se pudo eliminar la nota');
    }
}

// 4. Función intermedia para subir los datos al formulario para editar
function prepararEdicion(id, autor, contenido) {
    notaIdInput.value = id;
    document.getElementById('autor').value = autor;
    document.getElementById('contenido').value = contenido;
    
    // Cambiamos el aspecto del botón para avisarle al usuario
    btnSubmit.innerText = "Guardar Cambios";
    btnSubmit.style.background = "#ffa500";
}

// Carga inicial
cargarNotas();
