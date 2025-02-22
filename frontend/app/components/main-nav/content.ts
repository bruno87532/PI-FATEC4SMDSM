type subCategories = Record<string, string>;
export type categories = {
    "Bebidas alcóolicas": subCategories;
    "Bebidas não alcóolicas": subCategories;
    "Carnes": subCategories;
    "Frios e embutidos": subCategories;
    "Padaria": subCategories;
    "Mercearia": subCategories;
    "Limpeza": subCategories;
    "Hortifruti": subCategories;
}

export const mainContent = [
    {
        "Bebidas alcóolicas": {
            "Cervejas e Chopes": "/",
            "Vinhos e Espumantes": "/",
            "Destilados": "/",
            "Licores": "/"
        }
    },
    {
        "Bebidas não alcóolicas": {
            "Águas": "/",
            "Refrigerantes": "/",
            "Sucos e Chás": "/",
            "Energéticos e Isotônicos": "/"
        }
    },
    {
        "Carnes": {
            "Bovinos": "/",
            "Suínos": "/",
            "Aves": "/",
            "Peixes e Frutos do Mar": "/"
        }
    },
    {
        "Frios e embutidos": {
            "Queijos": "/",
            "Presuntos e Apresuntados": "/",
            "Salames e Embutidos": "/",
            "Iogurtes e Laticínios": "/"
        }
    }, 
    {
        "Padaria": {
            "Pães": "/",
            "Bolos e Tortas": "/",
            "Salgados": "/",
            "Doces e Confeitaria": "/"
        }
    },
    {
        "Mercearia": {
            "Grãos e Cereais": "/",
            "Massas e Farinhas": "/",
            "Óleos e Condimentos": "/",
            "Enlatados e Conservas": "/"
        }
    },
    {
        "Limpeza": {
            "Detergentes e Sabões": "/",
            "Desinfetantes e Multiuso": "/",
            "Amaciantes e Produtos para Roupas": "/",
            "Esponjas e Utensílios": "/"
        }
    },
    {
        "Hortifruti": {
            "Frutas": "/",
            "Verduras": "/",
            "Legumes": "/",
            "Temperos e Ervas": "/",
            "Orgânicos": "/"
        }
    }
];
