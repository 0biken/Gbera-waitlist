export const FACULTIES = [
  'Faculty of Agriculture & Forestry',
  'Faculty of Arts',
  'Faculty of Basic Medical Sciences',
  'Faculty of Clinical Sciences',
  'Faculty of Computing',
  'Faculty of Dentistry',
  'Faculty of Education',
  'Faculty of Law',
  'Faculty of Pharmacy',
  'Faculty of Public Health',
  'Faculty of Science',
  'Faculty of Social Sciences',
  'Faculty of Technology',
  'College of Medicine',
  'Institute of African Studies',
  'Institute of Child Health',
  'Other / Not listed',
] as const;

export const YEAR_LEVELS = [
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level',
  '600 Level',
  'Postgraduate',
  'Graduated',
] as const;

export const OCCUPATIONS = [
  'Staff (Academic)',
  'Staff (Non-Academic)',
  'Vendor / Trader',
  'Visitor',
  'Alumni (Non-UI)',
  'Other',
] as const;

export const CAMPUS_ZONES = [
  'Main Gate',
  'Kuti Hall',
  'Faculty of Science',
  'Faculty of Arts',
  'Faculty of Social Sciences',
  'Faculty of Technology',
  'College of Medicine / UCH',
  'Institute of African Studies',
  'Student Union Building (SUB)',
  'University Library',
  'Sports Centre',
  'Mellanby Hall',
  'Idia Hall',
  'Queen Elizabeth Hall',
  'Alexander Brown Hall',
  'Nnamdi Azikiwe Hall',
  'Staff Quarters',
  'Awo Hall',
] as const;

export type Faculty = typeof FACULTIES[number];
export type YearLevel = typeof YEAR_LEVELS[number];
export type Occupation = typeof OCCUPATIONS[number];
export type CampusZone = typeof CAMPUS_ZONES[number];
export type RoleInterest = 'Rider' | 'Driver' | 'Both';

export interface WaitlistFormData {
  email: string;
  phone: string;
  is_ui_student: boolean | null;
  faculty: string;
  year_or_level: string;
  has_graduated: boolean | null;
  occupation: string;
  role_interest: RoleInterest | null;
  uses_keke: boolean | null;
  uses_uber: boolean | null;
  frequency: string;
  preferred_zones: string[];
}

export interface WaitlistStats {
  total_signups: number;
  page_views: number;
}
