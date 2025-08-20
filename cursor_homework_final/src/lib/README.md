# 📦 `src/lib` — Biblioteca de Utilidades de Negocio

Este módulo proporciona funciones utilitarias para cálculos financieros y análisis de órdenes de compra. Está diseñado como proyecto educativo para practicar **generación de pruebas automatizadas**, **refactorización asistida por IA** y **documentación técnica**.

## 🎯 Propósito

Las funciones en este módulo abordan dos casos de uso comunes en aplicaciones de e-commerce:

1. **Cálculo de precios finales** con impuestos y descuentos
2. **Generación de reportes agregados** de órdenes de compra

Ambas funciones incluyen validación robusta de parámetros y manejo de errores para garantizar la integridad de los datos.

## 📚 Funciones Disponibles

### `calculateFinal(total, iva?, discount?)`

Calcula el precio final aplicando **IVA** y **descuento** sobre un importe base. Incluye validación de rangos y redondeo a 2 decimales.

**Parámetros:**
- `total` (number): Importe base ≥ 0
- `iva` (number, opcional): Tasa de IVA [0, 1], por defecto 0.21 (21%)
- `discount` (number, opcional): Tasa de descuento [0, 1], por defecto 0

**Retorna:** `number` - Precio final redondeado a 2 decimales

```typescript
import { calculateFinal } from './price';

// Casos básicos
const precio1 = calculateFinal(100);              // 121 (IVA 21%)
const precio2 = calculateFinal(100, 0.13);        // 113 (IVA 13%)
const precio3 = calculateFinal(100, 0.21, 0.10);  // 108.9 (IVA 21%, desc. 10%)

// Manejo de decimales
const precio4 = calculateFinal(99.99, 0.21, 0.05); // 114.99
```

**Errores:**
- `TypeError`: Parámetros no numéricos o infinitos
- `RangeError`: Valores fuera de rango permitido

---

### `groupOrdersReport(orders)`

Genera un reporte agregado con estadísticas de un conjunto de órdenes de compra. Filtra automáticamente órdenes inválidas y asigna valores por defecto a campos faltantes.

**Parámetros:**
- `orders` (Array): Array de objetos orden con propiedades opcionales

**Retorna:** `OrdersReport` - Objeto con estadísticas agregadas

```typescript
import { groupOrdersReport } from './orders';

const orders = [
  {
    id: 'ord-001',
    userId: 'user-1', 
    status: 'paid',
    total: 150.50,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ord-002',
    userId: 'user-1',
    status: 'shipped', 
    total: 89.99,
    createdAt: '2024-01-16T14:15:00Z'
  },
  {
    id: 'ord-003',
    userId: 'user-2',
    status: 'pending',
    total: 234.75,
    createdAt: '2024-01-17T09:45:00Z'
  }
];

const reporte = groupOrdersReport(orders);
console.log(reporte);
// {
//   totalOrders: 3,
//   totalsByStatus: { 
//     paid: 150.50, 
//     shipped: 89.99, 
//     pending: 234.75 
//   },
//   countByUser: { 
//     'user-1': 2, 
//     'user-2': 1 
//   },
//   newestOrderId: 'ord-003'
// }
```

**Manejo de datos faltantes:**
```typescript
const ordenesIncompletas = [
  { total: 100 },                    // sin userId, status, id
  { userId: 'user-1', total: 75 },   // sin status, id
  { status: 'paid', total: 50 }      // sin userId, id
];

const reporte = groupOrdersReport(ordenesIncompletas);
// Los campos faltantes se asignan como 'unknown'
// Los IDs faltantes resultan en newestOrderId: null
```

## ⚠️ Limitaciones Conocidas

### `calculateFinal`
- **Redondeo fijo**: Siempre redondea a 2 decimales (no configurable)
- **Un solo impuesto**: No soporta múltiples impuestos en cascada
- **Sin retenciones**: No calcula retenciones fiscales u otros cargos
- **Orden fijo**: Aplica siempre IVA primero, luego descuento

### `groupOrdersReport`
- **Validación simple**: Solo valida que `total` sea numérico válido
- **Sin filtros**: No soporta filtrado por fechas, usuarios o estados
- **Sin paginación**: Procesa todo el array en memoria
- **Sin agregaciones complejas**: Limitado a sumas y conteos básicos
- **Fechas simples**: Usa `Date.parse()` sin validación de formato estricta

## 🔧 Configuración de Desarrollo

Este módulo está configurado para desarrollo con:
- **TypeScript** para tipado estático
- **Jest** para pruebas automatizadas
- **ESLint** para análisis de código
- **JSDoc** para documentación

```bash
# Ejecutar pruebas
npm test

# Ejecutar con cobertura
npm run test:cov

# Compilar TypeScript
npm run build
```

## 📖 Casos de Uso Recomendados

### ✅ Casos ideales para `calculateFinal`
- Cálculo de precios en carritos de compra
- Generación de facturas simples
- Aplicación de promociones con descuentos porcentuales
- Sistemas con un solo tipo de impuesto

### ✅ Casos ideales para `groupOrdersReport`
- Dashboards administrativos básicos
- Reportes de ventas simplificados
- Análisis exploratorio de datos de órdenes
- Métricas de negocio de alto nivel

### ❌ Casos no recomendados
- Sistemas de facturación complejos (usar `calculateFinal`)
- Reportes en tiempo real de alta frecuencia (usar `groupOrdersReport`)
- Procesamiento de grandes volúmenes (>10k órdenes) sin paginación
- Cálculos financieros que requieren precisión decimal exacta

---

> **Nota:** Este módulo forma parte de un ejercicio educativo. Para uso en producción, considere implementar validaciones más estrictas, manejo de errores más granular y optimizaciones de rendimiento según sus necesidades específicas.
