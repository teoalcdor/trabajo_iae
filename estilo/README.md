# Manual - Conector IDS
Vamos a usar la implementación que podemos encontrar en [este](https://github.com/International-Data-Spaces-Association/DataspaceConnector) repositorio de GitHub. La principal ventaja de esta es su amplia documentación, tanto del conector en sí como de conceptos relacionados con los Espacios de Datos. A este respecto, se recomienda leer su [documentación](https://international-data-spaces-association.github.io/DataspaceConnector/). Su mayor defecto es que, desde el 2023, no está activamente mantenido, aunque se busca nuevo personal que lo mantenga.

## Despliegue
Para el despliegue hay dos opciones principalmente. O bien podemos simplemente hacer:

```commandline
docker run -p 8080:8080 --name connector ghcr.io/international-data-spaces-association/dataspace-connector:latest
```

O bien se puede intentar clonar el repositorio y usar el fichero docker-compose.yaml. A nosotros esta segunda opción no nos ha funcionado. Se pueden también hacer otro tipo de despliegues, como viene [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/GettingStarted).

Una vez todo esté listo y corriendo, el conector lo encontraremos aquí [https://localhost:8080/](https://localhost:8080/). La API está en [https://localhost:8080/api](https://localhost:8080/api). Y la UI Swagger para manejar la API de forma más sencilla está en [https://localhost:8080/api/docs](https://localhost:8080/api/docs). Nosotros usaremos esta última. Por defecto, pedirá usuario y contraseña, que serán, respectivamente, `admin` y `password`.

## Indicaciones Generales
Para seguir mejor los dos puntos subsiguientes, es muy útil estar familiarizado con el [modelo de datos del conector](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/DataModel), que se basa en el IDS Infomodel. 

Como patrón general en la API, las peticiones POST de la forma `/api/<entidad>` vienen a crear esta entidad. En estas peticiones, el cuerpo de la petición será un JSON con los diferentes atributos. Por otra parte, las peticiones POST de la forma `/api/<entidad_1>/{id}/<entidad_2>` añaden a la `<entiedad_1>` con Id `{id}` la `<entidad_2>`. En ellas, el cuerpo es una lista de cadenas con las direcciones de la entidad o entidades a añadir (por ejemplo, ["https://localhost:8080/api/rules/9c8c43ed-5ea9-45ac-813f-a14804dd8791", "https://localhost:8080/api/rules/8shjkc34hkj-45ac-813f-a14804dd8791"]).

Todas las entidades del modelo de datos tienen una serie de atributos, que encontramos [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/DataModel).

### Compartir y Reclamar Datos
## Compartir Datos Mediante el Conector IDS
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

Debemos tener en cuenta que para que un recurso que ofrecemos se considere completo y pueda ser listado en el catálogo, ha de tener una representación con, al menos, un artefacto y un contrato con, al menos una regla. Haremos incapié en añadir datos al artefacto y en las reglas, por ser de especial importancia y algo diferentes a lo ya visto.

### Artifact + Datos
Una vez creado el artefacto mediante `POST /api/artifacts` habrá que añadirle datos. A diferencia de lo que se dice en la documentación, no podemos añadir los datos en le cuerpo de `POST /api/artifacts/{id}/data`. En su lugar lo hacemos mediante una petición de tipo PUT, con `PUT /api/artifacts/{id}/data`. Subiemos a ella los datos a aportar.

###  Rules + Usage Policies
Se crean con `POST /api/rules`. En el atributo `value` debe hubicarse la política de uso. Esto se indica [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/CommunicationGuide/v6/Provider), sin embargo, no se especifica cómo han de enlazarse estas políticas. Como es difícil crear una política de este estilo, existe una herramienta que las crea dentro de la API. Su uso se especifica [aquí](https://international-data-spaces-association.github.io/DataspaceConnector/Documentation/v6/UsageControl#example-endpoint). 

## Obtención de Datos
Para esta sección nos basamos en [esta sección](https://international-data-spaces-association.github.io/DataspaceConnector/CommunicationGuide/v6/Consumer). 

### Exploración de Datos
Para consultar los catálogos, nos vamos a `POST /api/ids/description`, dentro del apartado _Messaging e introuducimos, en `recipient`, https://localhost:8080/api/ids/data y no ponemos nada como id del recurso. Así consultamos el conector y vemos los catálogos. Para ver qué recursos están listados en cada catálogo, volvemos a hacer lo mismo, pero poniendo como id del recurso la **ruta completa** del catálogo.

### Tramitación del Intercambio de Datos
(WIP)
