export default async function mostrarHome() {
    const app = document.getElementById("app");
    app.innerHTML = `<h2>FBI Most Wanted</h2>
    <div id="lista" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; padding: 10px;"></div>`;

    const lista = document.getElementById("lista");

    try {
        const res = await fetch("https://api.fbi.gov/wanted/v1/list");
        const json = await res.json();
        const data = json.items;

        data.forEach((item) => {
            const div = document.createElement("div");
            div.style.width = "200px";
            div.style.border = "1px solid #ccc";
            div.style.padding = "10px";
            div.style.borderRadius = "8px";
            div.style.background = "#fafafa";

            div.innerHTML = `
                <p><strong>${item.title}</strong></p>
                <img src="${item.images && item.images[0] ? item.images[0].original : ''}" 
                     alt="Foto" style="width: 100%; height: 180px; object-fit: cover; border-radius: 4px;" />
                <p>${item.subjects ? item.subjects.join(', ') : ''}</p>
                <a href="${item.url}" target="_blank">Ver más</a>
            `;
            lista.appendChild(div);
        });
    } catch (error) {
        app.innerHTML = `<p>Error al cargar los datos del FBI: ${error.message}</p>`;
    }
}