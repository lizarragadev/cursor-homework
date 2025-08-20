# 📦 `src/lib` — Utilidades de negocio (starter)

Este módulo contiene funciones simples para practicar **generación de pruebas, refactor con IA en el IDE (Cursor)** y **documentación**.

## ✨ Funciones

### `calculateFinal(total, iva = 0.21, discount = 0)`
Calcula el precio final aplicando **IVA** y **descuento**. Valida rangos y redondea a 2 decimales.

```ts
import { calculateFinal } from '../lib/price';

// total 100, IVA 21% (por defecto), sin descuento
const p1 = calculateFinal(100); // 121

// total 100, IVA 13%, 10% de descuento
const p2 = calculateFinal(100, 0.13, 0.10); // 101.7
```

**Limitaciones**
- No maneja múltiples impuestos en cascada.
- El redondeo es a 2 decimales (no configurable).
- No calcula retenciones u otros cargos.

---

### `groupOrdersReport(orders)`
Agrega un conjunto de órdenes para producir un pequeño reporte (conteos y sumas). **La implementación incluida es intencionalmente _smelly_** para que practiques refactor con IA (duplicación, función larga, nombres mejorables).

```ts
import { groupOrdersReport } from '../lib/orders';

const report = groupOrdersReport([
  { id: 'o1', userId: 'u1', status: 'paid', total: 120, createdAt: '2024-01-01T10:00:00Z' },
  { id: 'o2', userId: 'u1', status: 'shipped', total: 80,  createdAt: '2024-01-02T10:00:00Z' },
  { id: 'o3', userId: 'u2', status: 'pending', total: 60, createdAt: '2024-01-03T10:00:00Z' }
]);

// => {
//   totalOrders: 3,
//   totalsByStatus: { paid: 120, shipped: 80, pending: 60 },
//   countByUser: { u1: 2, u2: 1 },
//   newestOrderId: 'o3'
// }
```

**Limitaciones**
- No valida el esquema completo de cada orden.
- No soporta filtros (por fecha, usuario, estado) ni paginación.
- La salida es minimalista y pensada para el ejercicio de refactor.
