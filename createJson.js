const fs = require('fs');
const csv = require('csv-parser');

const dataCSV = 'dados.csv';
const resultValue = [];
const revenueValues = [];

function calcMedia(values) {
    if (values.length === 0) {
        return 0;
    }
    const total = values.reduce((accumulator, value) => accumulator + value, 0);
    return total / values.length;
}

function findDayWithHighestRevenue(value) {
    return value.reduce((higherDay, day) => {
        const currentRevenue = parseInt(day.Refrigerante) + parseInt(day.Água) + parseInt(day.Picolé) + parseInt(day.Sorvete);
        const higherRevenue = parseInt(higherDay.Refrigerante) + parseInt(higherDay.Água) + parseInt(higherDay.Picolé) + parseInt(higherDay.Sorvete);
        return currentRevenue > higherRevenue ? day : higherDay;
    }, value[0]);
}

function findDayWithLowestRevenue(value) {
    return value.reduce((lowerDay, day) => {
        const currentRevenue = parseInt(day.Refrigerante) + parseInt(day.Água) + parseInt(day.Picolé) + parseInt(day.Sorvete);
        const lowerRevenue = parseInt(lowerDay.Refrigerante) + parseInt(lowerDay.Água) + parseInt(lowerDay.Picolé) + parseInt(lowerDay.Sorvete);
        return currentRevenue < lowerRevenue ? day : lowerDay;
    }, value[0]);
}

fs.createReadStream(dataCSV).pipe(csv()).on('data', (row) => {
    resultValue.push(row);
    revenueValues.push(parseInt(row.Refrigerante),parseInt(row.Água) + parseInt(row.Picolé) + parseInt(row.Sorvete));
}).on('end', () => {

    const averageRevenue = calcMedia(revenueValues);

    const dayWithHighestRevenue = findDayWithHighestRevenue(resultValue);
    const dayWithLowestRevenue = findDayWithLowestRevenue(resultValue);

    const highestRevenueValues = parseInt(dayWithHighestRevenue.Refrigerante) + parseInt(dayWithHighestRevenue.Água) + parseInt(dayWithHighestRevenue.Picolé) + parseInt(dayWithHighestRevenue.Sorvete);
    const lowestRevenueValues = parseInt(dayWithLowestRevenue.Refrigerante) + parseInt(dayWithLowestRevenue.Água) + parseInt(dayWithLowestRevenue.Picolé) + parseInt(dayWithLowestRevenue.Sorvete);

    const mediaFixed = averageRevenue.toFixed(2)

    console.log('Leitura do arquivo CSV concluída.');

    const createJSON = {
        MediadeFaturamento: mediaFixed,
        DiadeMaiorFaturamento: dayWithHighestRevenue.Data,
        DiadeMenorFaturamento: dayWithLowestRevenue.Data,
        ValorDoDiaComMenorFaturamento: lowestRevenueValues,
        ValorDoDiaComMaiorFaturamento: highestRevenueValues,
    };

    const jsonString = JSON.stringify(createJSON);

    const createJson = 'valores.json';

    fs.writeFileSync(createJson, jsonString);

}).on('error', (error) => {
    console.error('Erro ao ler o arquivo CSV:', error);
});