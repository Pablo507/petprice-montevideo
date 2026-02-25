import requests # type: ignore
import re

def scrape_site(url, name):
    """
    Función para extraer y analizar precios y pesos de sitios de mascotas.
    Calcula automáticamente el precio por kilo para facilitar la comparación.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        print(f"\n{'='*60}")
        print(f"SITIO: {name}")
        print(f"URL: {url}")
        print(f"ESTADO: {response.status_code}")
        print(f"{'='*60}")

        if response.status_code == 200:
            # Buscamos patrones de precios ($ 1.250 o $1250)
            prices = re.findall(r'\$\s?(\d+(?:\.\d{3})*(?:,\d{2})?)', response.text)
            # Buscamos pesos (15kg, 7.5 kg, 3 kg)
            weights = re.findall(r'(\d+(?:[\.,]\d+)?)\s?kg', response.text, re.IGNORECASE)

            print(f"Se encontraron {len(prices)} menciones de precios y {len(weights)} menciones de pesos.")

            # Limpiamos y convertimos para lógica de cálculo (ejemplo con los primeros encontrados)
            if len(prices) > 0 and len(weights) > 0:
                try:
                    # Limpieza básica para convertir a float (asumiendo formato uruguayo)
                    raw_price = prices[0].replace('.', '').replace(',', '.')
                    price_val = float(raw_price)
                    weight_val = float(weights[0].replace(',', '.'))
                    
                    price_per_kg = price_val / weight_val
                    print(f"\n[ANALISIS DE MUESTRA]")
                    print(f" > Precio detectado: ${price_val}")
                    print(f" > Peso detectado: {weight_val} kg")
                    print(f" > PRECIO POR KILO: ${price_per_kg:.2f}")
                except Exception as eval_e:
                    print(f"Error al calcular precio por kilo: {eval_e}")

            # Mostrar un extracto para depuración
            print(f"\n[VISTA PREVIA DEL HTML]:\n{response.text[:500]}...")
        else:
            print(f"No se pudo acceder al sitio {name}. Código de error: {response.status_code}")

    except Exception as e:
        print(f"Error al procesar {name}: {e}")

# Lista completa de las 10 fuentes recomendadas para Montevideo
sites = [
    ("Pet.uy", "https://www.pet.uy/perros/alimento-seco/"),
    ("TatuPet", "https://tatupet.com.uy/categoria-producto/perros/alimentos-perros/"),
    ("Mundo Mascota", "https://mundomascota.uy/categoria-producto/perros/alimentos-secos-perros/"),
    ("Nueva Era", "https://nuevaerauruguay.com/categoria-producto/perros/alimento/"),
    ("Tienda Inglesa", "https://www.tiendainglesa.com.uy/busqueda?0,0,alimento%20perro,0"),
    ("Geant", "https://www.geant.com.uy/mascotas/perros/alimento"),
    ("Disco", "https://www.disco.com.uy/products/category/mascotas/15"),
    ("Punto Mascota", "https://www.puntomascota.com.uy/categoria/perros/alimento-perros/"),
    ("Hocicos", "https://hocicos.com.uy/categoria-producto/perros/alimento-seco-perro/"),
    ("La Mascoteria", "https://lamascoteria.com.uy/categoria-producto/perros/alimento-perros/")
]

# Ejecución del scraper
if __name__ == "__main__":
    print("Iniciando relevamiento de precios en Montevideo...")
    for name, url in sites:
        scrape_site(url, name)
        