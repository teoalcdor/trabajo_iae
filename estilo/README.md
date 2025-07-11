# 📘 Manual - Conector IDS 📘
Vamos a usar la implementación que podemos encontrar en [este](https://github.com/International-Data-Spaces-Association/DataspaceConnector) repositorio de GitHub. La principal ventaja de esta es su amplia documentación, tanto del conector en sí como de conceptos relacionados con los Espacios de Datos. A este respecto, se recomienda leer su [documentación](https://international-data-spaces-association.github.io/DataspaceConnector/). Su mayor defecto es que, desde el 2023, no está activamente mantenido, aunque se busca nuevo personal que lo mantenga.  

Se ofrecen `prueba_ejemplo.txt`, donde se puede ver un ejemplo de las llamadas a la API que hay que realizar y `prueba_ejecutable.sh`, que permite, uan vez hecho el despliegue en el puerto 8080 como se muestra más abajo, ejecutar un ejemplo que nos haga toda la parte de compartir datos, de forma que solo reste explorar el catálogo y negociar el contrato. Se puede personalizar el ejemplo cambiando, por ejemplo, el enlace de los datos para hacer, si corresponde, un ejemplo más complicado en el que se compartan datos desde otras fuentes.

## 🚀 Despliegue
Para el despliegue hay dos opciones principalmente. O bien podemos simplemente hacer:

```commandline
docker run -p 8080:8080 --name connector ghcr.io/international-data-spaces-association/dataspace-connector:latest
```

O bien se puede intentar clonar el repositorio y usar el fichero docker-compose.yaml. A nosotros esta segunda opción no nos ha funcionado. Se pueden también hacer otro tipo de despliegues, como viene [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/GettingStarted).

Una vez todo esté listo y corriendo, el conector lo encontraremos aquí [https://localhost:8080/](https://localhost:8080/). La API está en [https://localhost:8080/api](https://localhost:8080/api). Y la UI Swagger para manejar la API de forma más sencilla está en [https://localhost:8080/api/docs](https://localhost:8080/api/docs). Nosotros usaremos esta última. Por defecto, pedirá usuario y contraseña, que serán, respectivamente, `admin` y `password`.

## 🧭 Indicaciones Generales
Para seguir mejor los dos puntos subsiguientes, es muy útil estar familiarizado con el [modelo de datos del conector](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/DataModel), que se basa en el IDS Infomodel. 

Como patrón general en la API, las peticiones POST de la forma `/api/<entidad>` vienen a crear esta entidad. En estas peticiones, el cuerpo de la petición será un JSON con los diferentes atributos. Por otra parte, las peticiones POST de la forma `/api/<entidad_1>/{id}/<entidad_2>` añaden a la `<entiedad_1>` con Id `{id}` la `<entidad_2>`. En ellas, el cuerpo es una lista de cadenas con las direcciones de la entidad o entidades a añadir (por ejemplo, ["https://localhost:8080/api/rules/9c8c43ed-5ea9-45ac-813f-a14804dd8791", "https://localhost:8080/api/rules/8shjkc34hkj-45ac-813f-a14804dd8791"]).

Todas las entidades del modelo de datos tienen una serie de atributos, que encontramos [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/DataModel).

## 🔄 Compartir y Reclamar Datos
### 📤 Compartir Datos Mediante el Conector IDS
Esta sección se basa en [este](https://international-data-spaces-association.github.io/DataspaceConnector/CommunicationGuide/v6/Provider) tutorial. Siguiendo el modelo de datos, creamos primero una oferta de un recurso. Para ello nos vamos a `POST /api/offers` e introducimos en el cuerpo de la petición algo como:

```commandline
{
  "title": "Sample Resource",
  "description": "This is an example resource containing weather data.",
  "keywords": [
    "weather",
    "data",
    "sample"
  ],
  "paymentModality": "fixedPrice",
  "publisher": "https://openweathermap.org/",
  "language": "EN",
  "license": "http://opendatacommons.org/licenses/odbl/1.0/",
  "sovereign": "https://openweathermap.org/",
  "endpointDocumentation": "https://example.com",
  "key": "value"
}
```

Esto dará lugar a un mensaje de la forma:

```commandline
 cache-control: no-cache,no-store,max-age=0,must-revalidate  
 connection: keep-alive  
 content-type: application/hal+json  
 date: Tue,08 Jul 2025 06:39:52 GMT  
 expires: 0  keep-alive: timeout=60  
 location: https://localhost:8080/api/offers/26456e2f-2f7a-486b-b206-955aa55c7133  
 pragma: no-cache  
 strict-transport-security: max-age=31536000 ; includeSubDomains  
 transfer-encoding: chunked  
 x-content-type-options: nosniff  
 x-frame-options: DENY 
 x-xss-protection: 1; mode=block 
```
Donde en `location` podemos ver donde alojamos la entidad, en el caso del ejemplo en `https://localhost:8080/api/offers/26456e2f-2f7a-486b-b206-955aa55c7133`. Aquí, 26456e2f-2f7a-486b-b206-955aa55c7133 es la id de la entidad, y lo que hay que poner como id de la entidad padre (a la que añadimos otras entidades) en las llamadas de la forma `/api/<entidad_1>/{id}/<entidad_2>`, en su respectivo hueco de la UI.

Siguiendo esto, vamos creando y enlazando las distintas entidades hasta completar el esquema del [modelo de datos](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/DataModel). De esta forma:
* Añadimos el recurso ofrecido al catálogo
* Añadimos la representación al recurso ofrecido
* Añadimos el artefacto a la representación
* Añadimos el contrato al recurso ofrecido
* Añadimos las reglas al contrato

Debemos tener en cuenta que para que un recurso que ofrecemos se considere completo y pueda ser listado en el catálogo, ha de tener una representación con, al menos, un artefacto y un contrato con, al menos una regla. Haremos incapié en añadir datos al artefacto y en las reglas, por ser de especial importancia y algo diferentes a lo ya visto. Sí adevertimos de que **si no estamos dentro de las fechas de inicio y fin de un contrato, al negociar el contrato nos saltará un error 417 por no encontrarlo**.

#### 📦 Artifact + Datos
Una vez creado el artefacto mediante `POST /api/artifacts` habrá que añadirle datos. A diferencia de lo que se dice en la documentación, no podemos añadir los datos en le cuerpo de `POST /api/artifacts/{id}/data`. En su lugar lo hacemos mediante una petición de tipo PUT, con `PUT /api/artifacts/{id}/data`. Subiemos a ella los datos a aportar. Si se quisiese retribuir datos de una base de datos PostgreSQL, creemos que se puede hacer mediante el uso del atributo `accessURL` de los datos del artefacto. Este se explica [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/CommunicationGuide/v6/Provider), en Add Data.

#### 📜 Rules + Usage Policies
Se crean con `POST /api/rules`. En el atributo `value` debe hubicarse la política de uso. Esto se indica [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/CommunicationGuide/v6/Provider), sin embargo, no se especifica cómo han de enlazarse estas políticas. Como es difícil crear una política de este estilo, existe una herramienta que las crea dentro de la API. Su uso se especifica [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/UsageControl#example-endpoint). Para asignar la regla a `value` bastará con copiar la relga, escaparla (especialmente las ") y poner como valor el JSON de la regla como cadena escapada.

### 📥 Obtención de Datos
Para esta sección nos basamos en [esta sección](https://international-data-spaces-association.github.io/DataspaceConnector/CommunicationGuide/v6/Consumer). 

#### 🔍 Exploración de Datos
Para consultar los catálogos, nos vamos a `POST /api/ids/description`, dentro del apartado _Messaging e introuducimos, en `recipient`, https://localhost:8080/api/ids/data y no ponemos nada como id del recurso. Así consultamos el conector y vemos los catálogos. Para ver qué recursos están listados en cada catálogo, volvemos a hacer lo mismo, pero poniendo como id del recurso la **ruta completa** del catálogo. Por alguna razón, al seguir los pasos del tutorial no es posible ver listado el recurso en el catálogo. Puede deberse a la asignacion de la política de acceso en el contrato.

#### 📡Tramitación del Intercambio de Datos
Habrá que poner todo el contenido de `ids:permission`, que encontramos dentro de `ids:contractOffer` para el recurso con el que estemos trabajando. Hay que añadir a este contenido el atributo `"ids:target": "https://localhost:8080/api/artifacts/<id del artifact>"`. Así, un ejemplo de cuerpo de una petición de este tipo sería:
```commandline
[
  {
    "@type": "ids:Permission",
    "@id": "https://localhost:8080/api/rules/29689e21-99ea-4507-93bf-b7e201d932fd",
    "ids:target": "https://localhost:8080/api/artifacts/d6d2b509-545d-481b-83d3-e6d678171292"
  }
]
```
Ahora, podremos acceder al artefacto del recurso, a partir del cual podremos obtener sus datos mediante la dirección que proporciona para ello.

## 🧪 Ejemplos de Despliegues
En [este](https://github.com/International-Data-Spaces-Association/IDS-Deployment-Examples) repositorio encontramos ejemplos de despliegue de este conector IDS, a parte de los correspondientes a otros componentes de los Espacios de Datos. 

### 🌐 provider-consumer
Es de especial interés el ejemplo `provider-consumer` dentro de la carpeta `dataspace connector`. En él se trata de hacer una prueba en la cual un conector IDS en el puerto 8081 provee datos a otro en el puerto 8080. Por desgracia, aunque en este ejemplo sí se crea una oferta de un recurso que se lista en el catálogo, no es posible negociar el contrato como pone en la guía. Esto ocurre porque la fecha de finalización del contrato es de mayo del 2025, por lo que habrá que cambiar esto manualmente en el fichero .sh.

### 🗃️ Ejemplos con BD PostgreSQL
Los otros dos ejemplos de conector implementan un conector IDS que guarda *logs* y metadatos de recursos, artefactos, etc. en una base de datos PostgreSQL. Destacamos que, como se indica más abajo, si lo que se quiere es servir el los datos de una base de datos a través de un conector, tal vez el mejor modo de hacerlo sea haciendo uso del atributo `accessURL` de los datos del artefacto. Señalamos en el ejemplo más completo, `full`, el uso de una UI desarrollada por el mismo equipo que hizo el conector y que puede ser útil para realizar más cómodamente la creación de recursos o la negociación de contratos.

## 🧩 Otros Conectores
Existen otra implementaciones de conector IDS. La implementación trabajada, DataspaceConnector, que viene de la mano del  [Fraunhofer ISST](https://github.com/FraunhoferISST), a pesar de ser la mejor documentada, no está activamente mantenida por el momento. Hay hasta cuatro implementaciones oficiales de conector IDS, pero pocas más modernas y mantenidas que la del DataspaceConnector. Aquí exploramos algunos proyectos relacionados con ellas.

### 🆕 TRUE ('TRU'sted 'E'ngineering) Connector for the IDS (International Data Space) ecosystem 
Cuarta y más moderna implementación del conector IDS, cuya última actualización fue hace algo más de un año, y cuyo repositorio encontramos [aquí](https://github.com/International-Data-Spaces-Association/trusted-connector). Su [documentación](https://engineering-ing-inf-rd.gitbook.io/true-connector/) es extremadamente escueta, aunque en ella se explica bien cómo realizar el [despliegue en Docker](https://engineering-ing-inf-rd.gitbook.io/true-connector/readme/start-stop), más complejo que el de DataspaceConnector. Posee también una serie de [cuatro videotutoriales oficiales](https://github.com/Engineering-Research-and-Development/true-connector/tree/main/doc/tutorial) cortos. Posee una colección y entorno de Postman para poder hacer las llamadas a la API con mayor facilidad. La REST API parece ser muy similar a la del DataspaceConnector. Poseen [una UI](https://github.com/Engineering-Research-and-Development/dsp-true-connector-ui/tree/master) que, según la [documentación del conector](https://engineering-ing-inf-rd.gitbook.io/true-connector/roadmap) está todavía en progreso.  

### 🤔 Trusted Connector
No confundir con el anterior (a pesar de la similaridad de nombre). Haría falta desarrollar más investigación a este respecto. No parece ser un conector IDS como el resto, pero sí parece estar relacionado con los Espacios de Datos.

## 🔗 Otros Enlaces Interesantes
* [Repositorio de la IDSA](https://github.com/International-Data-Spaces-Association)
* [Listado (incompleto y desactualizado) de los proyectos de la IDSA](https://github.com/International-Data-Spaces-Association/idsa/blob/main/overview_repositories.md) - Se ofrece una corta explicación de la mayoría de ellos
* [IDS-testbed](https://github.com/International-Data-Spaces-Association/IDS-testbed) - Este proyecto permite comprobar la operabilidad de los componentes del espacio de datos que se implementen. Hay ejemplos de uso en [IDS Deployment Examples](https://github.com/International-Data-Spaces-Association/IDS-Deployment-Examples)
* [Personal Data and IDS](https://github.com/International-Data-Spaces-Association/Personal-Data-and-IDS) - En este repositorio se puede encontrar documentación sobre la filosofía del uso de datos personales en Espacios de Datos
* [Identity in Data Spaces](https://github.com/International-Data-Spaces-Association/identity-in-data-spaces) - Cómo se gestionan las identidades según las reglas de la IDSA
* [Wiki del Proyecto FAIR Data Spaces](https://github.com/FAIR-DS4NFDI/wiki/wiki) - Está relacionado con GAIA-X. Especialmente interesante el punto WP3+WP4
