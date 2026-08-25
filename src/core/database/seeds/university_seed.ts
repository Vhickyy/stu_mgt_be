import { University } from 'src/features/student/universities/entity/UniversityEntity';
import { Repository } from 'typeorm';

const UNIVERSITIES_API = 'http://universities.hipolabs.com/search';

const BATCH_SIZE = 500;

interface UniversityApiResponse {
  'state-province': string | null;
  name: string;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
  country: string;
}

export async function seedUniversities(repository: Repository<University>) {
  console.log('Fetching universities...');

  const response = await fetch(UNIVERSITIES_API);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch universities: ${response.status} ${response.statusText}`,
    );
  }

  const universities: UniversityApiResponse[] = await response.json();

  console.log(`Fetched ${universities.length} universities`);

  const records = universities
    .filter((university) => university.name?.trim())
    .map((university) => {
      const countryCode = university.alpha_two_code.toUpperCase();
      const name = university.name.trim();

      return {
        name,
        country: university.country,
        alphaTwoCode: countryCode,
        stateProvince: university['state-province'],
        domains: university.domains ?? [],
        webPages: university.web_pages ?? [],

        // Country + normalized university name
        uniqueKey: `${countryCode}:${name.toLowerCase()}`,
      };
    });

  console.log(`Prepared ${records.length} universities`);

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);

    await repository
      .createQueryBuilder()
      .insert()
      .into(University)
      .values(batch)
      .orIgnore()
      .execute();

    const completed = Math.min(i + BATCH_SIZE, records.length);

    console.log(`Seeded ${completed}/${records.length}`);
  }

  console.log('University seeding completed successfully.');
}
// import { University } from 'src/features/student/universities/entity/UniversityEntity';
// import { DataSource } from 'typeorm';

// interface HipolabsUniversity {
//   name: string;
//   country: string;
//   alpha_two_code: string;
//   'state-province': string | null;
//   domains: string[];
//   web_pages: string[];
// }

// export async function seedUniversities(dataSource: DataSource) {
//   const repository = dataSource.getRepository(University);

//   console.log('Fetching universities...');

//   const response = await fetch('http://universities.hipolabs.com/search');

//   if (!response.ok) {
//     throw new Error(`Failed to fetch universities: ${response.status}`);
//   }

//   const universities = (await response.json()) as HipolabsUniversity[];

//   console.log(`Fetched ${universities.length} universities`);

//   const data = universities.map((university) => {
//     const name = university.name.trim();
//     const alphaTwoCode = university.alpha_two_code.trim().toUpperCase();

//     return {
//       name,
//       country: university.country.trim(),
//       alphaTwoCode,
//       stateProvince: university['state-province']?.trim() ?? null,
//       domains: university.domains ?? [],
//       webPages: university.web_pages ?? [],
//       uniqueKey: `${alphaTwoCode}:${name.toLowerCase()}`,
//     };
//   });

//   await repository.upsert(data, {
//     conflictPaths: ['uniqueKey'],
//   });

//   console.log(`Seeded ${data.length} universities`);
// }
