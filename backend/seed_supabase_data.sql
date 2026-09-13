-- SIH 2026: Official Statistical System Learning Platform
-- SQL Script to Populate ALL Supabase PostgreSQL Tables with Mock Data

-- 1. DEPARTMENTS
INSERT INTO public.departments (id, name, code, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ministry of Statistics and Programme Implementation', 'MOSPI', 'Central Ministry responsible for official statistics'),
  ('22222222-2222-2222-2222-222222222222', 'National Sample Survey Office', 'NSSO', 'Conducts large-scale national sample surveys'),
  ('33333333-3333-3333-3333-333333333333', 'Field Operations Division', 'FOD', 'Field data collection operations'),
  ('44444444-4444-4444-4444-444444444444', 'National Data Bank & Analytics Directorate', 'NDBAD', 'Data warehouse and analytics platform'),
  ('55555555-5555-5555-5555-555555555555', 'Economic Statistics Division', 'ESD', 'Compiles national accounts, CPI and IIP statistics')
ON CONFLICT (name) DO NOTHING;

-- 2. COMPETENCIES FRAMEWORK
INSERT INTO public.competencies (id, name, domain, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Survey Design', 'statistical', 'Design of statistical surveys and instruments.'),
  ('a0000000-0000-0000-0000-000000000002', 'Sampling', 'statistical', 'Sampling methods and survey sampling techniques.'),
  ('a0000000-0000-0000-0000-000000000003', 'National Accounts', 'statistical', 'National accounting concepts and methods.'),
  ('a0000000-0000-0000-0000-000000000004', 'Price Statistics', 'statistical', 'Compilation and interpretation of price statistics.'),
  ('a0000000-0000-0000-0000-000000000005', 'Labour Statistics', 'statistical', 'Concepts and methods for labour statistics.'),
  ('a0000000-0000-0000-0000-000000000006', 'Agricultural Statistics', 'statistical', 'Collection and analysis of agricultural statistics.'),
  ('a0000000-0000-0000-0000-000000000007', 'Industrial Statistics', 'statistical', 'Collection and analysis of industrial statistics.'),
  ('a0000000-0000-0000-0000-000000000008', 'SDG Indicators', 'statistical', 'Statistical indicators supporting SDG monitoring.'),
  ('a0000000-0000-0000-0000-000000000009', 'Metadata Standards', 'statistical', 'Metadata standards for official statistics.'),
  ('a0000000-0000-0000-0000-000000000010', 'Data Quality Frameworks', 'statistical', 'Quality dimensions and frameworks for statistical data.'),
  ('b0000000-0000-0000-0000-000000000001', 'Python', 'technical', 'Python programming for data analysis and statistical work.'),
  ('b0000000-0000-0000-0000-000000000002', 'R', 'technical', 'R programming for statistical computing.'),
  ('b0000000-0000-0000-0000-000000000003', 'SQL', 'technical', 'Relational data querying and database operations.'),
  ('b0000000-0000-0000-0000-000000000004', 'GIS', 'technical', 'Geospatial analysis and geographic information systems.'),
  ('b0000000-0000-0000-0000-000000000005', 'Data Visualization', 'technical', 'Data presentation and visual analytics.'),
  ('b0000000-0000-0000-0000-000000000006', 'AI/ML', 'technical', 'Artificial intelligence and machine learning.'),
  ('b0000000-0000-0000-0000-000000000007', 'Cloud Computing', 'technical', 'Cloud platforms and services.'),
  ('b0000000-0000-0000-0000-000000000008', 'APIs', 'technical', 'API use and integration.'),
  ('b0000000-0000-0000-0000-000000000009', 'Open Data', 'technical', 'Open data publishing and consumption.'),
  ('c0000000-0000-0000-0000-000000000001', 'Cybersecurity', 'digital_governance', 'Cybersecurity principles for government systems.'),
  ('c0000000-0000-0000-0000-000000000002', 'Data Privacy', 'digital_governance', 'Data protection and privacy practices.'),
  ('c0000000-0000-0000-0000-000000000003', 'Digital Signatures', 'digital_governance', 'Use and governance of digital signatures.'),
  ('c0000000-0000-0000-0000-000000000004', 'Government Cloud', 'digital_governance', 'Government cloud platforms and patterns.'),
  ('c0000000-0000-0000-0000-000000000005', 'Digital Public Infrastructure', 'digital_governance', 'Digital public infrastructure concepts.'),
  ('d0000000-0000-0000-0000-000000000001', 'Leadership', 'behavioural_managerial', 'Leadership and team management.'),
  ('d0000000-0000-0000-0000-000000000002', 'Communication', 'behavioural_managerial', 'Professional communication.'),
  ('d0000000-0000-0000-0000-000000000003', 'Project Management', 'behavioural_managerial', 'Planning and execution of projects.'),
  ('d0000000-0000-0000-0000-000000000004', 'Ethics', 'behavioural_managerial', 'Professional and public-sector ethics.'),
  ('d0000000-0000-0000-0000-000000000005', 'Decision Making', 'behavioural_managerial', 'Structured decision making.'),
  ('d0000000-0000-0000-0000-000000000006', 'Change Management', 'behavioural_managerial', 'Managing organizational change.')
ON CONFLICT (name) DO NOTHING;

-- 3. ROLE COMPETENCY REQUIREMENTS
INSERT INTO public.role_competencies (id, designation, competency_id, required_level, weight) VALUES
  ('r0000000-0000-0000-0000-000000000001', 'Statistical Officer', 'a0000000-0000-0000-0000-000000000002', 4, 1.30), -- Sampling
  ('r0000000-0000-0000-0000-000000000002', 'Statistical Officer', 'a0000000-0000-0000-0000-000000000001', 4, 1.20), -- Survey Design
  ('r0000000-0000-0000-0000-000000000003', 'Statistical Officer', 'b0000000-0000-0000-0000-000000000001', 3, 1.10), -- Python
  ('r0000000-0000-0000-0000-000000000004', 'Statistical Officer', 'b0000000-0000-0000-0000-000000000003', 3, 1.00), -- SQL
  ('r0000000-0000-0000-0000-000000000005', 'Statistical Officer', 'b0000000-0000-0000-0000-000000000005', 3, 1.00), -- Data Visualization
  ('r0000000-0000-0000-0000-000000000006', 'Statistical Officer', 'a0000000-0000-0000-0000-000000000010', 3, 1.10), -- Data Quality Frameworks
  ('r0000000-0000-0000-0000-000000000007', 'Statistical Officer', 'd0000000-0000-0000-0000-000000000002', 3, 0.90)  -- Communication
ON CONFLICT (designation, competency_id) DO NOTHING;

-- 4. USER PROFILES
INSERT INTO public.user_profiles (id, full_name, role, department_id, designation, is_active) VALUES
  ('u1111111-1111-1111-1111-111111111111', 'Rajesh Sharma', 'learner', '11111111-1111-1111-1111-111111111111', 'Statistical Officer', true),
  ('u2222222-2222-2222-2222-222222222222', 'Dr. Sunita Verma', 'learner', '22222222-2222-2222-2222-222222222222', 'Senior Statistical Officer', true),
  ('u3333333-3333-3333-3333-333333333333', 'Dr. Vikramaditya Rao', 'trainer', '11111111-1111-1111-1111-111111111111', 'Senior Director & Trainer', true),
  ('u4444444-4444-4444-4444-444444444444', 'Dr. Arvind Panagariya', 'admin', '11111111-1111-1111-1111-111111111111', 'Director General', true)
ON CONFLICT (id) DO NOTHING;

-- 5. LEARNER PROFILES
INSERT INTO public.learner_profiles (user_id, educational_qualifications, years_experience, career_goal, current_overall_score) VALUES
  ('u1111111-1111-1111-1111-111111111111', 'M.Sc. Statistics', 4.5, 'Master advanced sampling & survey methodology', 46.29),
  ('u2222222-2222-2222-2222-222222222222', 'Ph.D. Econometrics', 8.0, 'Lead national accounts & NSSO survey designs', 72.50)
ON CONFLICT (user_id) DO NOTHING;

-- 6. LEARNER COMPETENCIES (Rajesh Sharma)
INSERT INTO public.learner_competencies (id, user_id, competency_id, level, score, confidence, evidence_source) VALUES
  ('lc111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 1, 25.0, 80.0, 'Self-Assessment'),
  ('lc222222-2222-2222-2222-222222222222', 'u1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 2, 40.0, 85.0, 'Diagnostic Test'),
  ('lc333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'b0000000-0000-0000-0000-000000000001', 2, 34.0, 88.0, 'Self-Assessment'),
  ('lc444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'b0000000-0000-0000-0000-000000000003', 4, 80.0, 95.0, 'Diagnostic Test')
ON CONFLICT (user_id, competency_id) DO NOTHING;

-- 7. COURSES CATALOGUE
INSERT INTO public.courses (id, title, provider_name, source, description, url, duration_minutes, difficulty) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Advanced Survey Sampling & Estimation', 'iGOT Karmayogi', 'igot', 'Comprehensive course on probability sampling and survey weight estimation.', 'https://igotkarmayogi.gov.in/courses/sampling-101', 240, 'medium'),
  ('c2222222-2222-2222-2222-222222222222', 'Python for Data Analysis & Statistical Operations', 'iGOT Karmayogi', 'igot', 'Applied Python programming using Pandas, NumPy and Statsmodels.', 'https://igotkarmayogi.gov.in/courses/python-stats', 300, 'medium'),
  ('c3333333-3333-3333-3333-333333333333', 'National Accounts Statistics & GDP Compilation', 'NSSTA', 'nssta_tpac', 'System of National Accounts (SNA 2008) and GVA compilation methodologies.', 'https://nssta.gov.in/courses/national-accounts', 360, 'hard')
ON CONFLICT (id) DO NOTHING;

-- 8. COURSE COMPETENCIES
INSERT INTO public.course_competencies (course_id, competency_id, target_level, relevance_score) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 4, 95.0),
  ('c2222222-2222-2222-2222-222222222222', 'b0000000-0000-0000-0000-000000000001', 3, 90.0)
ON CONFLICT (course_id, competency_id) DO NOTHING;

-- 9. RECOMMENDATIONS
INSERT INTO public.recommendations (id, user_id, course_id, competency_id, reason, score, rank, generated_by) VALUES
  ('rec11111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 'Your current Sampling score is 25/100 while your role requires level 4. This course directly bridges your sampling methodology gap.', 85.8, 1, 'ai_engine')
ON CONFLICT (id) DO NOTHING;

-- 10. LEARNING PROGRESS
INSERT INTO public.learning_progress (id, user_id, course_id, enrollment_status, progress_percent, learning_hours) VALUES
  ('lp111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'enrolled', 45.0, 2.5)
ON CONFLICT (id) DO NOTHING;
