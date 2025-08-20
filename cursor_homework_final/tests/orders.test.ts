import { groupOrdersReport } from '../src/lib/orders';

describe('groupOrdersReport', () => {
  test('debe generar reporte correcto con órdenes válidas', () => {
    // Arrange
    const orders = [
      {
        id: 'order1',
        userId: 'user1',
        status: 'paid',
        total: 100,
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        id: 'order2',
        userId: 'user1',
        status: 'pending',
        total: 50,
        createdAt: '2024-01-02T10:00:00Z'
      },
      {
        id: 'order3',
        userId: 'user2',
        status: 'paid',
        total: 75,
        createdAt: '2024-01-03T10:00:00Z'
      }
    ];

    // Act
    const result = groupOrdersReport(orders);

    // Assert
    expect(result).toEqual({
      totalOrders: 3,
      totalsByStatus: {
        paid: 175,
        pending: 50
      },
      countByUser: {
        user1: 2,
        user2: 1
      },
      newestOrderId: 'order3'
    });
  });

  test('debe manejar órdenes inválidas correctamente', () => {
    // Arrange
    const orders = [
      { id: 'order1', total: 100 },
      null,
      { id: 'order2', total: 'invalid' },
      { id: 'order3', total: 50 },
      undefined
    ];

    // Act
    const result = groupOrdersReport(orders);

    // Assert
    expect(result.totalOrders).toBe(2);
    expect(result.totalsByStatus).toEqual({
      unknown: 150
    });
    expect(result.countByUser).toEqual({
      unknown: 2
    });
  });

  test('debe lanzar TypeError si orders no es un array', () => {
    // Act & Assert
    expect(() => groupOrdersReport(null as any)).toThrow(TypeError);
    expect(() => groupOrdersReport('not an array' as any)).toThrow(TypeError);
    expect(() => groupOrdersReport(123 as any)).toThrow(TypeError);
  });
});
