# Prisma Schema Documentation

## users

Login records for phone-based authentication. Links to memberships for organization profiles.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this user |
| phone_number | Phone number used for login |
| created_at | When the record was created |
| updated_at | When the record was last changed |
| phone_hash | Scrambled phone number for privacy-safe lookups |

## memberships

Member profiles with personal info, social links, skills, and preferences. Main record linking users to organizations.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this member |
| name | Member's display name |
| username | Chosen username for profile URL (tinkerhub.org/@username) |
| avatar | Profile picture URL |
| bio | Member's self-description |
| github | GitHub profile link or username |
| instagram | Instagram handle |
| linkedin | LinkedIn profile link |
| twitter | Twitter/X handle |
| user_id | The user account this profile belongs to |
| org_id | The organization this member belongs to |
| sub_org_id | The campus or chapter this member belongs to |
| role_id | The role assigned to this member |
| created_at | When the member joined |
| updated_at | When the profile was last changed |
| unique_id | Short public ID for sharing (e.g., TH-AB12CD) |
| sex | Gender. Values: Male, Female |
| interests | List of member's interests |
| is_student | Whether the member is currently a student |
| is_approved | Whether the member has been approved by an admin |
| company_name | Current employer name (for working professionals) |
| job_type | Current job type or category |
| invited_by | The member who invited this person (vouching system) |
| email | Contact email address |
| enable_communication | Whether the member receives notifications |
| birthday | Date of birth |
| course | Academic course or program name |
| stream | Academic specialization or branch |
| year_of_admission | Year of college admission |
| year_of_graduation | Expected or actual graduation year |
| skills | List of technical or professional skills |
| is_onboard | Whether the member has completed onboarding |
| discord_id | Discord user ID for community integration |
| theme | Visual style for public profile page |
| github_token | Key that connects this profile to GitHub |
| username_id | The claimed username for this member |
| is_private | Whether the profile is hidden from the public directory |
| tshirt_size | T-shirt size for swag. Values: S, M, L, XL, XXL |
| checkin_report_submitted | Whether the TinkerSpace check-in report has been submitted |
| address | Mailing address details |
| is_guest | Whether this is a guest account with limited access |
| status | Account status (default: unknown) |
| category_id | The membership category (Kutty Makers/Young Makers/Friends of TinkerHub) |
| food_preference | Dietary preference for events |

## username

Reserved usernames ensuring uniqueness across the platform.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this username reservation |
| username | The reserved username |
| membership_id | The member who owns this username |
| created_at | When the username was reserved |
| updated_at | When the record was last changed |

## orgs

Parent organization (TinkerHub). Contains branding and organizational info.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this organization |
| name | Organization name |
| description | Organization description |
| wildcard | Pattern for campus web addresses |
| avatar | Organization logo URL |
| created_at | When the record was created |
| updated_at | When the record was last changed |

## sub_orgs

Campuses and chapters under TinkerHub. Contains campus details, leadership, and institutional contacts.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this campus |
| name | Campus or chapter name |
| description | Campus description |
| avatar | Campus logo URL |
| org_id | The parent organization (TinkerHub) this campus belongs to |
| manager_id | The member who manages this campus |
| created_at | When the campus was added |
| updated_at | When the record was last changed |
| district | District location |
| website | Campus website URL |
| address | Physical address |
| map_url | Google Maps link |
| state | Campus operational state. Values: unknown, active |
| instagram | Instagram handle |
| linkedin | LinkedIn page URL |
| alias | Short name used in web addresses |
| type | Campus type (e.g., college, school) |
| principal_name | Institution head's name |
| principal_email | Institution head's email |
| faculty_name | Faculty coordinator name |
| faculty_email | Faculty coordinator email |

## sub_org_admins

Campus leadership assignments by year. Tracks leads and co-leads for each academic year.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this leadership assignment |
| sub_org_id | The campus this assignment is for |
| membership_id | The member assigned as leader |
| role | Leadership role. Values: Lead |
| year | Academic year of leadership tenure |
| created_at | When the assignment was made |
| updated_at | When the record was last changed |

## roles

User role definitions for access control.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this role |
| name | Role name. Values: SuperAdmin, Admin, CampusAdmin, Staff, Maker |
| created_at | When the role was created |
| updated_at | When the record was last changed |

## events

Event definitions with settings for virtual/physical, team-based, multi-venue, project submissions, and prizes.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this event |
| name | Event title |
| type | Event type. Values: Talk_Session, Meetup, Core_Team_Meeting, Learning_Program, Workshop, Hackathon, Project_Building_Program |
| description | Full event description |
| start_date | Event start date and time |
| end_date | Event end date and time |
| banner | Event banner image URL |
| org_id | The organization hosting this event |
| sub_org_id | The campus hosting this event (for campus-only events) |
| created_at | When the event was created |
| updated_at | When the event was last changed |
| featured | Whether this event appears on the homepage |
| unique_id | Short public ID for sharing |
| campus_exclusive | Whether this event is restricted to a specific campus |
| location | Physical venue name or address |
| map_url | Google Maps or venue link |
| status | Event status. Values: draft, published, paused, cancelled |
| is_invite_only | Whether registration requires an invitation |
| is_virtual | Whether this is an online event |
| is_limited_seats | Whether this event has limited seating |
| number_of_seats | Total seat capacity |
| seats_available | Currently available seats |
| is_external | Whether this event is hosted externally |
| is_space | Whether this is a TinkerSpace session |
| is_project_based | Whether this event requires project submissions |
| meet_url | Video call URL for virtual events |
| project_submission_deadline | Deadline for project submissions |
| allow_non_github_links | Whether non-GitHub project links are accepted |
| is_team_project_submission | Whether projects are submitted as a team |
| external_event_url | External registration or info URL |
| interests | Relevant interest tags |
| skills | Skills to be learned or required |
| pre_invite | Whether pre-event invitations are sent |
| report_submitted | Whether the organizer report has been submitted |
| team_event | Whether this event has team-based participation |
| team_size | Maximum team size |
| multiple_venue | Whether this event has multiple physical venues |
| discord_channel_url | Discord channel URL |
| discord_channel_name | Discord channel name |
| is_dependent | Whether this event has prerequisite events |
| has_prize | Whether this event offers prizes |
| registration_deadline | Deadline for event registration |
| group_id | The event group or series this belongs to |
| prize_claim_deadline | Deadline for claiming prizes |
| group_mandatory | Whether event group subscription is required |
| category_exclusive | Whether this event is restricted to specific member categories |
| eligible_category_ids | List of eligible membership category IDs |
| resource_id | The resource template associated with this event |

## attendees

Event registrations and check-ins. Tracks attendance, check-in times, team assignments, and venue selections.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this registration |
| membership_id | The member who registered |
| event_id | The event this registration is for |
| check_in | Whether the attendee has checked in |
| created_at | When registration occurred |
| updated_at | When the record was last changed |
| ticket_id | Unique ticket ID for QR codes |
| registration_status | Registration status. Values: registered, applied |
| check_in_time | When attendee checked in |
| check_in_by | The member who performed the check-in |
| feedback_completed | Whether feedback has been submitted |
| team_id | The team assigned to this attendee (for team events) |
| venue_id | The venue selected by this attendee (for multi-venue events) |

## attendee_feedback

Post-event surveys collecting ratings and improvement suggestions from attendees.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this feedback |
| attendee_id | The attendee record this feedback belongs to |
| event_id | The event this feedback is for |
| membership_id | The member who submitted this feedback |
| overall_experience | Overall experience rating (1-5) |
| facilitator_effectiveness | Facilitator effectiveness rating (1-5) |
| networking_opportunities | Networking opportunities rating (1-5) |
| how_organized | Event organization rating (1-5) |
| how_to_improve | Improvement suggestions (free text) |
| created_at | When feedback was submitted |
| updated_at | When the record was last changed |
| liked_most | Best aspects of the event (free text) |

## event_groups

Event series like Study Jams (multi-session learning cohorts). Supports subscriptions, projects, and Discord integration.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this event group |
| name | Event group or series name |
| description | Series description and objectives |
| type | Group type (e.g., study_jam, initiative) |
| banner | Series banner image URL |
| is_sub_org | Whether this group is campus-specific |
| sub_org_id | The campus this group belongs to (if campus-specific) |
| start_date | Series start date |
| end_date | Series end date |
| created_at | When the group was created |
| updated_at | When the record was last changed |
| access_level | Visibility level. Values: public, private |
| project_based | Whether this group involves ongoing project work |
| resources | Learning resources and materials |
| registration_deadline | Deadline for series registration |
| unique_id | Short public ID for sharing |
| campus_exclusive | Whether this group is restricted to a specific campus |
| limited_seats | Whether this group has limited seating |
| seats | Total seat capacity |
| interests | Relevant interest tags |
| skills | Skills to be learned |
| status | Series status. Values: draft, active |
| discord_reminder_sent | Whether a Discord reminder has been sent |

## event_group_facilitators

Facilitators assigned to event groups/series. Can be existing members or external speakers.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this facilitator assignment |
| name | Facilitator display name |
| membership_id | The member profile (optional for external facilitators) |
| group_id | The event group this facilitator is assigned to |
| tagline | Short bio or role description |
| avatar | Profile picture URL |
| is_host | Whether this facilitator is the primary host |
| created_at | When the facilitator was assigned |
| updated_at | When the record was last changed |

## event_group_subscriptions

Member enrollments in event groups/series. Tracks participation status.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this subscription |
| group_id | The event group subscribed to |
| membership_id | The member who subscribed |
| created_at | When the subscription started |
| updated_at | When the record was last changed |
| status | Subscription status (default: active) |

## event_team

Teams within team-based events. Supports join codes and venue assignments.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this team |
| event_id | The event this team belongs to |
| name | Team name |
| join_code | Code for others to join the team |
| max_members | Maximum team size |
| venue_id | The venue assigned to this team (for multi-venue events) |
| created_at | When the team was created |
| updated_at | When the record was last changed |

## event_venue

Multiple venue support for events. Allows different locations with separate capacities and schedules.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this venue |
| event_id | The event this venue belongs to |
| name | Venue name |
| map_url | Google Maps or location link |
| is_sub_org | Whether this venue is at a campus location |
| sub_org_id | The campus this venue is at (if campus venue) |
| is_limited_seats | Whether this venue has limited seating |
| total_seats | Maximum venue capacity |
| created_at | When the venue was added |
| updated_at | When the record was last changed |
| is_exclusive | Whether this venue has exclusive use |
| start_date | Venue-specific event start time |
| end_date | Venue-specific event end time |
| registration_deadline | Venue-specific registration deadline |
| address | Physical venue address |

## event_report

Organizer post-event reports with ratings, photos, and materials. Tracks event success metrics.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this report |
| organizer_membership_id | The organizer who submitted this report |
| organizer_id | The organizer record this report belongs to |
| event_id | The event this report is for |
| overall_experience | Overall event success rating (1-5) |
| worth_organizing | Whether the event was worth organizing |
| facilitator_effectiveness | Facilitator effectiveness rating (1-5) |
| networking_opportunities | Networking opportunities rating (1-5) |
| how_organized | Organization quality self-rating (1-5) |
| alignment_with_outcome | Goal alignment rating (1-5) |
| photos | List of event photo URLs |
| materials | List of presentation/material URLs |
| created_at | When the report was submitted |
| updated_at | When the record was last changed |

## dependent_events

Event prerequisite tracking. Defines which events must be attended before registering for others.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this dependency |
| event_id | The event that requires prerequisites |
| dependent_event_id | The prerequisite event that must be attended first |
| created_at | When the dependency was created |
| updated_at | When the record was last changed |

## organizers

Event organizer assignments linking members to events. Supports multi-venue organizer roles.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this organizer assignment |
| membership_id | The member assigned as organizer |
| event_id | The event being organized |
| created_at | When the assignment was made |
| updated_at | When the record was last changed |
| is_host | Whether this organizer is the primary host |
| venue_id | The venue assigned to this organizer (for multi-venue events) |

## education

Educational history for member profiles. Tracks schools, degrees, and enrollment periods.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this education record |
| membership_id | The member this education belongs to |
| school | Institution name |
| degree | Degree or certification type |
| field_of_study | Major or specialization |
| location | Institution location |
| start_date | Enrollment start date |
| end_date | Graduation or end date |
| url | Institution website URL |
| is_current | Whether the member is currently enrolled |
| created_at | When the record was created |
| updated_at | When the record was last changed |
| is_school | Whether this is a school (vs college/university) |
| sub_org_id | The campus (if institution is a TinkerHub campus) |

## experience

Work and volunteer experience for member profiles. Tracks positions, companies, and tenure.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this experience record |
| membership_id | The member this experience belongs to |
| title | Job title or position |
| description | Role responsibilities and achievements |
| start_date | Position start date |
| end_date | Position end date |
| company | Company or organization name |
| location | Work location |
| url | Company website or LinkedIn URL |
| type | Experience type (work, volunteer, internship) |
| is_current | Whether the member is currently in this position |
| created_at | When the record was created |
| updated_at | When the record was last changed |

## membership_categories

Member lifecycle categories for targeted features and eligibility.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this category |
| title | Category name. Values: Kutty Makers (school), Young Makers (college), Friends of TinkerHub (alumni) |
| created_at | When the category was created |
| updated_at | When the record was last changed |

## invitations

Vouching/referral system. Members invite others by phone number; tracks invitation status.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this invitation |
| inviter_membership_id | The member who sent the invite |
| invitee_phone_number | Phone number of invited person |
| status | Invitation status. Values: pending, accepted |
| created_at | When the invitation was sent |
| updated_at | When the record was last changed |
| invitee_membership_id | The membership created after invitation was accepted |
| invitee_name | Name of invited person |

## space_check_in

TinkerSpace (24/7 makerspace in Kochi) check-in/out records via The Hub app. Tracks presence and project work.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this check-in |
| membership_id | The member who checked in |
| check_in_time | When the member checked in |
| check_out_time | When the member checked out |
| purpose | Visit purpose category |
| is_mentor | Whether this is a mentor visit |
| created_at | When the record was created |
| updated_at | When the record was last changed |
| working_on | What the member is working on (free text) |
| project_id | The project being worked on |

## space_manager_report

Manager assessments of member activity at TinkerSpace (24/7 makerspace in Kochi). Tracks work status and engagement.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this report |
| membership_id | The member being assessed |
| work_status | Current work status assessment |
| donor_state | Donor relationship status |
| brief_info | Brief summary of member's work |
| remarks | Additional manager comments |
| submitted_by | The manager who submitted this report |
| created_at | When the report was submitted |
| updated_at | When the record was last changed |

## projects

Hackathon/event submissions and portfolio projects. Supports collaboration, stages, and verification.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this project |
| name | Project title |
| tagline | Short project description |
| description | Full project description and details |
| cover_image | Project cover/banner image URL |
| project_url | Live project or demo URL |
| source_code_url | Source code repository URL |
| open_source | Whether this project is open source |
| event_based | Whether this project was created for an event |
| event_team_id | The team that created this project (for team event submissions) |
| event_id | The event this project was submitted for |
| categories | Project categories or tags |
| verified | Whether this project has been verified by an admin |
| can_collaborate | Whether this project is accepting collaborators |
| start_date | Project start date |
| end_date | Project completion date |
| is_completed | Whether this project is completed |
| created_at | When the project was created |
| updated_at | When the record was last changed |
| type | Project type classification |
| status | Review status. Values: Review Pending, Accepted |
| event_group_id | The event group this project belongs to (for series-based projects) |

## project_collaborators

Project team members with display ordering. Links members to projects they contributed to.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this collaborator record |
| project_id | The project this collaborator works on |
| membership_id | The member who is a collaborator |
| created_at | When the collaborator was added |
| updated_at | When the record was last changed |
| sort_order | Display order position |

## project_stages

Project milestone tracking with ordered stages. Tracks progress through development lifecycle.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this stage |
| project_id | The project this stage belongs to |
| name | Stage name (e.g., Planning, Development, Testing) |
| start_date | Stage start date |
| end_date | Stage completion date |
| stage_order | Display/progression order |
| created_at | When the stage was created |
| updated_at | When the record was last changed |

## awards

Monthly recognition awards for members or campuses (Campus of the Month, Maker of the Month, etc.).

| Field | Description |
|-------|-------------|
| id | Unique identifier for this award |
| title | Award title |
| description | Award description and criteria |
| empty_icon | Icon URL for unearned state |
| filled_icon | Icon URL for earned state |
| category | Award category |
| priority | Display priority ordering |
| created_at | When the award was created |
| updated_at | When the record was last changed |
| group_id | The award group this belongs to |
| sub_org_id | The campus this award is for (for campus awards) |
| membership_id | The member who received this award (for individual awards) |

## award_groups

Award category definitions grouping related awards (e.g., Monthly Awards, Achievement Badges).

| Field | Description |
|-------|-------------|
| id | Unique identifier for this award group |
| name | Group name |
| description | Group description and purpose |
| created_at | When the group was created |
| updated_at | When the record was last changed |
| priority | Display priority ordering |
| category | Group category classification |

## prize_claims

Event prize claim submissions. Attendees submit shipping details to receive prizes.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this prize claim |
| attendee_id | The attendee claiming the prize |
| event_id | The event the prize is from |
| address | Shipping address details |
| tshirt_size | T-shirt size for swag prizes. Values: S, M, L, XL, XXL |
| created_at | When the claim was submitted |
| updated_at | When the record was last changed |

## opportunities

Job, internship, volunteering, and fellowship listings from partners. Supports eligibility criteria and applications.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this opportunity |
| partner_id | The partner organization offering this opportunity |
| title | Opportunity title |
| description | Full opportunity description and requirements |
| location | Work location |
| type | Opportunity type (job, internship, fellowship) |
| category | Industry or skill category |
| mode | Work mode (remote, on-site, hybrid) |
| deadline | Application deadline |
| external_link | External application URL |
| compensation | Compensation details or range |
| is_external | Whether applications are handled externally |
| featured | Whether this is a featured listing |
| created_at | When the opportunity was posted |
| updated_at | When the record was last changed |
| is_volunteering | Whether this is a volunteering opportunity |
| project_count | Minimum projects required for eligibility |
| study_jam_count | Minimum Study Jam attendance for eligibility |
| activity_count | Minimum activity participation for eligibility |
| active_campus_only | Whether this is restricted to active campus members |
| student_only | Whether this is restricted to students |
| year_of_graduation | Required graduation year for eligibility |
| eligibility_question | Custom eligibility screening question |
| task_instructions | Task/assignment instructions for applicants |
| task_resource | Resource URL for application task |
| require_github | Whether a GitHub profile is required |

## opportunity_applications

Member applications to opportunities. Tracks application status and responses.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this application |
| opportunity_id | The opportunity being applied to |
| membership_id | The member who applied |
| eligibility_response | Response to eligibility question |
| task_response | Submitted task/assignment URL or content |
| status | Application status. Values: pending, shortlisted, accepted, rejected |
| created_at | When the application was submitted |
| updated_at | When the record was last changed |

## partners

Sponsor, opportunity provider, and event collaborator organizations. Reusable across events and opportunities.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this partner |
| name | Partner organization name |
| description | Partner description and relationship details |
| avatar | Partner logo URL |
| created_at | When the partner was added |
| updated_at | When the record was last changed |

## partner_contacts

Contact persons at partner organizations. Stores name, title, and contact details.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this contact |
| partner_id | The partner organization this contact works for |
| name | Contact person name |
| title | Job title or position |
| email | Contact email |
| phone | Contact phone number |
| created_at | When the contact was added |
| updated_at | When the record was last changed |

## event_partners

Event-partner links. Associates partners (sponsors/collaborators) with specific events.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this event-partner link |
| event_id | The event in this partnership |
| partner_id | The partner in this partnership |
| created_at | When the partnership was created |
| updated_at | When the record was last changed |

## notification_record

All notification history for email, SMS, push, and WhatsApp messages sent to users. Powers user notification feed.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this notification |
| user_id | The user who received this notification |
| membership_id | The member who received this notification |
| event_id | The event this notification is about (optional) |
| mode | Notification channel. Values: email, sms, whatsapp, push |
| type | Notification type or category |
| title | Notification title |
| message | Notification body content |
| sent_by | The member who sent this notification (optional) |
| created_at | When the notification was sent |
| updated_at | When the record was last changed |
| event_group_id | The event group this notification is about (optional) |

## push_notification_log

Bulk push notification audit log. Tracks campaign-level sends with audience targeting and CSV exports.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this notification log |
| event_id | The event this notification is about |
| title | Push notification title |
| body | Push notification body text |
| audience | Target audience description (e.g., all_attendees, registered) |
| sent_by | The member who sent this notification |
| csv_url | URL to CSV export of recipients |
| created_at | When the notification was sent |
| updated_at | When the record was last changed |

## resources

Event templates, activity playbooks, and learning materials. Contains guidance with checklists and outcomes.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this resource |
| name | Resource title |
| unique_id | Short unique identifier |
| category | Resource category (e.g., event_template, learning) |
| type | Resource type |
| area | Focus area |
| summary | Brief resource summary |
| purpose | Purpose and objectives |
| how | How-to instructions and methodology |
| outcomes | Expected outcomes |
| impacts | Expected impacts |
| pre_event_checklist | Pre-event preparation tasks |
| post_event_checklist | Post-event follow-up tasks |
| curated_by | Curator or author attribution |
| audience | Target audience description |
| resources | Additional resource links and materials |
| created_by | The member who created this resource |
| created_at | When the resource was created |
| updated_at | When the record was last changed |
| is_featured | Whether this resource is featured on discovery pages |
| tag | Resource tags for search |

## resource_log

Resource access and usage tracking. Records which members viewed or used resources for analytics.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this log entry |
| resource_id | The resource that was accessed |
| membership_id | The member who accessed the resource |
| created_at | When the resource was accessed |
| updated_at | When the record was last changed |

## info_card

In-app banners and announcements. Displays contextual content on specific pages with scheduling support.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this info card |
| name | Card display name |
| type | Card type (e.g., banner, tooltip, announcement) |
| state | Card state (e.g., active, inactive, draft) |
| page_location | Target page for display (e.g., home, event_detail) |
| unique_id | Content version identifier |
| info | Card content (title, body, action URL, etc.) |
| start_date | Scheduled start date for display |
| end_date | Scheduled end date for display |
| created_at | When the card was created |
| updated_at | When the record was last changed |

## speaker

Event speaker profiles. Can be linked to existing members or created for external speakers.

| Field | Description |
|-------|-------------|
| id | Unique identifier for this speaker |
| name | Speaker display name |
| membership_id | The member profile (optional for external speakers) |
| event_id | The event this speaker is presenting at |
| tagline | Short bio or role description |
| avatar | Profile picture URL |
| created_at | When the speaker was added |
| updated_at | When the record was last changed |

## schema_migrations

Database migration tracking. Records applied migrations and their state.

| Field | Description |
|-------|-------------|
| version | Migration version number |
| dirty | Whether this migration failed and needs attention |
