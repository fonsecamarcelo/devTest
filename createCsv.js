const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const apiUrl = 'https://api.weatherbit.io/v2.0/history/daily?city_id=3399415&start_date=2023-08-01&end_date=2023-08-31&key=eff9b395428d41b4ad4fa4171beacb2a';

const csvWriter = createCsvWriter({
    path: 'weatherHistory.csv',
    header: [
        { id: 'days', title: 'dias' },
        { id: 'minTemperature', title: 'temperatura minima' },
        { id: 'maxTemperature', title: 'temperatura maxima' },
        { id: 'maxWindSpeed', title: 'velocidade maxima do vento' },
        { id: 'cloudCover', title: 'cobertura das nuvens' },
    ],
});

async function fetchData() {
    try {
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        const extractedData = data.map((day) => ({
            days: day.datetime,
            minTemperature: day.min_temp,
            maxTemperature: day.max_temp,
            maxWindSpeed: day.max_wind_spd,
            cloudCover: day.clouds,
        }))

        csvWriter.writeRecords(extractedData, () => {
            console.log('CSV criado com sucesso.');
        }).catch(error => {
            console.error('Erro ao criar o CSV:', error);
        });

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}
fetchData();