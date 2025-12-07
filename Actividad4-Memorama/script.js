let temporizador = document.getElementById("tempo");
let puntuacion = document.getElementById("good");
let inicio;
var i = 0;
var st = 0;
var seg = 30;
var min = 1;
var num = [];
var val = 0;
var val3 = 0;
var val2 = 0;
var bloqueo = false;

const caracteres = [
    "★", "☆", "▲", "△", "◼", "◻", "♥", "♦", "♣", "♠", "♪",
    "☯", "⚙", "⌘", "✢", "✤", "✖", "✔", "⌫", "✉", "✆"
];

function mostrar(n){
    if(i !== 0 && !bloqueo){
        let numero = parseInt(n);
        let boton = document.getElementById("btn" + numero);
        let span = boton.querySelector('span');

        if (boton.classList.contains('flipped') && val3 !== numero) {
            return;
        }
        
        span.textContent = caracteres[num[numero - 1]];
        span.style.visibility = "visible";
        boton.classList.add('flipped');
        
        confirmar(numero);
    }
}

function confirmar(n){
    let numero = parseInt(n);

    if(val === 0){
        val = num[numero-1];
        val3 = numero;
    } else {
        if (val3 !== numero) {
            bloqueo = true;
            setTimeout(function() {
                if (val !== num[numero - 1]) {
                    document.getElementById("btn" + val3).querySelector('span').style.visibility = "hidden";
                    document.getElementById("btn" + numero).querySelector('span').style.visibility = "hidden";
                    document.getElementById("btn" + val3).classList.remove('flipped');
                    document.getElementById("btn" + numero).classList.remove('flipped');
                } else {
                    document.getElementById("btn" + val3).removeAttribute("onclick");
                    document.getElementById("btn" + numero).removeAttribute("onclick");
                    document.getElementById("btn" + val3).style.cursor = "default";
                    document.getElementById("btn" + numero).style.cursor = "default";
                    val2++;
                    puntuacion.innerText = val2;
                }
                val = 0;
                val3 = 0;
                bloqueo = false;
            }, 800);
        }
        
        if(val2 === caracteres.length){
            setTimeout(() => {
                alert("¡Felicidades, ganaste!");
                detener();
                document.getElementById("empezar").removeAttribute("onclick");
                document.getElementById("detenido").removeAttribute("onclick");
                document.getElementById("empezar").style.opacity = "0.5";
                document.getElementById("detenido").style.opacity = "0.5";
            }, 900);
        }
    }
}

function iniciar(){
    if(i === 0){
        i = 1;
        if(st === 0){
            for(let x = 1; x <= 42; x++){
                let btn = document.getElementById("btn" + x);
                btn.querySelector('span').style.visibility = "hidden";
                btn.classList.remove('flipped');
                btn.setAttribute("onclick","mostrar("+x+");");
                btn.style.cursor = "pointer";
            }
            
            let tempNum = [];
            for (let x = 0; x < caracteres.length; x++) {
                tempNum.push(x);
                tempNum.push(x);
            }
            num = tempNum.sort(() => Math.random() - 0.5);
            
            st = 1;
        }
        inicio = setInterval(tiempo, 1000);
    }
}

function tiempo(){
    temporizador.innerText = (min < 10 ? "0" + min : min) + ":" + (seg < 10 ? "0" + seg : seg);
    
    if(seg === 0){
        if(min === 0){
            alert("¡Se acabó el tiempo!");
            detener();
            document.getElementById("empezar").removeAttribute("onclick");
            document.getElementById("detenido").removeAttribute("onclick");
            document.getElementById("empezar").style.opacity = "0.5";
            document.getElementById("detenido").style.opacity = "0.5";
            return;
        }
        seg = 59;
        min--;
    } else {
        seg--;
    }
}

function detener(){
    i = 0;
    clearTimeout(inicio);
}

function reinicio(){
    detener();
    seg = 30;
    min = 1;
    temporizador.innerText = (min < 10 ? "0" + min : min) + ":" + (seg < 10 ? "0" + seg : seg);
    val = 0;
    val3 = 0;
    val2 = 0;
    puntuacion.innerText = val2;

    for(let x = 1; x <= 42; x++){
        let btn = document.getElementById("btn" + x);
        btn.querySelector('span').style.visibility = "hidden";
        btn.classList.remove('flipped');
        btn.setAttribute("onclick","mostrar("+x+");");
        btn.style.cursor = "pointer";
    }
    document.getElementById("empezar").setAttribute("onclick","iniciar()");
    document.getElementById("detenido").setAttribute("onclick","detener()");
    document.getElementById("empezar").style.opacity = "1";
    document.getElementById("detenido").style.opacity = "1";
    
    st = 0;
}