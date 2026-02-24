
import { generateSearchUrl } from './services/urlUtils';
import * as fs from 'fs';
import * as path from 'path';

const testCases = [
    { store: 'Mundo Mascota', product: 'Royal Canin' },
    { store: 'Tienda Inglesa', product: 'Pro Plan' },
    { store: 'Nueva Era', product: 'Frost' },
    { store: 'Ciudad Aventura', product: 'Kong' },
    { store: 'Distribuidora Lopez', product: 'Pedigree' },
    { store: 'Forever Pets', product: 'Cat Chow' },
    { store: 'Pet.uy', product: 'Whiskas' },
    { store: 'DogCenter', product: 'Eukanuba' },
    { store: 'TatuPet', product: 'Old Prince' },
    { store: 'Turacion', product: 'Sieger' }
];

const results = testCases.map(({ store, product }) => {
    const url = generateSearchUrl(store, product);
    return `Store: "${store}", Product: "${product}" => URL: ${url}`;
});

const output = '--- TEST RESULTS START ---\n' + results.join('\n') + '\n--- TEST RESULTS END ---';
console.log(output);
try {
    fs.writeFileSync(path.resolve('test_results.log'), output, 'utf8');
} catch (e) {
    console.error('Error writing file:', e);
}
