# Trabajo de Inteligencia Artificial y Estadística
Repositorio del trabajo efectuado por de Teodoro Alcántara Dormido para la asignatura Inteligencia Artificial y Estadística

## Estructura del Trabajo
A la hora de ejecutar los ficheros del trabjo en local, es recomendable que tengan la siguiente estructura:

trabajo_iae/
├─ datasets/
│  ├─ classification_dataset/
│  ├─ classification_dataset_augmented/
│  ├─ corrupt_od_dataset/
│  ├─ od_dataset_classification/
│  ├─ od_dataset_clean/
│  ├─ od_dataset_df/
│  ├─ ss_dataset/
│  ├─ ss_dataset_clean/
│  ├─ ss_dataset_df/
│  ├─ classification_dataset_augmented.zip
│  ├─ od_dataset
│  ├─ od_dataset.yaml
│  ├─ od_dataset_clean.zip
├─ envs/
│  ├─ trabajo_iae_env/
├─ estilo/
│  ├─ default.js
│  ├─ layout.css
├─ html/
│  ├─ classification_dataset.html
│  ├─ od_dataset.html
│  ├─ ss_dataset.html
├─ imagenes/
│  ├─ ssd.png
│  ├─ unet.png
│  ├─ vgg16.png
├─ modelos/
│  ├─ yolov5/
│  ├─ ssd300.pth
│  ├─ unet.pth
│  ├─ vgg19.pth
├─ plots/
classification_dataset.Rmd
classification_model.ipynb
dashboard.Rmd
od_dataset.Rmd
od_models.ipynb
plots.ipynb
ss_dataset.Rmd
ss_models.ipynb
trabajo_iae.Rproj

De esta forma, podrán ejecutarse todos los ficheros .Rmd sin problema alguno. Estos serán los encargados de la limpieza del *dataset* y el *dashboard*. En cuanto a los ipynb, mientras que plot.ipynb es recomendable correrlo localmente, el resto están adaptados para hacerlo en Google Colab. Estos últimos, que se encargan de la modelización, están adaptados mediante un botón para ser abiertos en la plataforma gratuita ofrecida por Google y conectarse a Google Drive para acceder a los archivos .zip de la carpeta datasets.

## Obtener el Trabajo
Podemos encontrar todo el trabajo, con esta estructura en Google Drive, clicando [aquí](https://drive.google.com/drive/folders/1gwd3M8vxaypgw2bO3Bdj91rj349LIYf1?usp=sharing)
. Para copiar toda la carpeta trabajo_iae del enlace a Google Drive particular, basta seguir los siguientes pasos:

1. **Instala la extensión**  
   Accede al siguiente enlace y haz clic en **"Instalar"**:  
   [Copiar carpeta en Google Drive](https://workspace.google.com/marketplace/app/copiar_carpeta_en_google_drive/891769470715?hl=es)

2. **Autoriza los permisos necesarios**  
   La extensión solicitará acceso a tu cuenta de Google Drive para poder copiar carpetas y archivos. Revisa y acepta los permisos requeridos.

3. **Selecciona la carpeta a copiar**  
   Una vez instalada la extensión, ve a tu Google Drive y selecciona la carpeta que deseas copiar.

4. **Inicia el proceso de copia**  
   Con la carpeta seleccionada, haz clic derecho y elige la opción **"Copiar carpeta"** proporcionada por la extensión.

5. **Elige la carpeta de destino**  
   Se te pedirá que selecciones la ubicación en tu Google Drive donde deseas que se copie la carpeta.

6. **Espera la confirmación por correo electrónico**  
   La extensión realizará la copia en segundo plano. Una vez completado el proceso, recibirás un correo electrónico notificándote que la copia se ha realizado con éxito.

