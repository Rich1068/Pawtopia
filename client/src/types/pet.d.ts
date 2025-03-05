export interface Pet {
  meta: Meta;
  data: petType[];
  included: Included[];
}

export interface petType {
  type: PurpleType;
  id: string;
  attributes: DatumAttributes;
  relationships: Relationships;
}

export interface DatumAttributes {
  adoptedDate?: Date;
  isAdoptionPending: boolean;
  ageGroup?: AgeGroup;
  ageString?: string;
  birthDate?: Date;
  isBirthDateExact: boolean;
  breedString: string;
  breedPrimary: string;
  breedPrimaryId: number;
  breedSecondary?: string;
  breedSecondaryId?: number;
  colorDetails?: string;
  isCourtesyListing: boolean;
  descriptionHtml: string;
  descriptionText: string;
  isNeedingFoster?: boolean;
  isFound: boolean;
  priority: number;
  name: string;
  pictureCount: number;
  pictureThumbnailUrl?: string;
  searchString: string;
  sex: Sex;
  sizeUOM?: SizeUOM;
  slug: string;
  isSponsorable: boolean;
  trackerimageUrl: string;
  url?: string;
  videoCount: number;
  videoUrlCount: number;
  createdDate: Date;
  updatedDate: Date;
  isCurrentVaccinations?: boolean;
  newPeopleReaction?: string;
  adoptionFeeString?: string;
  availableDate?: Date;
  isBreedMixed?: boolean;
  isCatsOk?: boolean;
  isDogsOk?: boolean;
  isHousetrained?: boolean;
  isKidsOk?: boolean;
  killReason?: string;
  qualities?: string[];
  rescueId?: string;
  sizeCurrent?: number;
  sizeGroup?: SizeGroup;
  coatLength?: CoatLength;
  isDeclawed?: boolean;
  isSpecialNeeds?: boolean;
  summary?: string;
  activityLevel?: string;
  indoorOutdoor?: string;
  foundPostalcode?: string;
  ownerExperience?: string;
  foundDate?: Date;
}

export enum AgeGroup {
  Adult = "Adult",
  Baby = "Baby",
  Young = "Young",
  Senior = "Senior",
}

export enum CoatLength {
  Long = "Long",
  Medium = "Medium",
  Short = "Short",
}

export enum Sex {
  Female = "Female",
  Male = "Male",
}

export enum SizeGroup {
  Large = "Large",
  Medium = "Medium",
  Small = "Small",
  XLarge = "X-Large",
}

export enum SizeUOM {
  Pounds = "Pounds",
}

export interface Relationships {
  breeds: Breeds;
  species: Breeds;
  statuses: Breeds;
  locations: Breeds;
  orgs: Breeds;
  pictures?: Breeds;
  colors?: Breeds;
  videourls?: Breeds;
  patterns?: Breeds;
}

export interface Breeds {
  data: BreedsDatum[];
}

export interface BreedsDatum {
  type: IncludedType;
  id: string;
}

export enum IncludedType {
  Breeds = "breeds",
  Colors = "colors",
  Locations = "locations",
  Orgs = "orgs",
  Patterns = "patterns",
  Pictures = "pictures",
  Species = "species",
  Statuses = "statuses",
  Videourls = "videourls",
}

export enum PurpleType {
  Animals = "animals",
}

export interface Included {
  type: IncludedType;
  id: string;
  attributes: IncludedAttributes;
  links?: Links;
}

export interface IncludedAttributes {
  name?: string;
  singular?: string;
  plural?: string;
  youngSingular?: string;
  youngPlural?: string;
  description?: string;
  street?: string;
  city?: string;
  state?: string;
  citystate?: string;
  postalcode?: string;
  country?: Country;
  phone?: string;
  lat?: number;
  lon?: number;
  coordinates?: string;
  email?: string;
  url?: string;
  facebookUrl?: string;
  type?: AttributesType;
  original?: Large;
  large?: Large;
  small?: Large;
  order?: number;
  created?: Date | null;
  updated?: Date;
  adoptionProcess?: string;
  about?: string;
  services?: string;
  videoId?: string;
  urlThumbnail?: string;
  postalcodePlus4?: string;
  adoptionUrl?: string;
  donationUrl?: string;
  sponsorshipUrl?: string;
}

export enum Country {
  UnitedStates = "United States",
}

export interface Large {
  filesize: number;
  resolutionX: number;
  resolutionY: number;
  url: string;
}

export enum AttributesType {
  Rescue = "Rescue",
  Shelter = "Shelter",
}

export interface Links {
  self: string;
}

export interface Meta {
  count: number;
  countReturned: number;
  pageReturned: number;
  limit: number;
  pages: number;
  transactionId: string;
}
