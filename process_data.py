
import csv

data_raw = """
Mundo Mascota|Pro Plan Sterilized Cat (gatos Castrados)|535|1
Mundo Mascota|Pro Plan Cat Urinary Care Gato Adulto|535|1
Mundo Mascota|Frost Cat Gato Adulto Indoor|546|1.5
Mundo Mascota|Select By Monello Gato Adulto Skin And Coat|625|1.5
Mundo Mascota|Select By Monello Gato Adulto Castrado|625|1.5
Mundo Mascota|Select By Monello Gato Madres y Gatitos Lactantes|633|1.5
Mundo Mascota|Premier Ambientes Internos Gato Adulto|765|1.5
Mundo Mascota|Bionatural Prime Gato Adulto Castrado|711|1.5
Mundo Mascota|Cat Chow Gato Adulto Sabor Carne y Pollo|683|3
Mundo Mascota|Cat Chow Gato Adulto Pescado y Pollo|683|3
Mundo Mascota|Gran Plus Menú Gato Adulto / Salmón y Arroz|757|3
Mundo Mascota|Gran Plus Menú Gato Adulto Castrado / Pollo y Arroz|757|3
Mundo Mascota|Guabi Natural Grain Free Gato Castrado / Salmon Lenteja|757|1.5
Mundo Mascota|Balanced Natural Recipe Gato Adulto Salmón Rosado|791|3
Mundo Mascota|Gran Plus Gourmet Gato Adulto Castrado / Salmón y Pollo|799|3
Ciudad Aventura|Hills – Prescription Diet R/D – Pérdida de Peso|3400|3.9
Ciudad Aventura|Hills Canine Science Diet – Adult 7+ – Small Paws|1349|2.5
Ciudad Aventura|Bionatural Prime Senior + 7 Razas Pequeñas|399|1
Ciudad Aventura|Bionatural Prime Perros Senior +7 Razas Medianas y Grandes|3590|15
Ciudad Aventura|Bionatural Prime Perros light/cast Razas Medianas y Grandes|3590|15
Ciudad Aventura|Bionatural Prime Perros Junior Razas Pequeñas|720|2.5
Ciudad Aventura|Bionatural Prime Perros Cachorro Razas Medianas y Grandes|799|2.5
Ciudad Aventura|Bionatural Prime Perros Adulto Razas Pequeñas Sabor Pollo|690|2.5
Ciudad Aventura|Bionatural Prime Perros Adulto Razas Pequeñas Sabor Pollo|2450|10.1
Ciudad Aventura|Bionatural Prime Perros Ad. Razas Medianas y Grandes|790|2.5
Ciudad Aventura|Bionatural Prime Light/Cast Razas Pequeñas|690|2.5
Ciudad Aventura|Bionatural Prime Junior Razas Pequeñas|399|1
Ciudad Aventura|Bionatural Prime Cachorro Razas Medianas y Grandes|3590|15
Ciudad Aventura|Bionatural Prime Adulto Razas Pequeñas Sabor Pollo|399|1
Ciudad Aventura|Bionatural Prime Adulto Razas Pequeñas Sabor Cordero|690|2.5
Ciudad Aventura|Bionatural Prime Adulto Razas Pequeñas Sabor Cordero|2490|10.1
Ciudad Aventura|Bionatural Prime Adulto Razas Medianas y Grandes|3490|15
Ciudad Aventura|Frost Adult – Mini & Small|3024|10.1
Ciudad Aventura|Alimento Hills Canine Science Diet – Puppy Original|6188|12.5
Ciudad Aventura|Alimento Equilibrio Dog Small Puppy Chicken|610|1.5
Ciudad Aventura|Alimento Equilibrio Dog Medium Puppy Chicken|889|2.5
Ciudad Aventura|Alimento Equilibrio Dog Medium Adult Chicken|782|2.5
Ciudad Aventura|Alimento Hills Canine Science Diet – Adult – Small Bites|1263|2
Ciudad Aventura|Alimento VIRBAC – HPM SENIOR DOG LARGE & MEDIUM|2003|3
Ciudad Aventura|Alimento VIRBAC – HPM SENIOR DOG LARGE & MEDIUM|5285|12
Ciudad Aventura|Alimento VIRBAC – HPM ADULT DOG SMALL & TOY|3825|7
Ciudad Aventura|Alimento VIRBAC – HPM ADULT DOG LARGE & MEDIUM|1785|3
Ciudad Aventura|Alimento VIRBAC – HPM ADULT DOG LARGE & MEDIUM|4709|12
Ciudad Aventura|Alimento ASTRO SENIOR|2801|14
Ciudad Aventura|Alimento ASTRO SELECTION|2538|17
Ciudad Aventura|Alimento ASTRO PEQUEÑAS RAZAS|2840|14
Ciudad Aventura|Alimento ASTRO JUNIOR|2823|14
Ciudad Aventura|Alimento Frost Puppy – Mini & Small|1172|2.5
Ciudad Aventura|Alimento Frost Puppy – Mini & Small|563|1
Ciudad Aventura|Alimento Frost Puppy – Mini & Small|3217|10.1
Ciudad Aventura|Alimento Frost Puppy – Medium & Large|4252|17
Ciudad Aventura|Alimento Frost Dog Senior Medium & Large|4216|15
Ciudad Aventura|Alimento Frost Adult Light – All Breeds|3855|15
Ciudad Aventura|Alimento Frost Adult Mini & Small|915|2.5
Ciudad Aventura|Alimento Frost Adult – Mini & Small|427|1
Ciudad Aventura|Alimento Frost Adult Medium & Large|3736|17
Ciudad Aventura|Alimento GRANPLUS GOURMET PERRO AD MED Y GRAND|2090|10.1
Ciudad Aventura|Alimento GRANPLUS GOURMET PERRO AD MINI|2090|10.1
Ciudad Aventura|Alimento GRANPLUS GOURMET PERRO AD MINI|790|3
Ciudad Aventura|Alimento GRANPLUS MENU PERRO SEN|2490|15
Ciudad Aventura|Alimento GRANPLUS MENU PERRO SEN|690|3
Ciudad Aventura|Alimento GRANPLUS MENU PERRO SEN MINI|2100|10.1
Distribuidora Lopez|Tiernitos Selection Cachorro|250|1.5
Distribuidora Lopez|Alimento para Perro Adulto Rex|365|7
Distribuidora Lopez|Tiernitos Selection Adulto|405|3
Distribuidora Lopez|Tiernitos Selection Cachorro|490|3
Distribuidora Lopez|Alimento Primoção Original Para Perro Adulto|640|7
Distribuidora Lopez|Connie Perro Cachorro|827|8
Distribuidora Lopez|Prot 21|830|15
Distribuidora Lopez|Brit Premium Adulto L Raza Grande|950|3
Distribuidora Lopez|Toky Perros Adultos|965|25
Distribuidora Lopez|Brit Adulto Raza Grande|990|3
Distribuidora Lopez|Brit Premium Adulto S Raza Pequeña|1050|3
Forever Pets|BIOFRESH Alimento Gatos Castrados Salmón|4250|7.5
Forever Pets|Balanced Natural Recipe Gato Adulto Salmon Rosado|2190|7.5
Nueva Era|Astro Adulto Small Breeds|2389|14
Nueva Era|Astro Junior|2540|14
Nueva Era|Astro Selection|2280|17
Nueva Era|Astro Senior|2550|14
Nueva Era|Balanced Senior Raza Pequeña|1071|3
Nueva Era|Balanced Senior Raza Pequeña|1997.5|7.5
Nueva Era|Balanced Adulto Natural Recipe Carne Seleccionada|3300|15
TatuPet|RAZA Perro Adultos mayores de 7 años|1780|15
TatuPet|Alimento Gaucho para Gato|1395|15
TatuPet|Alimento Gaucho para Perro|126|1.5
TatuPet|Capitán Adulto|1705|22
TatuPet|Capitán Perro Cachorro|1399|15
TatuPet|Equilibrio Adulto|3539|18
TatuPet|RAZA Adulto|1830|21
TatuPet|Nutrapet Natural Dog Premium para perro adulto|2000|22
TatuPet|MisterPet Adulto Premium|2500|20
TatuPet|NextFeed Super Premium|2885|15
TatuPet|MisterPet High Performance|2805|20
"""

existing_data = [
    ["turacion.com","Axell Perro Adulto",790,8],
    ["turacion.com","Axell Perro Adulto",1890,22],
    ["turacion.com","Astro Small Breed",1389,7],
    ["turacion.com","Astro Senior",1335,7],
    ["turacion.com","Astro Senior",2340,14],
    ["turacion.com","Pedigree Razas Pequeñas",2841,21],
    ["turacion.com","Pedigree Vegetales",2632,21],
    ["turacion.com","Rex Adulto",1050,25],
    ["turacion.com","Rex Adulto",470,7],
    ["turacion.com","Balanced Cordero",900,3],
    ["turacion.com","Astro Cat Gourmet Adulto",1725,7],
    ["turacion.com","Jazz Gatos Adultos",1925,20],
    ["turacion.com","Maxine Gato Castrados",1870,7.5],
    ["dogcenter.uy","Vitalcan Therapy Gastrointestinal Gato",1450,2],
    ["dogcenter.uy","Vitalcan Therapy Salud Urinaria Gato",1450,2],
    ["dogcenter.uy","Vitalcan Therapy Salud Urinaria Gato",3900,7.5],
    ["dogcenter.uy","Vitalcan Therapy Salud Renal Gato",1200,2],
    ["dogcenter.uy","Vitalcan Therapy Hipoalergénico Gato",1750,2],
    ["dogcenter.uy","Vitalcan Therapy Manejo de Obesidad Gato",1550,2],
    ["dogcenter.uy","PRO PLAN URINARY",3300,7.5],
    ["dogcenter.uy","PRO PLAN GATO ADULTO LIVE CLEAR",1900,3],
    ["dogcenter.uy","PRO PLAN URINARY",600,1],
    ["dogcenter.uy","Royal Canin Veterinary Gastrointestinal Gato",1850,2],
    ["tiendainglesa.com.uy","Whiskas Castrados",455,1],
    ["tiendainglesa.com.uy","MIMOS Gato",275,1],
    ["tiendainglesa.com.uy","Cat Chow Gato Adulto",542,1],
    ["tiendainglesa.com.uy","Lager Perro Adulto",520,22]
]

final_rows = []
header = ["Source", "Product_Name", "Price_Actual_UYU", "Weight_kg", "Precio_Por_Kilo"]

for row in existing_data:
    src, name, price, weight = row
    ppk = round(price / weight, 2)
    final_rows.append([src, name, price, weight, ppk])

for line in data_raw.strip().split("\n"):
    parts = line.split("|")
    if len(parts) == 4:
        src, name, price, weight = parts
        try:
            price_val = float(price.replace(".", "").replace(",", "."))
            # Some prices might be like 1.263 -> handled by replacing dot then comma
            # Actually cleaning:
            price_clean = price.replace(".", "")
            price_val = float(price_clean.replace(",", "."))
            
            weight_clean = weight.replace(",", ".")
            weight_val = float(weight_clean)
            
            ppk = round(price_val / weight_val, 2)
            final_rows.append([src, name, price_val, weight_val, ppk])
        except Exception as e:
            print(f"Error parsing line: {line} - {e}")

with open(r"C:\Users\Usuario\.gemini\antigravity\brain\29aeaabb-159d-4bcb-9dfb-bb0219b0384a\petprice_database.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(final_rows)

print("CSV created successfully.")
