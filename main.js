// Mostrar/ocultar campos según el tipo de dispositivo
  const tipo = document.getElementById("tipoDispositivo");
  const camposLaptopPC = document.getElementById("camposLaptopPC");
  const camposImpresora = document.getElementById("camposImpresora");
  const camposMonitor = document.getElementById("camposMonitor");

  function mostrarCampos() {
    camposLaptopPC.classList.add("hidden");
    camposImpresora.classList.add("hidden");
    camposMonitor.classList.add("hidden");

    if (tipo.value === "laptop" || tipo.value === "pc") {
      camposLaptopPC.classList.remove("hidden");
    } else if (tipo.value === "impresora") {
      camposImpresora.classList.remove("hidden");
    } else if (tipo.value === "monitor") {
      camposMonitor.classList.remove("hidden");
    }
  }

  tipo.addEventListener("change", mostrarCampos);
  window.addEventListener("DOMContentLoaded", mostrarCampos);

  // Deshabilitar campo de costo si el checkbox está marcado
  const costoInput = document.getElementById("costo");
  const precioDespues = document.getElementById("precioDespues");
  precioDespues.addEventListener("change", function() {
    if (this.checked) {
      costoInput.value = "";
      costoInput.disabled = true;
    } else {
      costoInput.disabled = false;
    }
  });

  // Generar PDF al enviar el formulario
  document.getElementById("formRegistro").addEventListener("submit", async function(e) {
    e.preventDefault();
    const { jsPDF } = window.jspdf;

    let formData = new FormData(this);
    let datos = {};
    formData.forEach((value, key) => datos[key] = value);

    // Generar folio automáticamente
    const marca = (datos.marca || '').trim().toLowerCase();
    const letras = marca.substring(0, 3);
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = String(fecha.getFullYear()).slice(-2);
    let folio = '';
    if (letras.length === 3) {
      folio = `${letras}${dia}${mes}${año}`;
    }

    const doc = new jsPDF();

    // Cargar logo automáticamente desde la misma carpeta
    let logoBase64 = null;
    try {
      const logoUrl = "logo.png";
      const response = await fetch(logoUrl);
      const logoBlob = await response.blob();
      logoBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });
    } catch (err) {
      logoBase64 = null;
    }

    // Borde general del documento
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.7);
    doc.rect(10, 10, 190, 285);

    // Logo y encabezado
    if (logoBase64) {
  doc.addImage(logoBase64, "PNG", 15, 12, 32, 32);
}
// Título grande y bonito
doc.setFont("Cabrisa", "bold");  // fuente en negrita
doc.setFontSize(30);               // tamaño grande
doc.text("Hoja De Servicio", 60, 30);

// Volver a tamaño normal para el resto del PDF
doc.setFontSize(10);
doc.setFont("helvetica", "normal");
// Fecha y hora actual
const ahora = new Date();
const fechaActual = ahora.toLocaleDateString();
const horaActual = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
doc.text(`Fecha: ${fechaActual} ${horaActual}`, 150, 24);

// 📌 Nueva variable para controlar la altura inicial de las secciones
let yInicio = 45;  // justo debajo del logo (ajústalo si queda muy pegado)

// Sección Cliente
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);

// 📌 Reducimos el tamaño del cuadro (30 en lugar de 50)
doc.rect(15, yInicio, 180, 30);

// Encabezado azul
doc.setFillColor(28, 69, 135);
doc.rect(15, yInicio, 180, 8, "F");

doc.setTextColor(255, 255, 255);
doc.text("DATOS DEL CLIENTE", 20, yInicio + 6);

// Texto dentro del cuadro
doc.setTextColor(0, 0, 0);
doc.setFontSize(10);

// 📌 Ponemos cada dato en una línea distinta
let yTexto = yInicio + 14;
doc.text(`Nombre: ${datos.nombre || '-'}`, 20, yTexto);
doc.text(`Dirección: ${datos.direccion || '-'}`, 20, yTexto + 6);
doc.text(`Teléfono: ${datos.telefono || '-'}`, 20, yTexto + 12);

// 📌 Ahora los datos del equipo empiezan más arriba (30 en vez de 55)
let y = yInicio + 35;

doc.rect(15, y, 180, 20);
doc.setFillColor(28, 69, 135);
doc.rect(15, y, 180, 8, "F");
doc.setTextColor(255, 255, 255);  
doc.text("DATOS DEL EQUIPO", 20, y + 6);
doc.setTextColor(0, 0, 0);
doc.text(`Tipo: ${datos.tipoDispositivo || '-'}`, 20, y + 12);
doc.text(`Marca: ${datos.marca || '-'}`, 80, y + 12);
doc.text(`Modelo: ${datos.modelo || '-'}`, 140, y + 12);
doc.text(`Folio: ${folio || '-'}`, 20, y + 18);

// 📌 A partir de aquí sigues usando `y` para que todo quede ordenado debajo
y += 25;
    // Campos específicos según tipo
    if (datos.tipoDispositivo === "laptop" || datos.tipoDispositivo === "pc") {
      doc.rect(15, y, 180, 32);
      doc.setFillColor(28, 69, 135);
      doc.rect(15, y, 180, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("CARACTERÍSTICAS", 20, y + 6);
      doc.setTextColor(0, 0, 0);
      doc.text(`Procesador: ${datos.procesador || '-'}`, 20, y + 12);
      doc.text(`RAM: ${datos.ram || '-'}`, 80, y + 12);
      doc.text(`Disco: ${datos.disco || '-'}`, 140, y + 12);
      doc.text(`Estado de pantalla: ${datos.estadoPantalla || '-'}`, 20, y + 18);
      doc.text(`Estado de Teclado: ${datos.estadoTeclado || '-'}`, 80, y + 18);
      doc.text(`Estado de Mouse: ${datos.estadoMouse || '-'}`, 140, y + 18);
      doc.text(`¿Enciende?: ${datos.enciendeEquipo || '-'}`, 20, y + 24);
      doc.text(`¿Funciona?: ${datos.funciona || '-'}`, 80, y + 24);
      doc.text(`Contraseña del equipo: ${datos.contrasenaEquipo || '-'}`, 140, y + 24);

      y += 37;
    } else if (datos.tipoDispositivo === "impresora") {
      doc.rect(15, y, 180, 20);
      doc.setFillColor(28, 69, 135);
      doc.rect(15, y, 180, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("IMPRESORA", 20, y + 6);
      doc.setTextColor(0, 0, 0);
      doc.text(`Tipo: ${datos.tipoImpresora || '-'}`, 20, y + 12);
      doc.text(`¿Imprime?: ${datos.imprime || '-'}`, 80, y + 12);
      doc.text(`Condiciones: ${datos.condicionesImpresora || '-'}`, 20, y + 18);
      y += 25;
    } else if (datos.tipoDispositivo === "monitor") {
      doc.rect(15, y, 180, 20);
      doc.setFillColor(28, 69, 135);
      doc.rect(15, y, 180, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("MONITOR", 20, y + 6);
      doc.setTextColor(0, 0, 0);
      doc.text(`Tamaño: ${datos.tamanoMonitor || '-'}`, 20, y + 12);
      doc.text(`¿Colores correctos?: ${datos.colores || '-'}`, 80, y + 12);
      doc.text(`Condiciones: ${datos.condicionesMonitor || '-'}`, 20, y + 18);
      y += 25;
    }

    // Trabajo y costo
    doc.rect(15, y, 180, 16);
    doc.setFillColor(28, 69, 135);
    doc.rect(15, y, 180, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("TRABAJO Y COSTO", 20, y + 6);
    doc.setTextColor(0, 0, 0);
    doc.text(`Trabajo: ${datos.trabajo || '-'}`, 20, y + 12);

    // Mostrar precio según el checkbox
    if (precioDespues.checked) {
      doc.text(`Costo Estimado: El precio se da después del mantenimiento`, 120, y + 12);
    } else {
      doc.text(`Costo Estimado: $${datos.costo || '-'}`, 120, y + 12);
    }



    // Términos y condiciones antes de las firmas
    y += 20;
    doc.setFontSize(10);
    doc.setDrawColor(63,135,166);
    doc.setLineWidth(0.5);
    // Cuadro menos grande para los términos (altura 100)
    doc.rect(15, y, 180, 110);
    doc.setFillColor(63,135,166);
    doc.rect(15, y, 180, 12, "F");
    doc.setTextColor(255,255,255);
    doc.text("Términos y Condiciones", 20, y + 9);

    doc.setTextColor(0,0,0);
    let texto = [
      "Copia de seguridad de datos: El proveedor recomienda al Cliente realizar copias de seguridad de todos los datos almacenados en sus equipos antes de la intervención. El proveedor no se hace responsable de la pérdida de datos, programas o configuraciones.",
      "Garantía de reparación: El proveedor se compromete a realizar su mejor esfuerzo para la resolución de los problemas, dependiendo de su naturaleza. La garantía de reparación se limita a los trabajos efectuados.",
      "Limitación de responsabilidad: El proveedor no será responsable por fallas en el equipo o software derivadas de factores externos como virus, uso indebido, uso por parte del cliente, modificaciones realizadas por el cliente o causas ajenas a su control.",
      "Presupuesto y autorización: El presupuesto presentado al cliente será válido por un tiempo determinado. Ningún trabajo será realizado sin la autorización del cliente.",
      "Tiempo de entrega: El tiempo de entrega estimado será informado al cliente, pudiendo variar según la complejidad de la reparación.",
      "Revisión posterior: El cliente se compromete a revisar el equipo en el momento de la entrega para verificar el correcto funcionamiento.",
      "Garantía de los trabajos: Los trabajos de reparación realizados tendrán una garantía limitada que será especificada en el comprobante de servicio. Esta garantía no cubre daños ocasionados por manipulación indebida, virus, golpes, caídas, líquidos u otros eventos externos que afecten al equipo."
    ];

    let ty = y + 16;
    texto.forEach(t => {
      doc.text(doc.splitTextToSize(t, 172), 18, ty);
      ty += doc.getTextDimensions(doc.splitTextToSize(t, 172)).h + 4;
    });

    // Campos de firma después de los términos
    y += 115;
    doc.rect(15, y, 85, 15);
    doc.rect(110, y, 85, 15);
    doc.text("NOMBRE Y FIRMA DEL TÉCNICO:", 20, y + 6);
    doc.text("NOMBRE Y FIRMA DEL CLIENTE:", 115, y + 6);
    doc.save(`comprobante_${folio}.pdf`);
    
  });

function parseCSV(file) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      download: true,
      header: true,
      complete: function(results) {
        resolve(results.data);
      }
    });
  });
}

Promise.all([
  parseCSV("mindfactory_done.csv"),
  parseCSV("mindfactory_updated.csv")
]).then(([data1, data2]) => {
  // 🔹 Combinar ambos archivos
  let combined = [...data1, ...data2];

  // 🔹 Definir marcas conocidas (puedes ampliar esta lista)
  const marcas = ["Lenovo", "HP", "Asus", "Dell", "Acer", "MSI", "Apple"];
  let marcasModelos = {};
  let modelosData = {}; // para guardar todos los datos por modelo

  // 🔹 Buscar coincidencias en la columna "name"
combined.forEach(row => {
  let name = row["name"]?.trim();
  if (!name) return;

  marcas.forEach(marca => {
    if (name.toLowerCase().includes(marca.toLowerCase())) {
      if (!marcasModelos[marca]) {
        marcasModelos[marca] = [];
      }

       let modeloCorto = name.replace(new RegExp("^" + marca + "\\s*", "i"), "")
                            .replace(/\b(\d{2}\.\d|\d{2}GB|SSD|HDD|Ryzen|Intel|Core|i3|i5|i7|i9|FHD|UHD|RAM)\b.*$/i, "")
                            .trim();

      if (!marcasModelos[marca].includes(modeloCorto)) {
        marcasModelos[marca].push(modeloCorto);
      }

      // ✅ guardamos los datos con el modelo corto como clave
      modelosData[modeloCorto] = row;
    }
  });
});
  // 🔹 Extraer valores únicos de CPU, RAM, Disco para sugerencias
  let cpuSet = new Set();
  let ramSet = new Set();
  let discoSet = new Set();

  combined.forEach(row => {
    if (row["cpu_processor"]) cpuSet.add(row["cpu_processor"].trim());
    if (row["ram_memory"]) ramSet.add(row["ram_memory"].trim() + " GB");
    if (row["internal_storage_gb"]) discoSet.add(row["internal_storage_gb"].trim() + " GB");
  });

  // llenar datalists de opciones alternativas
  cpuSet.forEach(val => {
    let opt = document.createElement("option");
    opt.value = val;
    document.getElementById("cpuOpciones").appendChild(opt);
  });

  ramSet.forEach(val => {
    let opt = document.createElement("option");
    opt.value = val;
    document.getElementById("ramOpciones").appendChild(opt);
  });

  discoSet.forEach(val => {
    let opt = document.createElement("option");
    opt.value = val;
    document.getElementById("discoOpciones").appendChild(opt);
  });

  // 🔹 Llenar datalist de marcas
  const datalistMarcas = document.getElementById("listaMarcas");
  Object.keys(marcasModelos).forEach(marca => {
    let option = document.createElement("option");
    option.value = marca;
    datalistMarcas.appendChild(option);
  });

  // 🔹 Cuando se elija una marca → llenar modelos
  document.getElementById("marcaInput").addEventListener("input", function() {
    let marcaSeleccionada = this.value;
    const datalistModelos = document.getElementById("listaModelos");
    datalistModelos.innerHTML = ""; // limpiar lista

    if (marcasModelos[marcaSeleccionada]) {
      marcasModelos[marcaSeleccionada].forEach(modelo => {
        let option = document.createElement("option");
        option.value = modelo;
        datalistModelos.appendChild(option);
      });
    }
  });

  // 🔹 Cuando se elija un modelo → autocompletar specs
  document.getElementById("modeloInput").addEventListener("input", function() {
    let modeloSeleccionado = this.value;
    let datos = modelosData[modeloSeleccionado];

    if (datos) {
      document.getElementById("procesador").value = datos["cpu_processor"] || "";
      document.getElementById("ram").value = datos["ram_memory"] ? datos["ram_memory"] + " GB" : "";
      document.getElementById("disco").value = datos["internal_storage_gb"] ? datos["internal_storage_gb"] + " GB" : "";
    }
  });

  console.log("✅ Marcas y modelos cargados:", marcasModelos);
});