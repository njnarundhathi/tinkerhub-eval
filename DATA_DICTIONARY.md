# TinkerHub Data Dictionary

Comprehensive database schema documentation for the TinkerHub platform. The canonical source of truth is the Prisma schema at `hub-comms/prisma/schema.prisma`.

## Table of Contents

- [Enum Values Reference](#enum-values-reference)
- [Core Tables](#core-tables)
- [Event Tables](#event-tables)
- [Project Tables](#project-tables)
- [Opportunity Tables](#opportunity-tables)
- [Partner Tables](#partner-tables)
- [Resource Tables](#resource-tables)
- [Award Tables](#award-tables)
- [Communication Tables](#communication-tables)
- [Space/Check-in Tables](#spacecheck-in-tables)
- [Utility Tables](#utility-tables)
- [JSON Field Schemas](#json-field-schemas)
- [Relationships Diagram](#relationships-diagram)

---

## Enum Values Reference

### Event Types (`events.type`)

| Value | Description |
|-------|-------------|
| `Talk_Session` | Speaker-led discussion sessions |
| `Meetup` | Community gatherings |
| `Core_Team_Meeting` | Internal team meetings |
| `Learning_Program` | Educational programs |
| `Workshop` | Hands-on learning sessions |
| `Hackathon` | Competitive coding/building events |
| `Project_Building_Program` | Project-focused programs |

### Event Status (`events.status`)

| Value | Description |
|-------|-------------|
| `draft` | Event being prepared (default) |
| `published` | Event visible to users |
| `paused` | Temporarily hidden |
| `cancelled` | Event cancelled |

### Registration Status (`attendees.registration_status`)

| Value | Description |
|-------|-------------|
| `registered` | Confirmed registration |
| `applied` | Pending approval (for invite-only events) |

### Roles (`roles.name`)

| Value | Description |
|-------|-------------|
| `SuperAdmin` | Full system access |
| `Admin` | Organization admin |
| `CampusAdmin` | Campus/sub-org admin |
| `Staff` | Staff member |
| `Maker` | Regular community member |

### Membership Categories (`membership_categories.title`)

| Value | Description |
|-------|-------------|
| `Kutty Makers` | Young learners (school students) |
| `Young Makers` | Student members (college) |
| `Friends of TinkerHub` | Alumni/supporters |

### Sub Org State (`sub_orgs.state`)

| Value | Description |
|-------|-------------|
| `unknown` | State not set (default) |
| `active` | Active campus |

### Project Status (`projects.status`)

| Value | Description |
|-------|-------------|
| `Review Pending` | Awaiting review (default) |
| `Accepted` | Approved project |

### Project Categories (`projects.categories`)

Comma-separated values from:
- `Artificial intelligence`
- `Entertainment`
- `Education`
- `Lifestyle`
- `Health`
- `Food & drink`
- `Music`
- `Social`
- `Productivity`
- `Other`
- `Design Tool`
- `Fitness`
- `Sports`

### Event/Member Interests

Comma-separated values from:
- `AI/ML`
- `Community Building`
- `Social Science`
- `Web Development`
- `Devops`
- `Product Design`
- `Branding`
- `App Development`

### Opportunity Application Status (`opportunity_applications.status`)

| Value | Description |
|-------|-------------|
| `pending` | Application received (default) |
| `shortlisted` | Selected for review |
| `accepted` | Application approved |
| `rejected` | Application declined |

### Invitation Status (`invitations.status`)

| Value | Description |
|-------|-------------|
| `pending` | Awaiting response (default) |
| `accepted` | Invitation accepted |

### Event Group Status (`event_groups.status`)

| Value | Description |
|-------|-------------|
| `draft` | Being prepared (default) |
| `active` | Open for subscriptions |

### Event Group Access Level (`event_groups.access_level`)

| Value | Description |
|-------|-------------|
| `public` | Open to all (default) |
| `private` | Restricted access |

### Sub Org Admin Role (`sub_org_admins.role`)

| Value | Description |
|-------|-------------|
| `Lead` | Campus lead (default) |

### T-shirt Sizes

Used in `memberships.tshirt_size` and `prize_claims.tshirt_size`:
- `S`, `M`, `L`, `XL`, `XXL`

### Sex (`memberships.sex`)

- `Male`
- `Female`

### Membership Theme (`memberships.theme`)

| Value | Description |
|-------|-------------|
| `mangosteen` | Default app theme |

### Notification Mode (`notification_record.mode`)

- `email`
- `sms`
- `whatsapp`
- `push`

---

## Core Tables

### users

Phone-based user authentication records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `phone_number` | VARCHAR(255) | User's phone number (unique, used for auth) |
| `phone_hash` | VARCHAR(255) | Hashed phone number for privacy |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Relationships:**
- Has many `memberships`
- Has many `notification_record`

---

### memberships

User profiles within the organization containing personal info, social links, and membership details.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Member's display name |
| `username` | VARCHAR(255) | Member's unique username |
| `avatar` | VARCHAR(255) | URL to avatar image |
| `bio` | TEXT | Member's bio/description |
| `github` | TEXT | GitHub profile URL or username |
| `instagram` | TEXT | Instagram profile URL or username |
| `linkedin` | TEXT | LinkedIn profile URL |
| `twitter` | TEXT | Twitter/X profile URL or username |
| `user_id` | INT | FK to `users` |
| `org_id` | INT | FK to `orgs` |
| `sub_org_id` | INT | FK to `sub_orgs` (primary campus) |
| `role_id` | INT | FK to `roles` |
| `unique_id` | VARCHAR(20) | Human-readable unique ID for URLs |
| `sex` | VARCHAR(25) | Gender: Male, Female |
| `interests` | TEXT | Comma-separated interest areas |
| `is_student` | BOOLEAN | Whether member is a student |
| `is_approved` | BOOLEAN | Whether profile is approved |
| `company_name` | VARCHAR(100) | Company name (for professionals) |
| `job_type` | VARCHAR(100) | Type of job |
| `invited_by` | INT | FK to inviting member |
| `email` | VARCHAR(100) | Email address |
| `enable_communication` | BOOLEAN | Opted into communications |
| `birthday` | TIMESTAMPTZ | Date of birth |
| `course` | VARCHAR(100) | Course name (students) |
| `stream` | VARCHAR(120) | Stream/specialization |
| `year_of_admission` | INT | College admission year |
| `year_of_graduation` | INT | Expected graduation year |
| `skills` | JSONB | Array of skill objects |
| `is_onboard` | BOOLEAN | Completed onboarding |
| `discord_id` | VARCHAR(80) | Discord user ID |
| `theme` | VARCHAR(50) | App theme (default: mangosteen) |
| `github_token` | VARCHAR(255) | GitHub OAuth token |
| `username_id` | INT | FK to `username` table |
| `is_private` | BOOLEAN | Profile is private |
| `tshirt_size` | VARCHAR(10) | T-shirt size: S, M, L, XL, XXL |
| `checkin_report_submitted` | BOOLEAN | Check-in report submitted |
| `address` | JSONB | Shipping address object |
| `is_guest` | BOOLEAN | Guest member (limited access) |
| `status` | VARCHAR(15) | Status (default: unknown) |
| `category_id` | INT | FK to `membership_categories` |
| `food_preference` | VARCHAR(20) | Food preference |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Unique Constraints:**
- `(user_id, org_id)` - One membership per user per org

---

### roles

Permission roles for members.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(50) | Role name (unique): SuperAdmin, Admin, CampusAdmin, Staff, Maker |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### membership_categories

Member classification categories.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `title` | VARCHAR(255) | Category title: Kutty Makers, Young Makers, Friends of TinkerHub |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

---

### orgs

Root organization record (TinkerHub).

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Organization name |
| `description` | VARCHAR(255) | Organization description |
| `wildcard` | VARCHAR(50) | Wildcard for subdomains |
| `avatar` | VARCHAR(255) | URL to organization logo |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### sub_orgs

Campus chapters (college-based TinkerHub communities).

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Campus/college name |
| `description` | VARCHAR(255) | Campus description |
| `avatar` | VARCHAR(255) | URL to campus logo |
| `org_id` | INT | FK to parent `orgs` |
| `manager_id` | INT | FK to campus manager's `memberships` |
| `district` | VARCHAR(100) | District/region |
| `website` | TEXT | Campus website URL |
| `address` | TEXT | Physical address |
| `map_url` | TEXT | Google Maps URL |
| `state` | VARCHAR(20) | State: unknown (default), active |
| `instagram` | VARCHAR(255) | Instagram profile URL |
| `linkedin` | VARCHAR(255) | LinkedIn page URL |
| `alias` | VARCHAR(15) | Short alias |
| `type` | VARCHAR(63) | Campus type (college, school, etc.) |
| `principal_name` | VARCHAR(255) | Principal's name |
| `principal_email` | VARCHAR(255) | Principal's email |
| `faculty_name` | VARCHAR(255) | Faculty coordinator's name |
| `faculty_email` | VARCHAR(255) | Faculty coordinator's email |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### sub_org_admins

Campus leadership assignments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `sub_org_id` | INT | FK to `sub_orgs` |
| `membership_id` | INT | FK to admin's `memberships` |
| `role` | VARCHAR(20) | Role: Lead (default) |
| `year` | INT | Academic year of assignment |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### username

Unique username tracking to ensure global uniqueness.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `username` | VARCHAR(30) | The unique username |
| `membership_id` | INT | FK to owner's `memberships` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### education

Educational history records for members.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `membership_id` | INT | FK to `memberships` |
| `school` | VARCHAR(255) | Institution name |
| `degree` | VARCHAR(150) | Degree or qualification |
| `field_of_study` | VARCHAR(150) | Field of study/major |
| `location` | VARCHAR(120) | City/location |
| `start_date` | DATE | Start date of enrollment |
| `end_date` | DATE | End date (null if ongoing) |
| `url` | VARCHAR(255) | Institution website |
| `is_current` | BOOLEAN | Current institution |
| `is_school` | BOOLEAN | School (vs college) |
| `sub_org_id` | INT | FK to `sub_orgs` if TinkerHub campus |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### experience

Work and volunteer experience records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `membership_id` | INT | FK to `memberships` |
| `title` | VARCHAR(120) | Job title or role |
| `description` | TEXT | Responsibilities and achievements |
| `start_date` | DATE | Start date |
| `end_date` | DATE | End date (null if current) |
| `company` | VARCHAR(120) | Company/organization name |
| `location` | VARCHAR(120) | Work location |
| `url` | VARCHAR(255) | Link to company/project |
| `type` | VARCHAR(120) | Experience type |
| `is_current` | BOOLEAN | Current role |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### invitations

Member invitation tracking for referral program.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `inviter_membership_id` | INT | FK to inviter's `memberships` |
| `invitee_phone_number` | VARCHAR(15) | Invitee phone number (unique) |
| `status` | VARCHAR(10) | Status: pending (default), accepted |
| `invitee_membership_id` | INT | FK to invitee's `memberships` after joining |
| `invitee_name` | VARCHAR(255) | Invitee's name |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Event Tables

### events

Community events including workshops, meetups, hackathons, and learning programs.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Event title |
| `type` | VARCHAR(255) | Event type (see enum) |
| `description` | TEXT | Full description |
| `start_date` | TIMESTAMPTZ | Event start date/time |
| `end_date` | TIMESTAMPTZ | Event end date/time |
| `banner` | VARCHAR(255) | Banner image URL |
| `org_id` | INT | FK to `orgs` |
| `sub_org_id` | INT | FK to `sub_orgs` (if campus-specific) |
| `featured` | BOOLEAN | Featured on homepage |
| `unique_id` | VARCHAR(20) | Human-readable unique ID |
| `campus_exclusive` | BOOLEAN | Campus-exclusive event |
| `location` | TEXT | Physical address |
| `map_url` | TEXT | Google Maps URL |
| `status` | VARCHAR(25) | Status: draft, published, paused, cancelled |
| `is_invite_only` | BOOLEAN | Requires approval |
| `is_virtual` | BOOLEAN | Online event |
| `is_limited_seats` | BOOLEAN | Has capacity limit |
| `number_of_seats` | INT | Total capacity |
| `seats_available` | INT | Available seats |
| `is_external` | BOOLEAN | External organizer |
| `is_space` | BOOLEAN | TinkerSpace event |
| `is_project_based` | BOOLEAN | Requires project submission |
| `meet_url` | VARCHAR(255) | Virtual meeting URL |
| `project_submission_deadline` | TIMESTAMP | Project deadline |
| `allow_non_github_links` | BOOLEAN | Non-GitHub links allowed |
| `is_team_project_submission` | BOOLEAN | Team-based submission |
| `external_event_url` | VARCHAR(255) | External event page |
| `interests` | VARCHAR(255) | Comma-separated interests |
| `skills` | JSONB | Required skills array |
| `pre_invite` | BOOLEAN | Send pre-event invitations |
| `report_submitted` | BOOLEAN | Organizer report submitted |
| `team_event` | BOOLEAN | Team formation required |
| `team_size` | INT | Required team size |
| `multiple_venue` | BOOLEAN | Multiple venues |
| `discord_channel_url` | TEXT | Discord channel URL |
| `discord_channel_name` | TEXT | Discord channel name |
| `is_dependent` | BOOLEAN | Has prerequisite events |
| `has_prize` | BOOLEAN | Has prizes/swag |
| `registration_deadline` | TIMESTAMPTZ | Registration deadline |
| `group_id` | INT | FK to `event_groups` |
| `prize_claim_deadline` | TIMESTAMPTZ | Prize claim deadline |
| `group_mandatory` | BOOLEAN | Group subscription required |
| `category_exclusive` | BOOLEAN | Category-restricted |
| `eligible_category_ids` | INT[] | Eligible category IDs |
| `resource_id` | INT | FK to `resources` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### attendees

Event registration records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `membership_id` | INT | FK to `memberships` |
| `event_id` | INT | FK to `events` |
| `check_in` | BOOLEAN | Checked in at event |
| `ticket_id` | VARCHAR(25) | Unique ticket ID |
| `registration_status` | VARCHAR(255) | Status: registered, applied |
| `check_in_time` | TIMESTAMPTZ | Check-in timestamp |
| `check_in_by` | INT | FK to organizer who checked in |
| `feedback_completed` | BOOLEAN | Feedback submitted |
| `team_id` | INT | FK to `event_team` |
| `venue_id` | INT | FK to `event_venue` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Unique Constraints:**
- `(membership_id, event_id)` - One registration per member per event

---

### attendee_feedback

Post-event feedback from attendees.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `attendee_id` | INT | FK to `attendees` |
| `event_id` | INT | FK to `events` |
| `membership_id` | INT | FK to `memberships` |
| `overall_experience` | INT | Rating 1-5 |
| `facilitator_effectiveness` | INT | Rating 1-5 |
| `networking_opportunities` | INT | Rating 1-5 |
| `how_organized` | INT | Rating 1-5 |
| `how_to_improve` | TEXT | Improvement suggestions |
| `liked_most` | TEXT | What attendee liked most |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_report

Post-event reports from organizers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `organizer_membership_id` | INT | FK to organizer's `memberships` |
| `organizer_id` | INT | FK to `organizers` |
| `event_id` | INT | FK to `events` |
| `overall_experience` | INT | Rating 1-5 |
| `worth_organizing` | BOOLEAN | Worth organizing |
| `facilitator_effectiveness` | INT | Rating 1-5 |
| `networking_opportunities` | INT | Rating 1-5 |
| `how_organized` | INT | Rating 1-5 |
| `alignment_with_outcome` | INT | Rating 1-5 |
| `photos` | JSONB | Photo URLs array |
| `materials` | JSONB | Material URLs array |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### organizers

Event organizer assignments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `membership_id` | INT | FK to `memberships` |
| `event_id` | INT | FK to `events` |
| `is_host` | BOOLEAN | Primary host |
| `venue_id` | INT | FK to `event_venue` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### speaker

Event speakers and presenters.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(127) | Speaker name |
| `membership_id` | INT | FK to `memberships` (if member) |
| `event_id` | INT | FK to `events` |
| `tagline` | VARCHAR(127) | Title/expertise |
| `avatar` | VARCHAR(255) | Avatar URL |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_team

Teams for team-based events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `event_id` | INT | FK to `events` |
| `name` | VARCHAR(60) | Team name |
| `join_code` | VARCHAR(10) | Join code |
| `max_members` | INT | Maximum members |
| `venue_id` | INT | FK to `event_venue` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_venue

Physical venues for multi-venue events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `event_id` | INT | FK to `events` |
| `name` | TEXT | Venue name |
| `map_url` | TEXT | Map URL |
| `is_sub_org` | BOOLEAN | At TinkerHub campus |
| `sub_org_id` | INT | FK to `sub_orgs` |
| `is_limited_seats` | BOOLEAN | Limited seating |
| `total_seats` | INT | Total seats |
| `is_exclusive` | BOOLEAN | Exclusive registration |
| `start_date` | TIMESTAMP | Venue start time |
| `end_date` | TIMESTAMP | Venue end time |
| `registration_deadline` | TIMESTAMPTZ | Registration deadline |
| `address` | TEXT | Physical address |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_groups

Event series/study jams grouping related events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Group name |
| `description` | TEXT | Description |
| `type` | VARCHAR(127) | Group type (study_jam, series) |
| `banner` | VARCHAR(255) | Banner URL |
| `is_sub_org` | BOOLEAN | Campus-specific |
| `sub_org_id` | INT | FK to `sub_orgs` |
| `start_date` | TIMESTAMPTZ | Group start date |
| `end_date` | TIMESTAMPTZ | Group end date |
| `access_level` | VARCHAR(63) | Access: public, private |
| `project_based` | BOOLEAN | Requires project |
| `resources` | JSONB | Learning resources |
| `registration_deadline` | TIMESTAMPTZ | Registration deadline |
| `unique_id` | VARCHAR(20) | Human-readable ID |
| `campus_exclusive` | BOOLEAN | Campus-exclusive |
| `limited_seats` | BOOLEAN | Limited capacity |
| `seats` | INT | Total capacity |
| `interests` | VARCHAR(255) | Interest areas |
| `skills` | JSONB | Required skills |
| `status` | VARCHAR(63) | Status: draft, active |
| `discord_reminder_sent` | BOOLEAN | Discord reminder sent |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_group_facilitators

Facilitators for event groups/study jams.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(127) | Facilitator name |
| `membership_id` | INT | FK to `memberships` |
| `group_id` | INT | FK to `event_groups` |
| `tagline` | VARCHAR(127) | Title/expertise |
| `avatar` | VARCHAR(255) | Avatar URL |
| `is_host` | BOOLEAN | Primary host |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_group_subscriptions

User subscriptions to event groups.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `group_id` | INT | FK to `event_groups` |
| `membership_id` | INT | FK to `memberships` |
| `status` | VARCHAR(63) | Status: active |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Unique Constraints:**
- `(group_id, membership_id)` - One subscription per member per group

---

### dependent_events

Event prerequisite relationships.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `event_id` | INT | FK to event with dependency |
| `dependent_event_id` | INT | FK to prerequisite event |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Project Tables

### projects

User and team project submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Project name |
| `tagline` | VARCHAR(255) | Short tagline |
| `description` | TEXT | Full description |
| `cover_image` | TEXT | Cover image URL |
| `project_url` | TEXT | Demo/deployed URL |
| `source_code_url` | TEXT | Repository URL |
| `open_source` | BOOLEAN | Open source |
| `event_based` | BOOLEAN | Created for event |
| `event_team_id` | INT | FK to `event_team` |
| `event_id` | INT | FK to `events` |
| `categories` | VARCHAR(255) | Comma-separated categories |
| `verified` | BOOLEAN | Admin verified |
| `can_collaborate` | BOOLEAN | Open for collaboration |
| `start_date` | TIMESTAMPTZ | Project start |
| `end_date` | TIMESTAMPTZ | Project end |
| `is_completed` | BOOLEAN | Completed |
| `type` | VARCHAR(63) | Project type |
| `status` | VARCHAR(31) | Status: Review Pending, Accepted |
| `event_group_id` | INT | FK to `event_groups` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### project_collaborators

Team members for collaborative projects.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `project_id` | INT | FK to `projects` |
| `membership_id` | INT | FK to `memberships` |
| `sort_order` | INT | Display order (0 = lead) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### project_stages

Project timeline milestones.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `project_id` | INT | FK to `projects` |
| `name` | VARCHAR(240) | Stage name |
| `start_date` | TIMESTAMPTZ | Stage start |
| `end_date` | TIMESTAMPTZ | Stage end |
| `stage_order` | INT | Display order |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### prize_claims

Prize/swag claims by event attendees.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `attendee_id` | INT | FK to `attendees` |
| `event_id` | INT | FK to `events` |
| `address` | JSONB | Shipping address |
| `tshirt_size` | VARCHAR(10) | Size: S, M, L, XL, XXL |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Opportunity Tables

### opportunities

Job, internship, and volunteer opportunity listings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `partner_id` | INT | FK to `partners` |
| `title` | VARCHAR(120) | Opportunity title |
| `description` | TEXT | Full description |
| `location` | VARCHAR(120) | Work location |
| `type` | VARCHAR(120) | Opportunity type |
| `category` | VARCHAR(120) | Category/department |
| `mode` | VARCHAR(120) | Work mode |
| `deadline` | TIMESTAMPTZ | Application deadline |
| `external_link` | VARCHAR(120) | External application link |
| `compensation` | VARCHAR(120) | Compensation details |
| `is_external` | BOOLEAN | External application |
| `featured` | BOOLEAN | Featured on homepage |
| `is_volunteering` | BOOLEAN | Volunteering opportunity |
| `project_count` | INT | Min projects required |
| `study_jam_count` | INT | Min study jams required |
| `activity_count` | INT | Min activities required |
| `active_campus_only` | BOOLEAN | Active campus members only |
| `student_only` | BOOLEAN | Students only |
| `year_of_graduation` | INT | Max graduation year |
| `eligibility_question` | TEXT | Custom eligibility question |
| `task_instructions` | TEXT | Task instructions |
| `task_resource` | TEXT | Task resource link |
| `require_github` | BOOLEAN | GitHub required |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### opportunity_applications

Opportunity application submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `opportunity_id` | INT | FK to `opportunities` |
| `membership_id` | INT | FK to `memberships` |
| `eligibility_response` | TEXT | Eligibility answer |
| `task_response` | TEXT | Task response |
| `status` | VARCHAR(255) | Status: pending, shortlisted, accepted, rejected |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

---

## Partner Tables

### partners

Corporate partner organizations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(120) | Partner name |
| `description` | TEXT | Partner description |
| `avatar` | VARCHAR(255) | Logo URL |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### partner_contacts

Contact persons for partner organizations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `partner_id` | INT | FK to `partners` |
| `name` | VARCHAR(120) | Contact name |
| `title` | VARCHAR(120) | Job title |
| `email` | VARCHAR(120) | Email address |
| `phone` | VARCHAR(120) | Phone number |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### event_partners

Junction table linking events to partners.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `event_id` | INT | FK to `events` |
| `partner_id` | INT | FK to `partners` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Resource Tables

### resources

Curated learning resources and event guides.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Resource title |
| `unique_id` | VARCHAR(10) | Short unique ID |
| `category` | VARCHAR(127) | Resource category |
| `type` | VARCHAR(127) | Resource type |
| `area` | VARCHAR(127) | Topic/subject area |
| `summary` | TEXT | Brief summary |
| `purpose` | TEXT | Purpose/goal |
| `how` | TEXT | How to use |
| `outcomes` | JSONB | Expected outcomes |
| `impacts` | JSONB | Expected impacts |
| `pre_event_checklist` | JSONB | Pre-event checklist |
| `post_event_checklist` | JSONB | Post-event checklist |
| `curated_by` | VARCHAR(255) | Curator name/team |
| `audience` | VARCHAR(127) | Target audience |
| `resources` | JSONB | Additional resource links |
| `created_by` | INT | FK to creator's `memberships` |
| `is_featured` | BOOLEAN | Featured resource |
| `tag` | VARCHAR(255) | Tag for filtering |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### resource_log

Resource access tracking for analytics.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `resource_id` | INT | FK to `resources` |
| `membership_id` | INT | FK to `memberships` |
| `created_at` | TIMESTAMPTZ | Access timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Award Tables

### awards

Achievement badges and recognition awards.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `title` | VARCHAR(255) | Award title |
| `description` | TEXT | How to earn |
| `empty_icon` | VARCHAR(255) | Unearned icon URL |
| `filled_icon` | VARCHAR(255) | Earned icon URL |
| `category` | VARCHAR(20) | Award category |
| `priority` | VARCHAR(20) | Display priority |
| `group_id` | INT | FK to `award_groups` |
| `sub_org_id` | INT | FK to `sub_orgs` (campus awards) |
| `membership_id` | INT | FK to `memberships` (individual awards) |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### award_groups

Categories for grouping awards.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Group name |
| `description` | TEXT | Group description |
| `priority` | VARCHAR(7) | Display priority |
| `category` | VARCHAR(63) | Category classification |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Communication Tables

### notification_record

Notification history records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `user_id` | INT | FK to `users` |
| `membership_id` | INT | FK to `memberships` |
| `event_id` | INT | FK to `events` |
| `mode` | VARCHAR(63) | Channel: email, sms, whatsapp, push |
| `type` | VARCHAR(63) | Notification type |
| `title` | VARCHAR(255) | Notification title |
| `message` | TEXT | Message body |
| `sent_by` | INT | FK to sender's `memberships` |
| `event_group_id` | INT | FK to `event_groups` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### push_notification_log

Audit log for push notifications.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `event_id` | INT | FK to `events` |
| `title` | TEXT | Notification title |
| `body` | TEXT | Notification body |
| `audience` | VARCHAR(63) | Target audience |
| `sent_by` | INT | FK to sender's `memberships` |
| `csv_url` | VARCHAR(255) | Recipient list CSV URL |
| `created_at` | TIMESTAMPTZ | Send timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Space/Check-in Tables

### space_check_in

TinkerSpace physical check-in records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `membership_id` | INT | FK to `memberships` |
| `check_in_time` | TIMESTAMPTZ | Check-in timestamp |
| `check_out_time` | TIMESTAMPTZ | Check-out timestamp |
| `purpose` | VARCHAR(120) | Visit purpose |
| `is_mentor` | BOOLEAN | Is mentor |
| `working_on` | TEXT | What they're working on |
| `project_id` | INT | FK to `projects` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### space_manager_report

TinkerSpace manager status reports.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `membership_id` | INT | FK to member being reported on |
| `work_status` | VARCHAR(50) | Work status |
| `donor_state` | VARCHAR(50) | Donor/sponsor state |
| `brief_info` | TEXT | Activity summary |
| `remarks` | TEXT | Manager remarks |
| `submitted_by` | INT | FK to submitter's `memberships` |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## Utility Tables

### info_card

Dynamic info cards displayed in the app.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `name` | VARCHAR(255) | Card title |
| `type` | VARCHAR(127) | Card type |
| `state` | VARCHAR(63) | Visibility state |
| `page_location` | VARCHAR(127) | Display page |
| `unique_id` | VARCHAR(63) | Unique identifier |
| `info` | JSONB | Card content/config |
| `start_date` | TIMESTAMPTZ | Visibility start |
| `end_date` | TIMESTAMPTZ | Visibility end |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

### schema_migrations

Database migration version tracking.

| Column | Type | Description |
|--------|------|-------------|
| `version` | BIGINT | Migration version (PK) |
| `dirty` | BOOLEAN | Clean completion |

---

## JSON Field Schemas

### memberships.skills

```json
[
  {
    "name": "JavaScript",
    "level": "intermediate"
  },
  {
    "name": "Python",
    "level": "beginner"
  }
]
```

### memberships.address / prize_claims.address

```json
{
  "line1": "123 Main Street",
  "line2": "Apt 4B",
  "city": "Kochi",
  "state": "Kerala",
  "pincode": "682001"
}
```

### event_report.photos / event_report.materials

```json
["https://cdn.example.com/photo1.jpg", "https://cdn.example.com/photo2.jpg"]
```

### resources.outcomes / resources.impacts

```json
{
  "items": [
    "Learn basic programming concepts",
    "Build a working project"
  ]
}
```

### resources.pre_event_checklist / resources.post_event_checklist

```json
{
  "items": [
    {"task": "Book venue", "required": true},
    {"task": "Prepare slides", "required": false}
  ]
}
```

### event_groups.resources

```json
{
  "links": [
    {"title": "Course Material", "url": "https://..."},
    {"title": "Reference Guide", "url": "https://..."}
  ]
}
```

---

## Relationships Diagram

```
                                    ┌─────────────────┐
                                    │      orgs       │
                                    │   (TinkerHub)   │
                                    └────────┬────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      │                      │                      │
                      ▼                      ▼                      ▼
              ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
              │   sub_orgs    │      │  memberships  │      │    events     │
              │  (campuses)   │      │   (profiles)  │      │ (activities)  │
              └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
                      │                      │                      │
       ┌──────────────┼──────────────┐       │       ┌──────────────┼──────────────┐
       │              │              │       │       │              │              │
       ▼              ▼              ▼       ▼       ▼              ▼              ▼
┌─────────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────┐
│sub_org_admins│ │education│ │ experience │ │attendees │ │ organizers  │ │ speaker  │
└─────────────┘ └──────────┘ └────────────┘ └────┬─────┘ └─────────────┘ └──────────┘
                                                  │
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                                    ▼             ▼             ▼
                             ┌────────────┐ ┌──────────┐ ┌─────────────┐
                             │ feedback   │ │event_team│ │prize_claims │
                             └────────────┘ └────┬─────┘ └─────────────┘
                                                  │
                                                  ▼
                                            ┌──────────┐
                                            │ projects │
                                            └────┬─────┘
                                                  │
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                                    ▼             ▼             ▼
                             ┌────────────┐ ┌────────────┐ ┌────────────┐
                             │collaborators│ │  stages   │ │space_check │
                             └────────────┘ └────────────┘ └────────────┘


┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    partners     │────▶│  opportunities  │◀────│opportunity_apps │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│  event_groups   │────▶│     events      │
│  (study jams)   │     │   (sessions)    │
└────────┬────────┘     └─────────────────┘
         │
         ├──▶ event_group_facilitators
         ├──▶ event_group_subscriptions
         └──▶ projects

┌─────────────────┐     ┌─────────────────┐
│     users       │────▶│  memberships    │
│ (phone auth)    │     │   (profiles)    │
└────────┬────────┘     └─────────────────┘
         │
         └──▶ notification_record
```

---

## Index Documentation

### Unique Indexes

| Table | Columns | Purpose |
|-------|---------|---------|
| `users` | `phone_number` | One account per phone |
| `memberships` | `unique_id` | Human-readable profile URLs |
| `memberships` | `(user_id, org_id)` | One membership per user per org |
| `events` | `unique_id` | Human-readable event URLs |
| `attendees` | `(membership_id, event_id)` | One registration per member per event |
| `invitations` | `invitee_phone_number` | One invite per phone |
| `roles` | `name` | Unique role names |
| `username` | `username` | Global username uniqueness |
| `event_groups` | `unique_id` | Human-readable group URLs |
| `event_group_subscriptions` | `(group_id, membership_id)` | One sub per member per group |
