# Breakout Game

Juego en el que controlas una paleta con las teclas de flecha para hacer rebotar una pelota y romper ladrillos. Esta aplicación utiliza el elemento de lienzo HTML5 (canvas).

## Cambios

01. Reestructuracion de los archivos para un mejor orden.
02. Declaracion de una variable para el control de la velocidad del balon
03. Ajuste en el uso de las variables para especificar las columnas y filas de ladrillos
04. Cambio en la posicion incial del balon, antes estaba en el medio, ahora en el medio eje x y arriba de la paleta.
05. Implementación de colores en cada una de las filas "impresas"
06. Cambio en el "fill"/relleno del balón y la barra por imágenes de un balón de playa y un trampolín, respectivamente.
07. Agregué un botón para "empezar" el juego
08. Agregué "vidas" al juego y gestioné algunas notificaciones (aparecen al ganar o perder todas las vidas)

## Especificaciones

01. Crea lienzo
02. Crea y dibuja una pelota.
03. Crea y dibuja una paleta.
04. Crea ladrillos
05. Empate puntuación
06. Agregar actualización() - Animar - requestAnimationFrame(cb)
07. Mover la paleta
08. Controladores de eventos de teclado para mover la paleta
09. Mover la pelota
10. Añade límites a las paredes
11. Aumenta la puntuación cuando los ladrillos se rompen.
12. Pierde: vuelve a dibujar ladrillos, restablece la puntuacion.
