# Carga base 2026

Copiar aquí las plantillas de `documentacion/data/templates/` con estos nombres:

- `aptos.csv`
- `personas.example.csv` (el `personas.csv` real se crea solo en local y está ignorado por git)
- `cobranza_junio.csv`
- `gas_julio.csv`
- `locales_julio.csv`
- `egresos_julio.csv`

Periodos: la cobranza es de **junio 2026**; gas, locales, egresos e ingresos son de **julio 2026**.

Transcribir desde los escaneos `documentacion/Docs/Scaneos/Reunion 19-08/` y validar con:

```bash
node documentacion/scripts/validate-seed.mjs documentacion/data/base-2026
```

Estado: `aptos.csv`, `cobranza_junio.csv`, `gas_julio.csv`, `locales_julio.csv` y `egresos_julio.csv` transcritos. Cuadran exactamente locales (119.790,84 Bs), egresos (995.391,42 Bs / 1.088,02 USD), gas (223.512,85 Bs), pagos en Bs de cobranza (753.635,90 Bs) y cuota en USD (964,43). El validador cierra con **0 errores**, 13 cuadres y solo advertencias conocidas. Pendiente: `personas.csv` (sin datos en los escaneos), confirmar el apto 67 (no aparece en la cobranza), la clasificación banco/extemporáneo (provisional por fecha) y las diferencias de saldo del reporte (ver `documentacion/Docs/LUMA.md` §7.1). El apto 116 del gas quedó como `cuenta_por_cobrar` de forma provisional.

Correcciones aplicadas el 16/11/2026: los 5 apartamentos de planta baja pasaron a `tipo=planta_baja`; la columna `activo` se incorporó al modelo y al validador (V-08); V-01, V-02, V-03 y los ajustes de centavos quedaron declarados como excepciones toleradas en `documentacion/data/expected-base-2026.json`.

## Pendientes de validación

Lista completa en `documentacion/Docs/LUMA.md` §8.2. Resumen:

- **V-01:** confirmar el reparto banco/extemporáneo (diferencia de 11.255,68 Bs). *Tolerado provisionalmente por el validador.*
- **V-02:** confirmar si el apto 67 no tuvo recibo o falta en la cobranza. *Declarado como excepción conocida.*
- **V-03:** identificar los 3 apartamentos de gas sin fila (55 vs 58). *Advertencia del validador.*
- **V-04:** confirmar la CxC del apto 116 (4.390,03 Bs).
- **V-05:** conseguir los datos de `personas.csv`. *No disponible por ahora (16/11/2026). Usar `personas.example.csv` como plantilla; el archivo real no se versiona.*
- **V-06:** aclarar el saldo anterior del reporte (+33,70) y las diferencias de centavos.
- **V-07:** definir los ajustes P-08 de las 17 filas. *Acotados a ≤ 1,33 USD en el validador.*
- ~~**V-08:** decidir si se elimina la columna `activo` de `aptos.csv`.~~ Resuelto: se conserva y se valida como booleano.
- **V-09:** confirmar las cuotas atípicas de los aptos 48, 105, 106 y 121.
- **V-10:** confirmar las fechas con rango y la fecha real de la fila 36.

No modificar los totales de control de `documentacion/data/expected-base-2026.json` sin una decisión registrada en `documentacion/Docs/LUMA.md`.
