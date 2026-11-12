export interface Profile {
  name: string;
  headline: string;
  cityCountry: string;
  email: string;
  github: string;
  linkedin: string;
  about: string;
  education: string;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    stack: string;
    link: string;
  }>;
  experience: {
    role: string;
    org: string;
    dates: string;
    bullets: string[];
  };
  achievements: string[];
}

export const PROFILE: Profile = {
  name: 'Alex Rivera',
  headline: 'Data Engineer Intern',
  cityCountry: 'San Francisco, CA',
  email: 'alex.rivera.de@example.com',
  github: 'https://github.com/alexrivera-de',
  linkedin: 'https://linkedin.com/in/alexrivera-de',
  about:
    'Aspiring Data Engineer with a focus on high-throughput stream ingestion and scalable distributed transformations. Passionate about building robust, reproducible data pipelines using modern lakehouse architectures.',
  education: 'B.S. in Computer Science, State University, 2025',
  skills: [
    'Python',
    'SQL',
    'Spark',
    'Kafka',
    'Airflow',
    'dbt',
    'Docker',
    'AWS/GCP basics',
    'Git',
  ],
  projects: [
    {
      name: 'StreamPulse',
      description: 'Real-time financial telemetry ingestion and anomaly detection pipeline.',
      stack: 'Kafka, PySpark, Delta Lake, Docker',
      link: 'https://github.com/example/streampulse',
    },
    {
      name: 'LakeForge',
      description: 'Automated dbt transformation pipeline models for retail analytics.',
      stack: 'dbt, DuckDB, Airflow, SQL',
      link: 'https://github.com/example/lakeforge',
    },
    {
      name: 'TelemetrySync',
      description: 'Distributed IoT metrics sync and aggregation with Parquet storage.',
      stack: 'Python, FastAPI, Spark, AWS S3',
      link: 'https://github.com/example/telemetrysync',
    },
  ],
  experience: {
    role: 'Data Platform Intern',
    org: 'Nexus Data Labs',
    dates: 'Jun 2024 - Sep 2024',
    bullets: [
      'Built automated streaming pipelines processing 1.5M daily events with Kafka and Spark.',
      'Optimized warehouse partition schemes, reducing query latency by 35%.',
      'Developed dbt data quality assertion tests to catch upstream schema drift.',
    ],
  },
  achievements: [
    'AWS Certified Data Engineer - Associate',
    '1st Place - University Hackathon: Big Data Analytics Track',
    'Dean’s Honor List: 2023 - 2024',
  ],
};

