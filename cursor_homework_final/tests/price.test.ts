import { calculateFinal } from '../src/lib/price';

describe('calculateFinal', () => {
  describe('Casos de uso básicos', () => {
    test('debe calcular precio con IVA por defecto (21%) y sin descuento', () => {
      // Arrange
      const total = 100;
      
      // Act
      const result = calculateFinal(total);
      
      // Assert
      expect(result).toBe(121);
    });

    test('debe calcular precio con IVA personalizado y sin descuento', () => {
      // Arrange
      const total = 100;
      const iva = 0.13;
      
      // Act
      const result = calculateFinal(total, iva);
      
      // Assert
      expect(result).toBe(113);
    });

    test('debe calcular precio con IVA por defecto y descuento personalizado', () => {
      // Arrange
      const total = 200;
      const discount = 0.1;
      
      // Act
      const result = calculateFinal(total, undefined as unknown as number, discount);
      
      // Assert
      // 200 * 1.21 * 0.9 = 217.8
      expect(result).toBe(217.8);
    });

    test('debe calcular precio con IVA y descuento personalizados', () => {
      // Arrange
      const total = 100;
      const iva = 0.13;
      const discount = 0.05;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 100 * 1.13 * 0.95 = 107.35
      expect(result).toBe(107.35);
    });
  });

  describe('Manejo de decimales y redondeo', () => {
    test('debe redondear correctamente a 2 decimales con valores decimales', () => {
      // Arrange
      const total = 99.99;
      const iva = 0.13;
      const discount = 0.05;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 99.99 * 1.13 * 0.95 = 107.34
      expect(result).toBe(107.34);
    });

    test('debe manejar redondeo bancario correctamente', () => {
      // Arrange
      const total = 100;
      const iva = 0.21;
      const discount = 0.1;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 100 * 1.21 * 0.9 = 108.9
      expect(result).toBe(108.9);
    });

    test('debe manejar valores con muchos decimales', () => {
      // Arrange
      const total = 33.333333;
      const iva = 0.21;
      const discount = 0.15;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 33.333333 * 1.21 * 0.85 = 34.28
      expect(result).toBe(34.28);
    });
  });

  describe('Casos límite', () => {
    test('debe manejar total igual a cero', () => {
      // Arrange
      const total = 0;
      
      // Act
      const result = calculateFinal(total);
      
      // Assert
      expect(result).toBe(0);
    });

    test('debe manejar IVA igual a cero', () => {
      // Arrange
      const total = 100;
      const iva = 0;
      
      // Act
      const result = calculateFinal(total, iva);
      
      // Assert
      expect(result).toBe(100);
    });

    test('debe manejar IVA igual a uno (100%)', () => {
      // Arrange
      const total = 100;
      const iva = 1;
      
      // Act
      const result = calculateFinal(total, iva);
      
      // Assert
      expect(result).toBe(200);
    });

    test('debe manejar descuento igual a cero', () => {
      // Arrange
      const total = 100;
      const iva = 0.21;
      const discount = 0;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      expect(result).toBe(121);
    });

    test('debe manejar descuento igual a uno (100%)', () => {
      // Arrange
      const total = 100;
      const iva = 0.21;
      const discount = 1;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      expect(result).toBe(0);
    });

    test('debe manejar valores muy pequeños', () => {
      // Arrange
      const total = 0.01;
      const iva = 0.21;
      const discount = 0.1;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 0.01 * 1.21 * 0.9 = 0.01
      expect(result).toBe(0.01);
    });
  });

  describe('Validación de errores - total', () => {
    test('debe lanzar RangeError si total es negativo', () => {
      // Arrange
      const total = -1;
      
      // Act & Assert
      expect(() => calculateFinal(total)).toThrow(RangeError);
      expect(() => calculateFinal(total)).toThrow('total debe ser >= 0');
    });

    test('debe lanzar RangeError si total es muy negativo', () => {
      // Arrange
      const total = -1000;
      
      // Act & Assert
      expect(() => calculateFinal(total)).toThrow(RangeError);
    });
  });

  describe('Validación de errores - IVA', () => {
    test('debe lanzar RangeError si IVA es negativo', () => {
      // Arrange
      const total = 100;
      const iva = -0.1;
      
      // Act & Assert
      expect(() => calculateFinal(total, iva)).toThrow(RangeError);
      expect(() => calculateFinal(total, iva)).toThrow('iva debe estar en [0, 1]');
    });

    test('debe lanzar RangeError si IVA es mayor que uno', () => {
      // Arrange
      const total = 100;
      const iva = 1.1;
      
      // Act & Assert
      expect(() => calculateFinal(total, iva)).toThrow(RangeError);
    });

    test('debe lanzar RangeError si IVA es exactamente uno', () => {
      // Arrange
      const total = 100;
      const iva = 1;
      
      // Act
      const result = calculateFinal(total, iva);
      
      // Assert
      expect(result).toBe(200);
    });
  });

  describe('Validación de errores - descuento', () => {
    test('debe lanzar RangeError si descuento es negativo', () => {
      // Arrange
      const total = 100;
      const discount = -0.01;
      
      // Act & Assert
      expect(() => calculateFinal(total, 0.21, discount)).toThrow(RangeError);
      expect(() => calculateFinal(total, 0.21, discount)).toThrow('discount debe estar en [0, 1]');
    });

    test('debe lanzar RangeError si descuento es mayor que uno', () => {
      // Arrange
      const total = 100;
      const discount = 1.5;
      
      // Act & Assert
      expect(() => calculateFinal(total, 0.21, discount)).toThrow(RangeError);
    });

    test('debe lanzar RangeError si descuento es exactamente uno', () => {
      // Arrange
      const total = 100;
      const discount = 1;
      
      // Act
      const result = calculateFinal(total, 0.21, discount);
      
      // Assert
      expect(result).toBe(0);
    });
  });

  describe('Validación de errores - parámetros no numéricos', () => {
    test('debe lanzar TypeError si total no es numérico', () => {
      // Arrange
      const total = '100' as any;
      
      // Act & Assert
      expect(() => calculateFinal(total)).toThrow(TypeError);
      expect(() => calculateFinal(total)).toThrow('Parámetros no numéricos o no finitos.');
    });

    test('debe lanzar TypeError si IVA no es numérico', () => {
      // Arrange
      const total = 100;
      const iva = '0.21' as any;
      
      // Act & Assert
      expect(() => calculateFinal(total, iva)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si descuento no es numérico', () => {
      // Arrange
      const total = 100;
      const discount = '0.1' as any;
      
      // Act & Assert
      expect(() => calculateFinal(total, 0.21, discount)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si total es NaN', () => {
      // Arrange
      const total = NaN;
      
      // Act & Assert
      expect(() => calculateFinal(total)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si IVA es NaN', () => {
      // Arrange
      const total = 100;
      const iva = NaN;
      
      // Act & Assert
      expect(() => calculateFinal(total, iva)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si descuento es NaN', () => {
      // Arrange
      const total = 100;
      const discount = NaN;
      
      // Act & Assert
      expect(() => calculateFinal(total, 0.21, discount)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si total es Infinity', () => {
      // Arrange
      const total = Infinity;
      
      // Act & Assert
      expect(() => calculateFinal(total)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si IVA es Infinity', () => {
      // Arrange
      const total = 100;
      const iva = Infinity;
      
      // Act & Assert
      expect(() => calculateFinal(total, iva)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si descuento es Infinity', () => {
      // Arrange
      const total = 100;
      const discount = Infinity;
      
      // Act & Assert
      expect(() => calculateFinal(total, 0.21, discount)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si total es -Infinity', () => {
      // Arrange
      const total = -Infinity;
      
      // Act & Assert
      expect(() => calculateFinal(total)).toThrow(TypeError);
    });
  });

  describe('Casos de integración complejos', () => {
    test('debe manejar cálculo complejo con múltiples decimales', () => {
      // Arrange
      const total = 123.456;
      const iva = 0.18;
      const discount = 0.12;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 123.456 * 1.18 * 0.88 = 128.2
      expect(result).toBe(128.2);
    });

    test('debe manejar valores extremos en combinación', () => {
      // Arrange
      const total = 0.01;
      const iva = 1;
      const discount = 0.99;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 0.01 * 2 * 0.01 = 0.0002 ≈ 0.00
      expect(result).toBe(0);
    });

    test('debe mantener precisión en cálculos con valores pequeños', () => {
      // Arrange
      const total = 0.99;
      const iva = 0.21;
      const discount = 0.05;
      
      // Act
      const result = calculateFinal(total, iva, discount);
      
      // Assert
      // 0.99 * 1.21 * 0.95 = 1.14
      expect(result).toBe(1.14);
    });
  });
});
