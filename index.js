const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Ruta al archivo datos.json
const dataPath = path.join(__dirname, 'datos.json');

// Función para leer y escribir el archivo datos.json
const leerDatos = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const guardarDatos = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Datos guardados correctamente.');
  } catch (error) {
    console.error('Error al guardar datos:', error.message);
  }
};

// Inicializamos datos desde el archivo datos.json
let data = leerDatos();

/** Utilidades */
const generarId = (coleccion) => {
  return data[coleccion].length > 0
    ? data[coleccion][data[coleccion].length - 1].id + 1
    : 1;
};

/** Rutas para gestión de productos */
app.get('/productos', (req, res) => {
  res.json(data.productos);
});

app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  if (!nombre || !descripcion || precio == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevoProducto = {
    id: generarId('productos'),
    nombre,
    descripcion,
    precio,
  };

  data.productos.push(nuevoProducto);
  guardarDatos();
  res.status(201).json(nuevoProducto);
});

app.delete('/productos/:id', (req, res) => {
  const productoId = parseInt(req.params.id);
  data.productos = data.productos.filter((p) => p.id !== productoId);
  guardarDatos();
  res.json({ message: 'Producto eliminado' });
});

/** Rutas para gestión de empleados */
app.get('/empleados', (req, res) => {
  res.json(data.empleados);
});

app.post('/empleados', (req, res) => {
  const { nombre, rol, turno } = req.body;

  if (!nombre || !rol || !turno) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevoEmpleado = {
    id: generarId('empleados'),
    nombre,
    rol,
    turno,
  };

  data.empleados.push(nuevoEmpleado);
  guardarDatos();
  res.status(201).json(nuevoEmpleado);
});

app.delete('/empleados/:id', (req, res) => {
  const empleadoId = parseInt(req.params.id);
  data.empleados = data.empleados.filter((e) => e.id !== empleadoId);
  guardarDatos();
  res.json({ message: 'Empleado eliminado' });
});

/** Rutas para gestión de líneas de producción */
app.get('/lineasProduccion', (req, res) => {
  res.json(data.lineasProduccion);
});

app.post('/lineasProduccion', (req, res) => {
  const { nombre, estado } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const nuevaLinea = {
    id: generarId('lineasProduccion'),
    nombre,
    estado: estado || 'inactiva',
  };

  data.lineasProduccion.push(nuevaLinea);
  guardarDatos();
  res.status(201).json(nuevaLinea);
});

app.delete('/lineasProduccion/:id', (req, res) => {
  const lineaId = parseInt(req.params.id);
  data.lineasProduccion = data.lineasProduccion.filter((l) => l.id !== lineaId);
  guardarDatos();
  res.json({ message: 'Línea de producción eliminada' });
});

/** Rutas para órdenes de producción */
app.get('/ordenesProduccion', (req, res) => {
  res.json(data.ordenesProduccion);
});

app.post('/ordenesProduccion', (req, res) => {
  const { productoId, cantidad, estado } = req.body;

  if (!productoId || cantidad == null) {
    return res
      .status(400)
      .json({ error: 'El productoId y la cantidad son obligatorios' });
  }

  const nuevaOrden = {
    id: generarId('ordenesProduccion'),
    productoId,
    cantidad,
    estado: estado || 'pendiente',
  };

  data.ordenesProduccion.push(nuevaOrden);
  guardarDatos();
  res.status(201).json(nuevaOrden);
});

app.delete('/ordenesProduccion/:id', (req, res) => {
  const ordenId = parseInt(req.params.id);
  data.ordenesProduccion = data.ordenesProduccion.filter((o) => o.id !== ordenId);
  guardarDatos();
  res.json({ message: 'Orden de producción eliminada' });
});

/** Actualización de estado */
app.patch('/lineasProduccion/:id', (req, res) => {
  const linea = data.lineasProduccion.find(
    (l) => l.id === parseInt(req.params.id)
  );
  if (!linea) {
    return res.status(404).json({ error: 'Línea de producción no encontrada' });
  }
  linea.estado = req.body.estado || linea.estado;
  guardarDatos();
  res.json(linea);
});

app.patch('/ordenesProduccion/:id', (req, res) => {
  const orden = data.ordenesProduccion.find(
    (o) => o.id === parseInt(req.params.id)
  );
  if (!orden) {
    return res.status(404).json({ error: 'Orden de producción no encontrada' });
  }
  orden.estado = req.body.estado || orden.estado;
  guardarDatos();
  res.json(orden);
});

/** Inicio del servidor */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
