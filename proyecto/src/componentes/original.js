import { auth, db } from '../firebaseConfig.js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Lista de estados y ciudades famosas (puedes agregar más)
const estadosCiudades = [
    { estado: "California", ciudades: ["LOS ANGELES", "SAN FRANCISCO", "SAN DIEGO", "SACRAMENTO"] },
    { estado: "Texas", ciudades: ["HOUSTON", "DALLAS", "AUSTIN", "SAN ANTONIO"] },
    { estado: "Florida", ciudades: ["MIAMI", "ORLANDO", "TAMPA", "JACKSONVILLE"] },
    { estado: "New York", ciudades: ["NEW YORK", "BUFFALO", "ROCHESTER", "ALBANY"] },
    { estado: "Illinois", ciudades: ["CHICAGO", "SPRINGFIELD", "PEORIA"] },
    { estado: "Nevada", ciudades: ["LAS VEGAS", "RENO", "CARSON CITY"] },
    { estado: "Arizona", ciudades: ["PHOENIX", "TUCSON", "MESA"] },
    { estado: "Georgia", ciudades: ["ATLANTA", "SAVANNAH", "AUGUSTA"] },
    { estado: "Pennsylvania", ciudades: ["PHILADELPHIA", "PITTSBURGH", "HARRISBURG"] },
    { estado: "Massachusetts", ciudades: ["BOSTON", "WORCESTER", "SPRINGFIELD"] },
    // ...agrega más si quieres
];

let estadoActual = '';
let ciudadesActuales = [];
let userWin = 0;
let userLose = 0;
let uid = null;

const app = document.getElementById('app');

function getRandomEstado() {
    const random = estadosCiudades[Math.floor(Math.random() * estadosCiudades.length)];
    estadoActual = random.estado;
    ciudadesActuales = random.ciudades;
}

async function guardarResultado(acierto) {
    if (!uid) return;
    const fecha = new Date().toISOString();
    const resultado = {
        uid,
        estado: estadoActual,
        aciertos: acierto ? 1 : 0,
        errores: acierto ? 0 : 1,
        fecha,
    };
    try {
        await setDoc(doc(db, 'resultados', `${uid}_${fecha}`), resultado);
        const docRef = doc(db, 'usuarios', uid);
        await updateDoc(docRef, {
            ganados: acierto ? userWin : userWin,
            perdidos: !acierto ? userLose : userLose,
        });
    } catch (e) {
        console.error('Error al guardar resultado:', e);
    }
}

async function cargarDatosUsuario() {
    if (!uid) return;
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        userWin = data.ganados || 0;
        userLose = data.perdidos || 0;
    } else {
        await setDoc(docRef, { ganados: 0, perdidos: 0 });
        userWin = 0;
        userLose = 0;
    }
}

function renderJuego() {
    app.innerHTML = '';
    app.appendChild(document.createElement('h2')).textContent = 'Adivina una ciudad famosa de este estado';
    app.appendChild(document.createElement('p')).textContent = `Ganados: ${userWin} | Perdidos: ${userLose}`;

    const estadoP = document.createElement('p');
    estadoP.style.fontSize = '1.5em';
    estadoP.style.textAlign = 'center';
    estadoP.textContent = `Estado: ${estadoActual}`;
    app.appendChild(estadoP);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribe una ciudad famosa';
    input.style.display = 'block';
    input.style.margin = '10px auto';
    input.style.textTransform = 'uppercase';
    app.appendChild(input);

    const btn = document.createElement('button');
    btn.textContent = 'Comprobar';
    btn.style.display = 'block';
    btn.style.margin = '10px auto';
    app.appendChild(btn);

    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'Saltar';
    skipBtn.style.display = 'block';
    skipBtn.style.margin = '10px auto';
    app.appendChild(skipBtn);

    const mensaje = document.createElement('p');
    mensaje.style.textAlign = 'center';
    app.appendChild(mensaje);

    btn.onclick = async () => {
        const respuesta = input.value.trim().toUpperCase();
        if (ciudadesActuales.includes(respuesta)) {
            mensaje.textContent = '¡Correcto!';
            mensaje.style.color = 'green';
            userWin++;
            await guardarResultado(true);
            setTimeout(async () => {
                await restartGame();
            }, 1200);
        } else {
            mensaje.textContent = 'Incorrecto. Intenta de nuevo o salta.';
            mensaje.style.color = 'red';
        }
    };

    skipBtn.onclick = async () => {
        mensaje.textContent = `Algunas ciudades posibles eran: ${ciudadesActuales.join(', ')}`;
        mensaje.style.color = 'orange';
        userLose++;
        await guardarResultado(false);
        setTimeout(async () => {
            await restartGame();
        }, 1800);
    };
}

async function restartGame() {
    getRandomEstado();
    renderJuego();
}

export default function mostrarOriginal() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            uid = user.uid;
            await cargarDatosUsuario();
            getRandomEstado();
            renderJuego();
        } else {
            app.innerHTML = '<p>Por favor inicia sesión para jugar.</p>';
        }
    });
}