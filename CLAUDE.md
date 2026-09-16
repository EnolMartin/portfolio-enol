# Portfolio de Enol Martín García

Web personal de un desarrollador full stack, presentada como una tablet retrofuturista apoyada en una habitación a oscuras. Toda la navegación ocurre dentro de la pantalla del aparato, que se comporta como un tubo de rayos catódicos.

El documento completo de decisiones está en `docs/especificaciones.md`. Este archivo contiene solo las reglas que hay que obedecer al escribir código.

---

## Reglas duras

Estas no se negocian. Si una tarea parece exigir romper una, para y pregunta.

1. **Ningún texto visible escrito dentro de un componente.** Todo string que vea el usuario sale de `content/dictionaries/` o de un MDX. Sin excepciones, ni siquiera para un "cargando" o un `aria-label`.
2. **Ningún color fuera de los tokens.** Nada de `#hex`, `rgb()` ni clases de color arbitrarias en componentes. Solo variables CSS definidas por el director de arte.
3. **Solo `transform` y `opacity` en animaciones.** Nada que provoque layout o paint: ni `width`, ni `top`, ni `filter` animado, ni `box-shadow` animado.
4. **Cero librerías de animación.** Ni Motion, ni GSAP, ni equivalentes. CSS y la View Transitions API bastan.
5. **Ningún lienzo de tamaño fijo.** La pantalla pasa de apaisada a vertical. Nada de `width: 1024px` ni posiciones absolutas calculadas sobre medidas fijas.
6. **Nada de `<canvas>` para el grano ni las scanlines.** Son CSS: gradientes repetidos o una textura diminuta en mosaico.
7. **HTML semántico bajo la metáfora.** `nav`, `main`, `article`, encabezados en orden. Un lector de pantalla tiene que poder leer la web como si la tablet no existiera.
8. **Nada de imágenes para la carcasa.** Bisel, tornillos, LED y rejilla se construyen con gradientes, bordes y sombras en CSS.
9. **Sin `localStorage` para estado de aplicación.** Solo para la preferencia de sonido y el flag de "ya ha arrancado en esta sesión", siempre dentro de `try/catch`.

---

## Stack

- Next.js, App Router, TypeScript estricto.
- Tailwind para maquetación; CSS propio en `styles/crt.css` para todo lo relacionado con el tubo.
- Sin CMS. Sin librería de i18n: el enrutado bilingüe es propio.
- Despliegue en Vercel. Analítica de Vercel, nada más.

---

## Estructura

```
app/
  [locale]/
    layout.tsx              carcasa, escena, arranque
    page.tsx                portada: nombre, rol, intro, nav
    [section]/page.tsx      sobre-mi | proyectos | trayectoria | contacto
    proyectos/[slug]/       fichas de proyecto (ruta localizada)
components/
  device/                   carcasa, bisel, LED, rejilla, tornillos, escena
  crt/                      arranque, corte CRT, typewriter, scanlines
  sections/                 las cuatro pantallas
  ui/                       primitivas compartidas
content/
  dictionaries/es.ts        textos de interfaz en español
  dictionaries/en.ts        textos de interfaz en inglés
  projects/*.es.mdx         fichas de proyecto
  projects/*.en.mdx
lib/
  routes.ts                 mapa de rutas localizadas
  dictionary.ts             carga tipada de diccionarios
styles/
  tokens.css                variables: grises, tipografía, espaciado
  crt.css                   scanlines, grano, parpadeo, colapso
docs/
  especificaciones.md
```

---

## Enrutado bilingüe

Las rutas van traducidas, no solo prefijadas. El mapa vive en `lib/routes.ts`:

| Sección | Español | Inglés |
|---|---|---|
| Portada | `/es` | `/en` |
| Sobre mí | `/es/sobre-mi` | `/en/about` |
| Proyectos | `/es/proyectos` | `/en/projects` |
| Trayectoria | `/es/trayectoria` | `/en/experience` |
| Contacto | `/es/contacto` | `/en/contact` |

Reglas:

- Todas las combinaciones se generan estáticamente con `generateStaticParams`. Nada se renderiza en petición.
- Un `[section]` que no esté en el mapa devuelve 404. No inventes rutas.
- Cada página declara `alternates.languages` en `generateMetadata` para que el `hreflang` sea correcto.
- `/` redirige según `Accept-Language`, con español por defecto.

---

## Tipado del contenido

`es.ts` es la fuente de verdad. `en.ts` se tipa contra ella:

```ts
export type Dictionary = typeof es;
export const en: Dictionary = { ... };
```

Así, una clave añadida en español que falte en inglés rompe la compilación. Es intencionado: no lo relajes con `Partial` ni con índices laxos.

---

## Accesibilidad

- El contraste se mide **con las scanlines aplicadas**, no sobre el fondo limpio.
- El parpadeo del tubo se queda por debajo de tres destellos por segundo.
- Sin color disponible, los estados se distinguen por inversión de vídeo, corchetes, cursor de bloque o subrayado grueso. Nunca solo por opacidad.
- `:focus-visible` siempre visible y nunca eliminado.
- `prefers-reduced-motion` desactiva arranque, corte CRT, typewriter y parpadeo. El contenido aparece directamente.

---

## Rendimiento

Objetivo: 100 en las cuatro categorías de Lighthouse, verificado en CI.

### Presupuesto de peso

Límites duros, comprimidos, para la primera carga de cualquier ruta. Se fijan ahora, cuando el proyecto no pesa nada, porque un límite puesto al final siempre encuentra algo que ya no se puede quitar.

| Recurso | Límite |
|---|---|
| JavaScript | 110 KB |
| CSS | 15 KB |
| Fuentes (las dos familias) | 45 KB |
| **Total de primera carga** | **180 KB** |
| Sonidos, los tres juntos | 40 KB |
| Cada captura de proyecto | 150 KB |

Notas sobre el presupuesto:

- Los sonidos **no cuentan en la primera carga porque no se precargan**. Se piden después del clic de encendido. Si los precargas, pagas peso por algo que quizá nadie llegue a oír.
- Las capturas de proyecto no cuentan en la primera carga: van diferidas salvo la primera visible de la ficha.
- La analítica de Vercel sí cuenta. Mide siempre con ella puesta, no sin ella.
- Si un cambio necesita cruzar un límite, no lo cruces: para y pregunta. Casi siempre hay otra forma.

### Reglas

- El HTML se sirve completo desde el primer byte. El arranque es una capa superpuesta que se retira, nunca un bloqueo del contenido.
- Fuentes con `next/font`, subsetting a caracteres latinos, `display: swap`. Dos familias sin subsetting son cien kilobytes; con subsetting son veinte.
- Ninguna imagen en la carcasa ni en la escena.
- Las capturas de proyecto usan `next/image` con dimensiones explícitas para no provocar CLS.

---

## Sonido

Tres sonidos: interruptor, zumbido del tubo y tecleo. Reglas:

- Solo se inicializa el audio tras el clic de encendido. Nunca antes: los navegadores lo bloquean y el interruptor mentiría.
- Interruptor de silencio visible siempre y accesible por teclado.
- La preferencia se guarda en `localStorage` dentro de `try/catch`.
- Volumen bajo. El tecleo es sutil y no suena un clic por cada carácter.

---

## Estilo de código

El objetivo es que el repositorio se lea como escrito por una persona. El código generado no se delata por ser malo, sino por ser uniforme.

**Comentarios.** Comenta el *por qué*, nunca el *qué*. `// inicializa el estado del audio` sobra, porque la línea siguiente ya lo dice. Lo que sí merece comentario son las decisiones que costaron pensar y que alguien podría deshacer por error:

```ts
// El fósforo no llega a blanco puro: #fff delata pantalla moderna.
// La velocidad va por carácter, no por duración: el español ocupa ~20% más que el inglés.
// El audio no se inicializa antes del clic de encendido porque el navegador lo bloquea.
```

Si un archivo no tiene ninguna decisión de ese tipo, no lleva comentarios. Es correcto.

**Prohibido:**

- JSDoc en funciones internas que no lo necesitan.
- `try/catch` alrededor de código que no puede fallar.
- Ayudantes de tres líneas usados una sola vez. Si se usa una vez, va en línea.
- Abstracciones preparadas para casos que no existen.
- Carpetas `utils` que acumulan funciones sin relación entre sí.
- Comentarios de cabecera describiendo lo que hace el archivo.

**Sobre la uniformidad.** No fuerces que todo tenga la misma forma. Una función puede tener tres líneas y la siguiente cuarenta si el problema lo pide. Deja `TODO` cuando de verdad haya algo pendiente: un repositorio real los tiene.

---

## Git

- Un commit por tarea. Cada commit deja el repositorio funcionando.
- Ramas por funcionalidad. Sin squash al fusionar.
- Nunca hagas `push` sin que te lo pidan. Nunca reescribas historial.

### Mensajes

En español, en imperativo, sin prefijos. Nada de `feat:`, `fix:`, `chore:` ni etiquetas entre corchetes.

**Cuando el cambio responde a algo observado, dilo.** Es lo que distingue un historial real de uno generado:

```
Baja la opacidad de las scanlines, no pasaba contraste
Revierte el barrido del corte, mareaba a pantalla completa
Calcula la velocidad del typewriter por carácter, el inglés iba atropellado
```

**Varía la longitud.** Un cambio obvio lleva cuatro palabras; uno que necesita justificarse lleva una línea más en el cuerpo. Que todos los mensajes midan lo mismo es la señal más reconocible de un historial automático.

```
Añade el LED al bisel
Ajusta el LED: parpadea durante el arranque y queda fijo al terminar
Corrige el foco en el contenedor con scroll
```

**Prohibido:**

- Imitar descuido a propósito: faltas, minúsculas forzadas, abreviaturas raras. No suena a persona, suena a disfraz.
- Mensajes que describen el archivo en vez del cambio: "actualiza tokens.css".
- Mensajes genéricos: "mejoras varias", "ajustes", "actualiza contenido".
- Cuerpos largos enumerando cada archivo tocado. Eso ya está en el diff.

Propón el mensaje y espera la aprobación antes de hacer commit.

---

## Cómo trabajar

- Si falta una decisión, pregunta. No la inventes y la documentes como si estuviera acordada.
- No amplíes el encargo. Si te piden el LED, haz el LED.
- No añadas dependencias sin permiso explícito.
- No escribas comentarios que repitan lo que dice el código.
- No generes README largos, tablas decorativas ni emojis en la documentación.
