import slugify from 'slugify'
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await strapi.db.transaction(async () => {
      // 
      await strapi.db.connection('metric_categories').insert({ id: 1, name: 'Métricas de zonas' }).onConflict().ignore()

      const metricCategories = [
        { id: 1, name: "Tiempo en Ataque", description: "Tiempo que pasa el jugador en el sector que va de la Red hasta 4 mts." },
        { id: 2, name: "Tiempo en defensa", description: "Tiempo que pasa el jugador en el sector que va del fondo hasta 4 mts." },
        { id: 3, name: "Tiempo en zona media", description: "Tiempo que pasa en los banda de 2 mts que está entre la zona de defensa y ataque." },
        { id: 4, name: "Zona de devoluciones de golpe", description: "Cuadro dividido en porcentaje para ver donde más juega la pelota (se computa cuando pica o cuando el rival devuelve). Dividir el cuadro en 6." },
      ]
      for (const entry of metricCategories) {
        await strapi.db.connection('metrics').insert({ ...entry, slug: slugify(entry.name, { lower: true, strict: true }) }).onConflict().ignore()
        await strapi.db.connection('metrics_category_links').insert({ metric_id: entry.id, metric_category_id: 1 }).onConflict().ignore()
      }

      await strapi.db.connection('metric_categories').insert({ id: 2, name: "Velocidad de golpes" }).onConflict().ignore()
      const velocityCategories = [
        { id: 5, name: "Velocidad de golpe en defensa", description: "Promedio de velocidad de golpe de todos los realizados de zona defensa (5mts de la defensa Fondo-5mts)" },
        { id: 6, name: "Velocidad de golpe en ataque", description: "Promedio de velocidad de golpe de todos los realizados de zona ataque (5 mts del ataque Red-5mts)" },
        { id: 7, name: "Velocidad de Saque", description: "Promedio de velocidad de sus saques. Los golpes de saque son todos aquellos que pican desde la cintura del jugador, en la zona de defensa y salen de manera cruzada." }
      ]

      for (const entry of velocityCategories) {
        await strapi.db.connection('metrics').insert({ ...entry, slug: slugify(entry.name, { lower: true, strict: true }) }).onConflict().ignore()
        await strapi.db.connection('metrics_category_links').insert({ metric_id: entry.id, metric_category_id: 2 }).onConflict().ignore()
      }


      await strapi.db.connection('metric_categories').insert({ id: 3, name: "Saque" }).onConflict().ignore()
      const serveCategories = [
        { id: 8, name: "1º Saque válido", description: "Porcentaje de saques en los que el primer servicio ha sido válido. Los golpes de saque son todos aquellos que pican desde la cintura del jugador, en la zona de defensa y salen de manera cruzada. En este caso, no queda en la red." },
        { id: 9, name: "2º Saque válido", description: "Porcentaje de saques en los que el segundo servicio ha sido válido. Los golpes de saque son todos aquellos que pican desde la cintura del jugador, en la zona de defensa y salen de manera cruzada. En este caso, el primero queda en la red, el segundo pasa." },
        { id: 10, name: "Distribución de saque", description: "% a zona T, Centro, o a la pared (Dividir cuadrante de saque en 3 y poner el porcentaje que cayó en cada uno)." }
      ]
      for (const entry of serveCategories) {
        await strapi.db.connection('metrics').insert({ ...entry, slug: slugify(entry.name, { lower: true, strict: true }) }).onConflict().ignore()
        await strapi.db.connection('metrics_category_links').insert({ metric_id: entry.id, metric_category_id: 3 }).onConflict().ignore()
      }


      await strapi.db.connection('metric_categories').insert({ id: 4, name: "Estadisticas de juego" }).onConflict().ignore()
      const gameMetrics = [
        { id: 11, name: "Total de tiros", description: "Total de golpes que pasaron la red." },
        { id: 12, name: "Porcentaje de tiros ganadores", description: "Golpes del jugador/a que han forzado al jugador/a rival a desplazarse 2 mts o más para poder devolver la pelota (o intentarlo, en caso de que no haberlo conseguido). Este porcentaje se calcula contra los golpes totales (métrica 11)" },
        { id: 13, name: "Número de tiros ganadores", description: "Nº de los g olpes del jugador/a que han forzado al jugador/a rival a desplazarse 2 mts o más para poder devolver la pelota (o intentarlo, en caso de que no haberlo conseguido)." },
        { id: 14, name: "Porcentaje de errores no forzados", description: "% de tiros del jugador que deja en la red y la bola vino desde zona de defensa del equipo rival. Este porcentaje se calcula contra los golpes totales (métrica 11)" },
        { id: 15, name: "Número de errores no forzados", description: "Nº de tiros del jugador que deja en la red y la bola vino desde zona de defensa del equipo rival." },
        { id: 16, name: "Relación errores vs tiros ganadores", description: "Métrica 15 / métrica 13" },
        { id: 17, name: "Eficiencia en la red", description: "Golpes en zona de ataque (5mts desde la red) vs total de golpes (métrica 11)." },
      ]
      for (const entry of gameMetrics) {
        await strapi.db.connection('metrics').insert({ ...entry, slug: slugify(entry.name, { lower: true, strict: true }) }).onConflict().ignore()
        await strapi.db.connection('metrics_category_links').insert({ metric_id: entry.id, metric_category_id: 4 }).onConflict().ignore()
      }

      await strapi.db.connection('metric_categories').insert({ id: 5, name: "Golpes especiales" }).onConflict().ignore()
      const specialHitMetrics =[
        {id: 18, name:"Globo", description: "Golpes parabólicos donde la pelota supera los 2.5m y que se ejecuta desde los últimos 5 metros de la pista."},
        {id: 19, name:"Golpe de fondo", description: "Golpes ejecutados desde el fondo de pista sin que la pelota alcance una altura superior a los 2.5m a lo largo de su trayectoria."},
        {id: 20, name:"Volea", description: "Golpes ejecutados cerca de la red (a menos de 5 metros de la misma) donde se golpea la pelota antes que bote en el suelo."},
        {id: 21, name:"Bandeja / Víbora", description: "Golpes ofensivos donde la pelota es rematada de arriba a abajo con velocidad superior a 20 km/h e inferior a 65 km/h, típicamente golpeando la pelota por encima de los hombros."},
        {id: 22, name:"Remate", description: "Golpes ofensivos donde la pelota es rematada de arriba a abajo con velocidad superior a 65 km/h, típicamente golpeando la pelota por encima de los hombros."},
      ]
      for (const entry of specialHitMetrics) {
        await strapi.db.connection('metrics').insert({ ...entry, slug: slugify(entry.name, { lower: true, strict: true }) }).onConflict().ignore()
        await strapi.db.connection('metrics_category_links').insert({ metric_id: entry.id, metric_category_id: 5 }).onConflict().ignore()
      }
    })
  }
}
