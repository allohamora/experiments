const BASE_URL = 'https://delivery.evo.company/handbook/v1';

type City = {
  city_doc_id: string;
  region_doc_id: string;
  city_name: string;
  warehouse: string[];
  door: string[];
  postomate: string[];
  nova_poshta_id: string;
  ukrposhta_id: string;
  meest_id: string;
  rozetka_id: string;
}


const getCities = async (cityName?: string) => {
  const params = new URLSearchParams({ language: 'uk', add_translations: 'true', region_id: '', sort_by: 'entry_index', all_langs_search: 'true', country: 'UA', providers: 'nova_poshta' });
  if (cityName) {
    params.append('city_name', cityName);
  }

  const res = await fetch(`${BASE_URL}/cities?${params.toString()}`, { method: 'GET' });
  const data = await res.json() as { data: { cities: City[] } };

  return data.data.cities.map(city => ({
    cityDocId: city.city_doc_id,
    cityName: city.city_name,
  }));
};

type Limits = {
  send: boolean;
  receive: boolean;
  cod: boolean;
  max_weight: unknown;
  pay_allowed: boolean;
  pay_card_allowed: boolean;
}

type WarehouseLocation = {
  longitude: number;
  latitude: number;
  distance: unknown;
}

type Warehouse = {
  warehouse_doc_id: string;
  warehouse_type: "W" | "P" | {}; // "W" - warehouse, "P" - postomate
  provider: string;
  provider_warehouse_id: string;
  warehouse_number: string;
  city_doc_id: string;
  name: string;
  limits: Limits;
  location: WarehouseLocation;
}


const getWarehouses = async (cityDocId: string) => {
  const params = new URLSearchParams({ city_doc_id: cityDocId, language: 'uk', providers: 'nova_poshta', receive: 'true', country: 'UA' });

  const res = await fetch(`${BASE_URL}/warehouses?${params.toString()}`, { method: 'GET' });
  const data = await res.json() as { data: { warehouses: Warehouse[] } };

  return data.data.warehouses.map(warehouse => ({
    name: warehouse.name,
    warehouseNumber: warehouse.warehouse_number,
    warehouseType: warehouse.warehouse_type,
  }));
};

type Street = {
  street_id: string,
  name: string,
  providers: string[],
  provider_ids: {
    nova_poshta: string,
    meest: null,
    ukrposhta: null
  }
};

const getStreets = async (cityDocId: string, name: string) => {
  const params = new URLSearchParams({ city_doc_id: cityDocId, name, providers: 'nova_poshta', language: 'uk' });

  const res = await fetch(`${BASE_URL}/streets?${params.toString()}`, { method: 'GET' });
  const data = await res.json() as { data: { streets: Street[] } };

  return data.data.streets.map(street => ({
    streetId: street.street_id,
    name: street.name,
  }));
};

const main = async () => {
  const [city] = await getCities('Київ');
  console.log(city);

  const [warehouse] = await getWarehouses(city.cityDocId);
  console.log(warehouse);

  const [street] = await getStreets(city.cityDocId, 'Шевченка');
  console.log(street);
};

void main();
