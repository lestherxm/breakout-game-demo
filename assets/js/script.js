// Obtener elementos del DOM
const btn_start = document.querySelector('#btn-start');
const rulesBtn = document.getElementById('rules-btn'); // Botón de reglas
const closeBtn = document.getElementById('close-btn'); // Botón de cierre
const rules = document.getElementById('rules'); // Panel de reglas
const canvas = document.getElementById('canvas'); // Elemento del lienzo
const ctx = canvas.getContext('2d'); // Contexto de dibujo 2D

// Variables globales
let score = 0; // Puntuación inicial a 0
let lives = '🏖️🏖️🏖️';
const colors = ['#D24246', '#D06433', '#CEA406', '#3E9F3C', '#373AD8', '#7C43DF', '#03C4C6'];
const brickRowCount = colors.length; // Número de filas de ladrillos
const brickColumnCount = 13; // Número de columnas de ladrillos
const delay = 100; // Tiempo de retraso en milisegundos para reiniciar el juego

// Especificamos las Propiedades del @Balon
let speed_ball = 5; // 5 Velocidad inicial del balon
let y_ball_ini = 40; //Posicion inicial en el eje y del balon
const ball =
{
  // declaramos la posición en la que aparecera 
  x: (canvas.width / 2), // posicion inicial @x del balon
  y: (canvas.height - y_ball_ini), // posicion inicial @y del balon
  // declaramos el tamaño y velocidad de movimiento en pixeles 
  size: 15,
  speed: speed_ball,
  // declaramos la velocidad en horizontal y vertical en pixeles
  dx: speed_ball, // Velocidad horizontal
  dy: -speed_ball, // Velocidad vertical (hacia arriba)
  visible: true
};

// Especificamos las Propiedades de la @Paleta
let width_paddle = 80;
let y_paddle_ini = 24;
let speed_paddle = 8;
const paddle =
{
  // declaramos la posición en la que aparecera
  x: (canvas.width / 2) - (width_paddle / 2), // en el medio del eje x tomando en cuenta el ancho de la paleta
  y: canvas.height - y_paddle_ini, //al pie del eje @y menos N pixeles
  w: width_paddle, // Ancho de la paleta
  h: y_paddle_ini, // Altura de la paleta
  speed: speed_paddle, // Velocidad de movimiento de la paleta
  dx: 0, // Velocidad horizontal, inicialmente cero pero al precionar tecla derecha o izquierda sera igual a @speed
  visible: true
};

// Especificamos las Propiedades de los @Ladrillos
const brickInfo =
{
  // declaramos el tamaño en pixeles 
  w: 60, // Ancho de los ladrillos
  h: 20, // Altura de los ladrillos
  padding: 5, // Espacio alrededor de cada ladrillo
  // declaramos el posicionamiento del primer ladrillo dentro del cuadro
  offsetX: 30, //45
  offsetY: 60, //6500
  visible: true
};

// Creamos mas ladrillos Ladrillos
const bricks = [];
// declaramos una matriz o un arreglo para los ladrillos
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  // creamos un ciclo validando las filas de brickRowCount y guardamos en un arreglo vacio la fila del ladrillo
  for (let j = 0; j < brickRowCount; j++) {
    // creamos un ciclo validando las columnas de brickColumnCount 
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    // se calcula la posicion x - y (horizontal - vertical) dentro del plano
    // en x se multiplica el indece i de la fila por el ancho mas el espaciado del ladrillo y luego sumamos el desplazamiento horizontal
    // en x se multiplica el indece j de la columna por el alto mas el espaciado del ladrillo y luego sumamos el desplazamiento vertical
    bricks[i][j] = { x, y, ...brickInfo };
    // se crea el objeto que se agrega al arreglo en i y j con las coordenas x, y con las propiedades en brickInfo
  }
}

// Dibujamos la Pelota en el Canvas
function drawBall() {
  if (ball.visible) {
    // Dibuja la imagen de la pelota en las coordenadas de la pelota
    ctx.drawImage(ballImage, ball.x - ball.size, ball.y - ball.size, ball.size * 2, ball.size * 2);
  }
}
//function drawBall() 
//{
//ctx.beginPath(); // creamos un nuevo trazo 
//ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); 
// dibujamos un arco con las propiedades de ball (posicion, tamaño) y la creacion del angulo inicial en 0 y final 2π
//ctx.fillStyle = ball.visible ? '#fff' : 'transparent';
// seteamos estilos, si visible es true, color blanco, si es false sera transparente
//ctx.fill(); // aplicamos los estilos
//ctx.closePath(); // cierra el trazo creado
//}

// Dibujamos la Paleta en el Canvas

function drawPaddle() {
  if (paddle.visible) {
    // Dibuja la imagen de la paleta en lugar de un rectángulo
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.w, paddle.h);
  }
}
//function drawPaddle() 
//{
//ctx.beginPath(); // creamos un nuevo trazo 
//ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h); 
// dibujamos un rectangulo con las propiedades de paddle (posicion, tamaño)
//ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
// seteamos estilos, si visible es true, color azul, si es false sera transparente
//ctx.fill(); // aplicamos los estilos
//ctx.closePath(); // cierra el trazo creado
//}

// Dibujamos la Puntuacion en el Canvas

function drawScore() {
  ctx.font = '28px Arial'; // Establecemos funte y tamaño
  // ctx.fillText(string, pos_x, pos_y)
  ctx.fillText(`Score: 🪙 ${score}`, 30, 40);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 220, 40);
}

// Dibujamos los ladrillos en el Canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach((brick, index) => {
      // creamos un ciclo de las columnas de ladrillos
      ctx.beginPath(); // creamos un nuevo trazo
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      // dibujamos los rectangulos con las propiedades de brick (posicionamiento y tamaño)
      ctx.fillStyle = brick.visible ? colors[index] : 'transparent'; //Se elije un color x numero de fila
      // seteamos estilos, si visible es true, color azul, si es false sera transparente 
      ctx.fill(); // aplicamos los estilos
      ctx.closePath(); // cierra el trazo creado
    });
  });
}

// Movemos Paleta en el Canva
function movePaddle() {
  // incrementa la posicion en x con la velocidad de dx
  paddle.x += paddle.dx;

  // declaramos una condicional verificando si el borde de la paleta a superado el borde del Canva
  if (paddle.x + paddle.w > canvas.width) {
    // mantenemos la paleta dentro de los limites del canvas alineando con el borde derecho del lienzo
    paddle.x = canvas.width - paddle.w;
  }

  // declaramos una condicional verificando el borde izquierdo de la paleta no supere el del Canva
  if (paddle.x < 0) {
    // si la paleta a superado el borde establecemos la posicion en 0
    paddle.x = 0;
  }
}

// Mover Balon en el Canvas
function moveBall() {
  // incrementamos las cordenadas x - y para el movimiento de la pelota en el Canva
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Verificamos si la pelota a chocado con la pared de lado izquierdo o derecho
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    // si choca invertimos la direccion 
    ball.dx *= -1;
  }

  // Verificamos si la pelota a chocado con la pared de arriba o de abajo
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    // si choca invertimos la direccion
    ball.dy *= -1;
  }

  // Choque con Paleta
  // verificamos si el Balon a chocado con la Paleta, comparando sus coordenadas.
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    // si el @Balon choca con la parte superior de la @Paleta se invierte su direccion vertical.
    ball.dy = -ball.speed;
  }

  // Choque con Ladrillos
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // verificación del lado izquierdo del ladrillo
          ball.x + ball.size < brick.x + brick.w && // verificación del lado derecho del ladrillo
          ball.y + ball.size > brick.y && // verificacion lateral del ladrillo superior
          ball.y - ball.size < brick.y + brick.h // verificacion lateral del ladrillo inferior
        ) {
          ball.dy *= -1;
          brick.visible = false;
          ball.speed += 0.05; //se va aumentando la velocidad  en la que se mueve el balon
          paddle.speed += 0.05; //se va aumentando la velocidad en que se puede mover la paleta
          increaseScore();
          // verificamos el choque de la pelota con algun ladrillo
          // si choca con un ladrillo invierte la direcion de la pelota y ocultamos el ladrillo
          // incrementamos la puntuacion en increaseScore()
        }
      }
    });
  });

  // Reinicio
  // verificamos la posicion vertical de la pelota si a superado el lienzo
  if ((ball.y + ball.size) > canvas.height) {
    // si se cumple, vuelve a mostrar todos los ladrillos y la puntuacion a 0, descuenta una vida
    validate_lives();
  }
}

function validate_lives(){
  switch (lives) {
    case '🏖️🏖️🏖️':
      lives = '🏖️🏖️';
      break;
    case '🏖️🏖️':
      lives = '🏖️';
      break;
    case '🏖️':
      lives = '💀';
      break;
  }
  playAgain();
  if (lives == '💀') {
  setTimeout(() => {
    alert('😢 !Suerte para la próxima! 😢 Ya no te quedan intentos. Click en ACEPTAR para reiniciar el juego 👀.');
    lives = '🏖️🏖️🏖️';
  }, 100);
  }
}

// Puntuacion
function increaseScore() {
  score++;
  // sumamos 1 a la puntuacion en cada ejecucion

  // verificamos si la puntuacion actual es multiplo del numero total de ladrillos
  if ((score % (brickRowCount * brickColumnCount)) === 0) {
    ball.visible = false;
    paddle.visible = false;
    // si se destruyen todos los ladrillos reiniciamos todo despues de cumplir el delay
    setTimeout(() => {
      alert(`🎊 ¡Felicidades! 🎊 Ganaste 🪙${score} puntos. Click en ACEPTAR para jugar otra vez 😀.`);
      //playAgain();
      btn_start.style.display = 'flex';
    }, 100);
  }
}

function playAgain(){
  setTimeout(() => {
    showAllBricks(); // restauramos los ladrillos
    score = 0; // puntuacion a 0
    ball.speed = speed_ball;
    paddle.speed = speed_paddle;
    paddle.x = (canvas.width / 2) - (width_paddle / 2);
    paddle.y = (canvas.height - y_paddle_ini);
    ball.x = (canvas.width / 2);
    ball.y = (canvas.height - y_ball_ini);
    // regresamos la paleta y pelota a posicion inicial
    ball.visible = true;
    paddle.visible = true;
    // mostramos la pelota y la paleta
  }, delay);
}

// Mostrar ladrillos
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
  // la funcion muestra todos los ladrillos del juego validando cada ladrillo en su columna de la matriz bricks
}

// Dibujamos todo
function draw() {
  // reiniciamos el trazo del canva y limpiamos las coordenadas a 0
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks(); // dibujamos Ladrillos
  drawScore(); // dibujamos Puntuacion
  drawBall(); // dibujamos Balon
  drawPaddle(); // dibujamos Paleta
}

// Actualizamos dibujo y animacion del lienzo
function update() {
  movePaddle(); // Movemos Paleta
  moveBall(); // Movemos Balon
  draw(); // Dibujamos Todo
  // este es un metodo que le dice al navegador que haremos una animacion y que llame a la funcion update para actualizar la animacion.
  requestAnimationFrame(update);
}

// Pulsacion de tecla (KeyDown)
function keyDown(e) {
  // verificamos que la tecla pulsada sea 'derecha' o 'flecha derecha'
  if (e.key === 'Right' || e.key === 'ArrowRight')
  {
    // si es asi movemos la paleta cumpliendo las propiedades de direccion (derecha) y velocidad
    paddle.dx = paddle.speed;
  }
  // verificamos que la tecla pulsada sea 'izquierda' o 'flecha izquierda'
  else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    // si es asi movemos la paleta cumpliendo las propiedades de direccion (izquierda) y velocidad
    paddle.dx = -paddle.speed;
  }
}

// Tecla Arriba (KeyUp)
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  )
  // verificamos cual de las teclas izquierda o derecha fue soltada
  {
    // si es soltada la tecla, la velocidad de la paleta sera 0
    paddle.dx = 0;
  }
}

document.addEventListener('keydown', keyDown); // escucha el evento KeyDown
document.addEventListener('keyup', keyUp); // escucha el evento KeyUp

rulesBtn.addEventListener('click', () => rules.classList.add('show')); // Mostramos el panel de reglas
closeBtn.addEventListener('click', () => rules.classList.remove('show')); // Ocultamos el panel de reglas

btn_start.addEventListener('click', ()=>{
  btn_start.style.display = 'none';
  update();
});