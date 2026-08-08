'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { enviarFormulario, type EstadoEnvio } from './acciones';
import { IconoWhatsapp } from '@/components/iconos';
import { SelectorPieza, interesDePieza, type PiezaSelector } from '@/components/contacto/selector-pieza';
import { mailtoUrl, site, whatsappUrl } from '@/lib/site';
import { clasesBoton, cx } from '@/lib/ui';

const INICIAL: EstadoEnvio = { estado: 'inicial' };

export function FormularioContacto({
  interesInicial,
  referenciaInicial,
  piezas,
  opciones,
}: {
  interesInicial?: string;
  referenciaInicial?: string;
  piezas: PiezaSelector[];
  opciones: string[];
}) {
  const [estado, accion, enviando] = useActionState(enviarFormulario, INICIAL);
  // Controlado (no defaultValue) porque tiene que poder cambiar solo cuando
  // se elige una foto en el selector de abajo, sin esperar a un reenvío.
  const [interes, setInteres] = useState(interesInicial ?? '');

  if (estado.estado === 'ok') {
    return (
      <div className="rounded-pieza border border-gold/60 bg-cream/60 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-verde">Mensaje enviado</p>
        <p className="mt-3 text-ink-soft">
          Gracias por escribirnos. Te contestamos al correo que nos has dejado, normalmente en menos
          de 48 h.
        </p>
        <p className="mt-6 text-sm text-ink-soft">
          Si tienes prisa, escríbenos también por WhatsApp al{' '}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className="text-ink underline decoration-gold underline-offset-4"
          >
            {site.whatsappVisible}
          </a>
          .
        </p>
      </div>
    );
  }

  const errores = estado.estado === 'error' ? (estado.errores ?? {}) : {};

  return (
    <form action={accion} className="space-y-5" noValidate>
      {/* Aviso cuando el correo no está configurado: en vez de fingir que se ha
          enviado (lo que hacía la web anterior), se dice qué pasa y por dónde
          escribir. */}
      {estado.estado === 'sin-configurar' && (
        <div className="rounded-xl border border-terracotta/40 bg-terracotta/5 p-4 text-sm">
          <p className="font-medium text-ink">El envío por correo aún no está activado.</p>
          <p className="mt-1 text-ink-soft">
            Tu mensaje no se ha enviado. Copia lo que has escrito y mándanoslo por WhatsApp o por
            correo; los dos llegan igual de bien.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
              target="_blank"
              rel="noopener"
              className={clasesBoton('whatsapp', 'px-5 py-2.5')}
            >
              <IconoWhatsapp className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={mailtoUrl('Consulta desde la web')}
              className={clasesBoton('secundario', 'px-5 py-2.5')}
            >
              {site.email}
            </a>
          </div>
        </div>
      )}

      {estado.estado === 'error' && (
        <p
          role="alert"
          className="rounded-xl border border-terracotta/40 bg-terracotta/5 p-4 text-sm text-ink"
        >
          {estado.mensaje}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Nombre" nombre="nombre" error={errores.nombre} requerido />
        <Campo etiqueta="Email" nombre="email" tipo="email" error={errores.email} requerido />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          etiqueta="Teléfono (opcional)"
          nombre="telefono"
          tipo="tel"
          error={errores.telefono}
        />
        <Campo
          etiqueta="Fecha de la celebración (opcional)"
          nombre="fecha"
          tipo="date"
          error={errores.fecha}
        />
      </div>

      <div>
        <label htmlFor="interes" className="block text-sm text-ink-soft">
          Qué te interesa
        </label>
        <select
          id="interes"
          name="interes"
          value={interes}
          onChange={(e) => setInteres(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-sand bg-white-warm px-4 py-3 text-ink"
        >
          <option value="">Todavía no lo sé</option>
          {opciones.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </div>

      <SelectorPieza
        piezas={piezas}
        valorInicial={referenciaInicial}
        interesSeleccionado={interes}
        onElegir={(pieza) => setInteres(interesDePieza(pieza))}
      />

      <div>
        <label htmlFor="mensaje" className="block text-sm text-ink-soft">
          Cuéntanos tu idea <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
          aria-invalid={errores.mensaje ? true : undefined}
          className={cx(
            'mt-1.5 w-full rounded-xl border bg-white-warm px-4 py-3 text-ink',
            errores.mensaje ? 'border-terracotta' : 'border-sand',
          )}
        />
        {errores.mensaje && (
          <p id="error-mensaje" className="mt-1.5 text-sm text-terracotta">
            {errores.mensaje}
          </p>
        )}
      </div>

      {/* Campo trampa para robots: oculto para las personas, invisible también
          para los lectores de pantalla. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="trampa">No rellenar</label>
        <input id="trampa" name="trampa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="consentimiento"
            value="si"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-ink"
          />
          <span>
            Acepto que Arte y Cera use mis datos para responderme.{' '}
            <Link
              href="/privacidad"
              className="text-ink underline decoration-gold underline-offset-4"
            >
              Cómo tratamos tus datos
            </Link>
            .
          </span>
        </label>
        {errores.consentimiento && (
          <p className="mt-1.5 text-sm text-terracotta">{errores.consentimiento}</p>
        )}
      </div>

      <button type="submit" disabled={enviando} className={clasesBoton('primario', 'w-full')}>
        {enviando ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      <p className="text-center text-xs text-ink-soft">
        {site.tiempoRespuesta}. También puedes escribirnos por WhatsApp al {site.whatsappVisible}.
      </p>
    </form>
  );
}

function Campo({
  etiqueta,
  nombre,
  tipo = 'text',
  error,
  requerido,
}: {
  etiqueta: string;
  nombre: string;
  tipo?: string;
  error?: string;
  requerido?: boolean;
}) {
  const idError = `error-${nombre}`;
  return (
    <div>
      <label htmlFor={nombre} className="block text-sm text-ink-soft">
        {etiqueta} {requerido && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        autoComplete={nombre === 'email' ? 'email' : nombre === 'telefono' ? 'tel' : 'name'}
        className={cx(
          'mt-1.5 w-full rounded-xl border bg-white-warm px-4 py-3 text-ink',
          error ? 'border-terracotta' : 'border-sand',
        )}
      />
      {error && (
        <p id={idError} className="mt-1.5 text-sm text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}
