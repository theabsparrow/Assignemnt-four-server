export type TRegistrationdata = {
  licensePlate: string;
  vin: string;
  registrationYear: string;
  registrationAuthority: string;
  previousOwner?: string;
  previousOwnerAddress?: string;
  registrationCountry: string;
  roadTaxPaid: true;
};
