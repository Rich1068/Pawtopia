import {
  petType,
  IncludedType,
  PurpleType,
  AgeGroup,
  Sex,
  SizeGroup,
  CoatLength,
} from "../types/pet";

export const mockPets: petType[] = [
  {
    id: "10217455",
    type: "animals" as PurpleType.Animals,
    attributes: {
      adoptedDate: new Date("2017-04-28T00:00:00Z"),
      isAdoptionPending: false,
      ageGroup: "Adult" as AgeGroup.Adult,
      ageString: "10 Years 9 Months",
      birthDate: new Date("2013-06-30T00:00:00Z"),
      isBirthDateExact: false,
      breedString: "Pit Bull Terrier / Mixed (short coat)",
      breedPrimary: "Pit Bull Terrier",
      breedPrimaryId: 179,
      isBreedMixed: true,
      isCatsOk: false,
      coatLength: "Short" as CoatLength.Short,
      isCourtesyListing: false,
      isCurrentVaccinations: true,
      isDeclawed: false,
      descriptionHtml: "<p>Kaia is a sweet and friendly dog...</p>",
      descriptionText: "Kaia is a sweet and friendly dog...",
      isDogsOk: false,
      name: "Kaia Carson",
      pictureCount: 1,
      pictureThumbnailUrl:
        "https://cdn.rescuegroups.org/6690/pictures/animals/10217/10217455/58004491.jpg?width=100",
      searchString:
        "Kaia Carson Black with White Female Medium Pit Bull Terrier",
      sex: "Female" as Sex.Female,
      sizeCurrent: 70,
      sizeGroup: "Medium" as SizeGroup.Medium,
      trackerimageUrl: "https://tracker.rescuegroups.org/pet?10217455",
      url: "https://LastHopeAnimalRescueia.rescuegroups.org/animals/detail?AnimalID=10217455",
      videoCount: 0,
      videoUrlCount: 0,
      createdDate: new Date("2016-06-30T02:33:55Z"),
      updatedDate: new Date("2022-05-09T19:47:03Z"),
      isFound: false,
      priority: 0,
      slug: "",
      isSponsorable: false,
    },
    relationships: {
      breeds: { data: [{ type: "breeds" as IncludedType.Breeds, id: "179" }] },
      species: { data: [{ type: "species" as IncludedType.Species, id: "8" }] }, // Dog species ID
      statuses: {
        data: [{ type: "statuses" as IncludedType.Statuses, id: "1" }],
      },
      locations: {
        data: [
          { type: "locations" as IncludedType.Locations, id: "1000006690" },
        ],
      },
      orgs: { data: [{ type: "orgs" as IncludedType.Orgs, id: "6690" }] },
      pictures: {
        data: [{ type: "pictures" as IncludedType.Pictures, id: "58004491" }],
      },
    },
  },
  {
    id: "20227890",
    type: "animals" as PurpleType.Animals,
    attributes: {
      adoptedDate: new Date("2022-12-15T00:00:00Z"),
      isAdoptionPending: false,
      ageGroup: "Young" as AgeGroup.Young,
      ageString: "2 Years 3 Months",
      birthDate: new Date("2021-01-10T00:00:00Z"),
      isBirthDateExact: true,
      breedString: "Domestic Shorthair / Mixed",
      breedPrimary: "Domestic Shorthair",
      breedPrimaryId: 250,
      isBreedMixed: true,
      isCatsOk: true,
      coatLength: "Short" as CoatLength.Short,
      isCourtesyListing: false,
      isCurrentVaccinations: true,
      isDeclawed: false,
      descriptionHtml: "<p>Milo is a playful and affectionate cat...</p>",
      descriptionText: "Milo is a playful and affectionate cat...",
      isDogsOk: true,
      name: "Milo Whiskers",
      pictureCount: 1,
      pictureThumbnailUrl:
        "https://cdn.rescuegroups.org/6690/pictures/animals/20227/20227890/58004492.jpg?width=100",
      searchString: "Milo Whiskers Gray Male Small Domestic Shorthair",
      sex: "Male" as Sex.Male,
      sizeCurrent: 10,
      sizeGroup: "Small" as SizeGroup.Small,
      trackerimageUrl: "https://tracker.rescuegroups.org/pet?20227890",
      url: "https://LastHopeAnimalRescueia.rescuegroups.org/animals/detail?AnimalID=20227890",
      videoCount: 1,
      videoUrlCount: 1,
      createdDate: new Date("2023-01-05T14:20:00Z"),
      updatedDate: new Date("2024-03-07T08:45:00Z"),
      isFound: false,
      priority: 0,
      slug: "",
      isSponsorable: false,
    },
    relationships: {
      breeds: { data: [{ type: "breeds" as IncludedType.Breeds, id: "250" }] },
      species: { data: [{ type: "species" as IncludedType.Species, id: "2" }] }, // Cat species ID
      statuses: {
        data: [{ type: "statuses" as IncludedType.Statuses, id: "1" }],
      },
      locations: {
        data: [
          { type: "locations" as IncludedType.Locations, id: "1000006690" },
        ],
      },
      orgs: { data: [{ type: "orgs" as IncludedType.Orgs, id: "6690" }] },
      pictures: {
        data: [{ type: "pictures" as IncludedType.Pictures, id: "58004492" }],
      },
    },
  },
];
