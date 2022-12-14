# Microfrontends - Punto de partida

## Prerequisitos

- 馃洃 **IMPORTANTE**: Antes de comenzar, debemos asegurarnos de utilizar versi贸n de `node` moderna. Realizaremos el empaquetado mediante `webpack v5` que a su vez requiere `node` por encima de la versi贸n 10.13.0, pero es recomendable, por rendimiento, usar v12 en adelante.

  O bien hacemos una instalaci贸n fresca, o bien, si estamos usando `nvm` como gestor de `node` en nuestra m谩quina, cambiamos con:

  ```text
  nvm use 12.x.x
  ```

  Si no actualizamos `node` es probable que veamos el siguiente error:

  > SyntaxError: Invalid regular expression: /(\p{Uppercase_Letter}+|\p{Lowercase_Letter}|\d)(\p{Uppercase_Letter}+)/: Invalid escape

- Debemos instalar las dependencias de los 3 subproyectos:

  `[app]`
  `[microapp-clock]`
  `[microapp-quote]`

  ```text
  npm i
  ```

## De un vistazo

Nuestro ejemplo de partida se divide en 3 subprojectos o m贸dulos, cada uno de ellos siendo una aplicaci贸n en si misma, que ser谩n integrados en _run-time_ utilizando _vanilla_ JS:

- `app`: Se trata de la aplicaci贸n _host_ o principal. Su implementaci贸n es muy sencilla: emula un simple _dashboard_ cuya misi贸n ser谩 mostrar 2 _widgets_. Estos _widgets_ ser谩n implementados usando microfrontends. La responsabilidad principal de esta aplicaci贸n contenedora ser谩 la de orquestar los microfrontends, es decir, descargarlos y renderizarlos.
- `microapp-clock`: Microfrontend/microapp o simplemente aplicaci贸n que muestra la fecha y hora actuales seg煤n el _locale_ del navegador.
- `microapp-quote`: Microfrontend/microapp o simplemente aplicaci贸n que muestra, mediante APIs REST gratuitas, una cita famosa, su autor y una im谩gen de fondo aleatoria.

## Microfrontends - Configuraci贸n dual de webpack

Para cada microfrontend, hemos establecido una doble configuraci贸n de webpack:

```text
[INSPECCIONAR] microapp-clock/config
```

Cada configuraci贸n se obtiene mediante la mezcla de varios ficheros que contienen todos los settings necesarios. Esta estrategia de separar en ficheros comunes permite eliminar la redunancia de c贸digo. Adem谩s, cada configuraci贸n tendr谩 su variante `dev` o `prod`, seg煤n si hacemos target para desarrollo o producci贸n:

- Configuraci贸n **microfrontend**: `common.js` + `microfrontend.js` + `webpack.microfrontend.<dev|prod>.js`.
- Configuraci贸n **standalone**: `common.js` + `standalone.js` + `webpack.standalone.<dev|prod>.js`

La idea detr谩s de esta configuraci贸n dual es poder cubrir las dos fases principales en el ciclo de vida de un microfrontend:

1. Durante la **fase de desarrollo**, nos interesa poder levantar nuestro microfrontend como una aplicaci贸n _standalone_, totalmente independiente del resto, sin necesidad de acceder a el a trav茅s de la aplicaci贸n _host_ (es decir, sin necesidad de que est茅 integrado). Y eso es posible, ya que un microfrontend no deja de ser una aplicaci贸n web (de funcionalidad m谩s reducida eso si).

2. En el momento de una **_release_** y/o **despliegue**, empaquetaremos toda la aplicaci贸n con sus assets y recursos necesarios en un 煤nico bundle\*\*, como si de una librer铆a se tratara, con la diferencia de que ser谩 consumido en tiempo real por la aplicaci贸n _host_.

> \**Nota: Esta estrategia de generar un paquete 煤nico (1 microfrontend = 1 bundle), no es estrictamente necesaria, pero conceptualmente nos ayuda a mantener cierto orden entre todos los microfrontends, a su gesti贸n (sobre todo cuando se tienen muchos) y a facilitar su descarga por la aplicaci贸n *host*. Si se quiere optimizar al m谩ximo el consumo de los microfrontends, tambi茅n pueden subdividirse e incluso compartir dependencias. Esto es algo que se est谩 explorando en la actualidad con la feature de webpack 5 llamada *module federation\*.

Aunque esta separaci贸n dual no es estrictamente necesaria, a nosotros nos permite poder hacer ajustes finos a cada _setup_ y nos ayuda a separar responsabilidades. De hecho:

- El setup **_standalone_** se encargar谩 de:

  - Configurar el servidor de desarrollo de webpack.
  - A帽adir los source mapping para posibles depuraciones (en modo dev).
  - Y, muy importante, generar el `index.html` necesario para poder levantar nuestro microfrontend de forma aut贸noma.

  Este setup tendr谩 un punto de entrada espec铆fico en c贸digo que llamaremos `standalone.entrypoint.tsx`.

- El setup **microfrontend**, por su lado:

  - Se centra en generar un bundle 煤nico, empaquetado en modo librer铆a.
  - Embebe recursos si es necesario.

  No hay necesidad de generar ning煤n `index.html` puesto que ser谩 la aplicaci贸n _host_ quien lo provea. El punto de entrada para esta configuraci贸n ser谩 `microfrontend.entrypoint.tsx`.

Dispondremos adem谩s de sus correspondientes _scripts_ en el `package.json` para lanzar una _build_ en modo microfrontend (con la intenci贸n de hacer un despliegue) o arrancar nuestro servidor de desarrollo (para el d铆a a d铆a del equipo que trabaje con el).

## Microfrontends - Puntos de entrada duales

Tal y como se puede intuir del apartado anterior, necesitamos tener un _entrypoint_ dual en nuestra aplicaci贸n acorde a las dos configuraciones anteriores de webpack.

### 1) `microfrontend.entrypoint.tsx`

```text
[INSPECCIONAR] microfrontend.entrypoint.tsx
```

Recordemos que la misi贸n del setup microfrontend, no es arrancar el propio microfrontend sino empaquetarlo para ser consumido por una aplicaci贸n _host_. Por lo tanto, en este _entrypoint_ debemos plantearnos:

- 驴Qu茅 queremos exportar hacia afuera en nuestro _bundle_?
- 驴C贸mo queremos que la aplicaci贸n o aplicaciones _host_ consuman nuestros microfrontends?

En resumidas cuentas, tenemos que definir la 'carcasa' de nuestro microfrontend. Es decir, tenemos que ofrecer una interfaz gen茅rica y sencilla que permita a las aplicacion(es) \_host renderizar los microfrontends.

Aqui hay diversas soluciones, una de ellas podr铆a haber sido el empleo de _web components_ como envoltura de los microfrontends.

En nuestro caso, nos hemos inclinado por utilizar una simple API con 2 funciones, que ser谩n llamadas por la aplicaci贸n _host_ cuando lo precise:

- `render`: para 'pintar' el microfrontend.
- `unmount`: para desmontarlo.

En ambos casos, sera la aplicaci贸n _host_ quien provea el container (nodo del DOM de su propiedad) donde debe renderizarse o desmontarse el microfrontend. Esta API estar谩 escrita en _vanilla_ JS, y por tanto es una soluci贸n sencilla con importantes ventajas:

- Compatibilidad total.
- 100% flexible y customizable.

Eso si, es nuestra responsabilidad mantener esta interfaz, con lo que ello supone: garantizar que se cumple en todos los microfrontends, compatibilidad hacia atr谩s, evitar _breaking changes_, etc.

LLeg贸 el momento de probar esta configuraci贸n. Lancemos una build:

`[microapp-clock]`
`[microapp-quote]`

```text
npm run build:microfrontend:dev
```

```text
[INSPECCIONAR] build/microapp/report/report.html
```

### 2) `standalone.entrypoint.tsx`

Durante el ciclo de desarrollo ser谩 conveniente poder levantar nuestro microfrontend de forma independiente, o sea, sin necesidad de integrarlo con la aplicaci贸n _host_ 驴Qu茅 necesitamos? Pues lo m谩s sencillo ser谩 consumir y llamar al interfaz que se expone en `microfrontend.entrypoint.tsx`.

Es decir, emularemos lo que har铆a la aplicaci贸n _host_ real mediante una aplicaci贸n _host_ de mentira (o _mock_) cuya misi贸n es proporcionar un `index.html` b谩sico en donde poder renderizar el microfrontend.

```text
[INSPECCIONAR] standalone.entrypoint.tsx
```

En resumen, nuestro _standalone.entrypoint_ ser谩 algo tan sencillo como importar y ejecutar el m茅todo `render` del interfaz de nuestro microfrontend, pas谩ndole un nodo container improvisado (`id=root`) en un `index.html` hecho a tal fin.

Recordemos, ser谩 el _setup_ **standalone** de webpack quien ponga en marcha el servidor de desarrollo y lo alimentar谩 con un `index.html` que generar谩 usando como plantilla el `index.html` que encontramos en el c贸digo fuente.

`[microapp-clock]`
`[microapp-quote]`

鉁? **CHECKPOINT**: Probemos a arrancar nuestros microfrontends:

```text
npm start
```

## Aplicaci贸n _host_

Nuestra aplicaci贸n _host_ de partida no es m谩s que un sencillo componente a modo de _dashboard_ que utilizaremos para alojar los microfrontends anteriores.

`[app]`

鉁? **CHECKPOINT**: Probemos la aplicaci贸n _host_

```text
npm start
```

En el siguiente ejercicio implementaremos una soluci贸n para integrar en _runtime_ dichos microfrontends.
