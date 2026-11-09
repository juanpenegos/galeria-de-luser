# Arquitectura

El código sigue la idea de **SOLID** adaptada a una página sencilla sin frameworks.

- **Responsabilidad única (S):** cada archivo hace una sola cosa. Los datos no saben dibujar, el reproductor no sabe de teclado, Spotify no sabe de la calle. Si algo falla en la música, sabes que buscar en `js/audio/` o `js/spotify/`.
- **Abierto/cerrado (O):** para agregar canciones, fotos o animales cambias datos, no la lógica. La calle se calcula sola según cuántas canciones hay.
- **Sustitución (L) e interfaces (I):** los motores de sonido (melodía de ejemplo, MP3 y Spotify) responden a las mismas órdenes: empezar, parar y silenciar. El reproductor puede usar cualquiera sin saber cuál es.
- **Inversión de dependencias (D):** las piezas de arriba (el bucle del juego) dependen de funciones simples como "reproducir el cuadro i", no de los detalles de Spotify.

## Flujo
1. `datos/` carga canciones y configuración (o la lista guardada de Spotify).
2. `mundo/` mide y construye la calle.
3. `audio/` y `spotify/` preparan el sonido.
4. `juego/` escucha controles y en cada cuadro de animación mueve a los personajes, revisa qué cuadro está enfrente y le pide al reproductor que suene o pare.

## Buenas prácticas usadas
- `"use strict"` y un encabezado que explica cada archivo.
- Nombres descriptivos en imágenes y funciones.
- Nada secreto en el código: el login usa PKCE, que no necesita Client Secret.
- Las fallas de Spotify caen a una alternativa en vez de romper la página.
