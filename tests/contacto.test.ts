import { describe, expect, it } from 'vitest';
import { cuerpoDelCorreo, EsquemaFormulario, erroresPorCampo } from '@/lib/contacto';

const VALIDO = {
  nombre: 'María Ruiz',
  email: 'maria@example.com',
  mensaje: 'Quiero una vela de bautizo como la BZ-B-15, para el 12 de octubre.',
  consentimiento: 'si',
};

describe('formulario de contacto', () => {
  it('acepta un mensaje con lo mínimo necesario', () => {
    expect(EsquemaFormulario.safeParse(VALIDO).success).toBe(true);
  });

  it('exige el consentimiento de datos', () => {
    const resultado = EsquemaFormulario.safeParse({ ...VALIDO, consentimiento: undefined });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(erroresPorCampo(resultado.error).consentimiento).toMatch(/permiso/i);
    }
  });

  it('rechaza un email mal escrito y lo dice en español', () => {
    const resultado = EsquemaFormulario.safeParse({ ...VALIDO, email: 'maria(at)example.com' });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(erroresPorCampo(resultado.error).email).toBe('Ese email no parece válido');
    }
  });

  it('rechaza mensajes de una palabra', () => {
    expect(EsquemaFormulario.safeParse({ ...VALIDO, mensaje: 'hola' }).success).toBe(false);
  });

  it('descarta el envío si el campo trampa viene relleno', () => {
    const resultado = EsquemaFormulario.safeParse({ ...VALIDO, trampa: 'http://spam.example' });
    expect(resultado.success).toBe(false);
  });

  it('recorta los espacios de los campos', () => {
    const resultado = EsquemaFormulario.safeParse({ ...VALIDO, nombre: '  María Ruiz  ' });
    expect(resultado.success && resultado.data.nombre).toBe('María Ruiz');
  });

  it('el correo al taller lleva los datos y omite los campos vacíos', () => {
    const cuerpo = cuerpoDelCorreo({
      nombre: 'María Ruiz',
      email: 'maria@example.com',
      telefono: '',
      interes: 'Velas de bautizo · Básicas',
      fecha: '2026-10-12',
      mensaje: 'Quiero una como la BZ-B-15.',
      consentimiento: 'si',
    });
    expect(cuerpo).toContain('Nombre: María Ruiz');
    expect(cuerpo).toContain('Le interesa: Velas de bautizo · Básicas');
    expect(cuerpo).toContain('Fecha de la celebración: 2026-10-12');
    expect(cuerpo).not.toContain('Teléfono');
  });

  it('acepta varias referencias separadas por comas', () => {
    const resultado = EsquemaFormulario.safeParse({ ...VALIDO, referencia: 'BZ-B-15,NV-03' });
    expect(resultado.success).toBe(true);
  });

  it('la referencia va en singular con una pieza y en plural con varias', () => {
    const base = {
      nombre: 'María Ruiz',
      email: 'maria@example.com',
      mensaje: 'Quiero una como la BZ-B-15.',
      consentimiento: 'si' as const,
    };

    const unaSola = cuerpoDelCorreo({ ...base, referencia: 'BZ-B-15' });
    expect(unaSola).toContain('Referencia de la pieza: BZ-B-15');

    const varias = cuerpoDelCorreo({ ...base, referencia: 'BZ-B-15,NV-03' });
    expect(varias).toContain('Referencias de las piezas: BZ-B-15, NV-03');
  });
});
