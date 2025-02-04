export type Tcategory = 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible';

export type Tcar = {
  brand: string;
  model: string;
  year: number;
  price: number;
  category: Tcategory;
  description: string;
  quantity: number;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Tquery = { searchTerm?: string };
