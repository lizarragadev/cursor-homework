/**
 * Genera un reporte agregado de órdenes.
 * 
 * Estructura esperada de cada orden:
 * {
 *   id: string,
 *   userId: string,
 *   status: 'pending' | 'paid' | 'shipped' | 'cancelled',
 *   total: number,
 *   createdAt: string (ISO date)
 * }
 * 
 * Salida:
 * {
 *   totalOrders: number,
 *   totalsByStatus: Record<string, number>, // suma de 'total' por estado
 *   countByUser: Record<string, number>,    // número de órdenes por usuario
 *   newestOrderId: string | null,           // id de la orden más reciente
 * }
 * 
 * NOTA: Esta implementación es intencionalmente "smelly" para practicar refactors:
 * - Función larga con responsabilidades mezcladas
 * - Duplicación de lógica de actualización de mapas
 * - Nombres no siempre claros
 * - Falta de composición (no se extraen helpers)
 */
export function groupOrdersReport(orders: Array<any>) {
  if (!Array.isArray(orders)) {
    throw new TypeError('orders debe ser un array');
  }
  let n = 0;
  const tbs: Record<string, number> = {};
  const cbu: Record<string, number> = {};
  let newestOrderId: string | null = null;
  let newestOrderDate: number = -Infinity;

  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    if (!o || typeof o !== 'object') continue;
    if (typeof o.total !== 'number' || !Number.isFinite(o.total)) continue;

    n = n + 1;

    // actualizar por estado (duplicación de patrón update)
    const s = o.status || 'unknown';
    if (tbs[s] === undefined) {
      tbs[s] = o.total;
    } else {
      tbs[s] = tbs[s] + o.total;
    }

    // actualizar conteo por usuario (duplicación de patrón update)
    const u = o.userId || 'unknown';
    if (cbu[u] === undefined) {
      cbu[u] = 1;
    } else {
      cbu[u] = cbu[u] + 1;
    }

    // fecha más reciente
    const d = Date.parse(o.createdAt);
    if (Number.isFinite(d) && d > newestOrderDate) {
      newestOrderDate = d;
      newestOrderId = typeof o.id === 'string' ? o.id : null;
    }
  }

  return {
    totalOrders: n,
    totalsByStatus: tbs,
    countByUser: cbu,
    newestOrderId
  };
}
