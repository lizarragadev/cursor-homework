/**
 * Genera un reporte agregado con estadísticas de órdenes de compra.
 * 
 * Esta función procesa un array de órdenes y calcula estadísticas agregadas
 * incluyendo conteos totales, sumas por estado, conteos por usuario y la orden más reciente.
 * Las órdenes inválidas (sin total numérico válido) son filtradas automáticamente.
 * 
 * @param orders - Array de objetos orden que pueden contener id, userId, status, total y createdAt
 * @returns Objeto con estadísticas agregadas de las órdenes procesadas
 * 
 * @throws {TypeError} Si el parámetro orders no es un array
 * 
 * @example
 * // Ejemplo básico con órdenes válidas
 * const orders = [
 *   { id: 'ord1', userId: 'user1', status: 'paid', total: 100, createdAt: '2024-01-01T10:00:00Z' },
 *   { id: 'ord2', userId: 'user2', status: 'pending', total: 50, createdAt: '2024-01-02T10:00:00Z' }
 * ];
 * 
 * const report = groupOrdersReport(orders);
 * // {
 * //   totalOrders: 2,
 * //   totalsByStatus: { paid: 100, pending: 50 },
 * //   countByUser: { user1: 1, user2: 1 },
 * //   newestOrderId: 'ord2'
 * // }
 * 
 * @example
 * // Manejo de órdenes con datos faltantes
 * const ordersWithDefaults = [
 *   { total: 100 }, // sin userId ni status
 *   { userId: 'user1', total: 75 } // sin status
 * ];
 * 
 * const report = groupOrdersReport(ordersWithDefaults);
 * // Los valores faltantes se asignan como 'unknown'
 * // {
 * //   totalOrders: 2,
 * //   totalsByStatus: { unknown: 175 },
 * //   countByUser: { unknown: 1, user1: 1 },
 * //   newestOrderId: null
 * // }
 * 
 * @since 1.0.0
 */

interface Order {
  id?: string;
  userId?: string;
  status?: string;
  total?: number;
  createdAt?: string;
}

interface OrdersReport {
  totalOrders: number;
  totalsByStatus: Record<string, number>;
  countByUser: Record<string, number>;
  newestOrderId: string | null;
}

/**
 * Valida que una orden sea válida para procesamiento
 */
function isValidOrder(order: any): order is Order {
  return order && 
         typeof order === 'object' && 
         typeof order.total === 'number' && 
         Number.isFinite(order.total);
}

/**
 * Actualiza un mapa acumulando valores
 */
function updateMap<T extends string>(
  map: Record<T, number>, 
  key: T, 
  value: number
): void {
  map[key] = (map[key] || 0) + value;
}

/**
 * Incrementa el contador en un mapa
 */
function incrementMap<T extends string>(
  map: Record<T, number>, 
  key: T
): void {
  map[key] = (map[key] || 0) + 1;
}

/**
 * Procesa una orden individual y actualiza los acumuladores
 */
function processOrder(
  order: Order,
  totalsByStatus: Record<string, number>,
  countByUser: Record<string, number>,
  newestOrderInfo: { date: number; id: string | null }
): void {
  const status = order.status || 'unknown';
  const userId = order.userId || 'unknown';
  
  updateMap(totalsByStatus, status, order.total!);
  incrementMap(countByUser, userId);
  
  const orderDate = Date.parse(order.createdAt || '');
  if (Number.isFinite(orderDate) && orderDate > newestOrderInfo.date) {
    newestOrderInfo.date = orderDate;
    newestOrderInfo.id = typeof order.id === 'string' ? order.id : null;
  }
}

/**
 * Inicializa el reporte con valores por defecto
 */
function initializeReport(): OrdersReport {
  return {
    totalOrders: 0,
    totalsByStatus: {},
    countByUser: {},
    newestOrderId: null
  };
}

export function groupOrdersReport(orders: Array<any>): OrdersReport {
  if (!Array.isArray(orders)) {
    throw new TypeError('orders debe ser un array');
  }

  const report = initializeReport();
  const newestOrderInfo = { date: -Infinity, id: null as string | null };

  for (const order of orders) {
    if (!isValidOrder(order)) continue;
    
    report.totalOrders++;
    processOrder(order, report.totalsByStatus, report.countByUser, newestOrderInfo);
  }

  report.newestOrderId = newestOrderInfo.id;
  return report;
}
