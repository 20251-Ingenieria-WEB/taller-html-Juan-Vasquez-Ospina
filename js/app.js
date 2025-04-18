// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    const btnBuscar = document.getElementById("boton-buscar");
    const btnLimpiar = document.getElementById("boton-limpiar");

    // Asignar eventos a los botones
    btnBuscar.addEventListener("click", fetchPokemon);

    btnLimpiar.addEventListener("click", () => {
        const input = document.getElementById("busqueda");
        input.value = "";
        input.focus();
        document.getElementById("pokeinfo").innerHTML = "";
    });
});

/**
 * Función para buscar y mostrar información de un Pokémon usando la PokéAPI
 */
function fetchPokemon() {
    const pokename = document.getElementById('busqueda').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokename}`;

    // Solicitud para obtener los datos del Pokémon
    fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('No se encontró el Pokémon');
            }
        })
        .then((data) => {
            // Extraer y preparar información relevante
            const name = data.name.toUpperCase();
            const frontImg = data.sprites.front_default;
            const shinyImg = data.sprites.front_shiny;
            const types = data.types.map(t => t.type.name).join(', ');
            const height = (data.height / 10).toFixed(1); // altura en metros
            const weight = (data.weight / 10).toFixed(1); // peso en kg

            // Obtener la URL para la descripción del Pokémon
            const pokemonUrl = data.species.url;

            // Solicitud para obtener la descripción en español
            fetch(pokemonUrl)
                .then((res) => res.json())
                .then((speciesData) => {
                    // Buscar la primera entrada en español
                    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === "es");
                    const descriptionText = description ? description.flavor_text : "No se encontró descripción en español.";

                    // Crear las barras de estadísticas
                    const stats = data.stats.map(stat => {
                        const percentage = (stat.base_stat / 255) * 100;
                        return `
                            <div class="stat">
                                <span>${stat.stat.name.toUpperCase()}</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${percentage}%;">
                                        ${stat.base_stat}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');

                    // Mostrar toda la información en la pantalla principal
                    document.getElementById('pokeinfo').innerHTML = `
                        <div class="poke-card">
                            <h2>${name}</h2>
                            <div class="poke-images">
                                <img src="${frontImg}" alt="${name}" title="Normal" />
                                <img src="${shinyImg}" alt="${name} shiny" title="Shiny" />
                            </div>
                            <div class="poke-info-row">
                                <div><strong>Tipo:</strong> ${types}</div>
                                <div><strong>Altura:</strong> ${height} m</div>
                                <div><strong>Peso:</strong> ${weight} kg</div>
                            </div>
                            <div class="stats">
                                ${stats}
                            </div>
                        </div>
                    `;

                    // Mostrar la descripción debajo de los controles
                    document.querySelector('.description').innerHTML = descriptionText;
                })
                .catch((err) => {
                    console.error("Error al obtener la descripción:", err);
                    document.querySelector('.description').innerHTML = "No se pudo obtener la descripción.";
                });
        })
        .catch((err) => {
            // Mostrar error si el Pokémon no fue encontrado
            document.getElementById('pokeinfo').innerHTML = `<p style="color: red;">${err.message}</p>`;
        });
}
