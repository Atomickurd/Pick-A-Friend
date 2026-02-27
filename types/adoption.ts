export type AdoptionStatus = 'available' | 'pending' | 'adopted';

export interface AdoptionDog {
  id: string;
  shelterUid: string;
  shelterName: string;
  name: string;
  breed: string;
  gender: 'male' | 'female';
  ageMonths: number;
  weightKg: number;
  photoURLs: string[];
  bio: string;
  traits: string[];
  isNeutered: boolean;
  isVaccinated: boolean;
  isMicrochipped: boolean;
  status: AdoptionStatus;
  applicationCount: number;
  createdAt: string;
}

export interface AdoptionApplication {
  id: string;
  dogId: string;
  applicantUid: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
