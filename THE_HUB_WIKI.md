# The Hub - Product Wiki

**The Hub** is TinkerHub's mobile app and community platform for student makers across India. This wiki documents all product features, user journeys, and technical implementation details.

---

## Quick Reference

| Term | Meaning |
|------|---------|
| **Learning Activity** | Community events (workshops, hackathons, meetups) |
| **Study Jam** | Multi-week learning cohort with sessions |
| **Maker** | Regular community member |
| **Campus** | Student-led TinkerHub chapter at a college/school |
| **TinkerSpace** | 24/7 physical makerspace in Kochi |
| **Vouch** | Invitation/referral from existing member |
| **Kutty Makers** | School student members |
| **Young Makers** | College student members |
| **Friends of TinkerHub** | Alumni and professional supporters |

---

## Table of Contents

### Part 1: User Journeys
- [New User Journey](#new-user-journey)
- [Guest Experience](#guest-experience)
- [Member Journey](#member-journey)
- [Campus Lead Journey](#campus-lead-journey)

### Part 2: Core Features
- [Authentication & Onboarding](#authentication--onboarding)
- [Membership Categories](#membership-categories)
- [Vouching System](#vouching-system)
- [Member Profiles](#member-profiles)

### Part 3: Learning & Events
- [Learning Activities](#learning-activities)
- [Multi-Venue Activities](#multi-venue-activities)
- [Study Jams](#study-jams)
- [Projects](#projects)

### Part 4: Community & Opportunities
- [Opportunities](#opportunities)
- [TinkerSpace](#tinkerspace)
- [Campus Management](#campus-management)
- [Awards & Recognition](#awards--recognition)

### Part 5: Platform & Admin
- [Notifications & Discord](#notifications--discord)
- [Admin Dashboards](#admin-dashboards)
- [Technical Reference](#technical-reference)

---

# Part 1: User Journeys

## New User Journey

A new user's path from discovery to active participation:

```
┌─────────────────────────────────────────────────────────────────┐
│                         DISCOVERY                                │
├─────────────────────────────────────────────────────────────────┤
│  User hears about TinkerHub                                      │
│  • Friend recommendation                                         │
│  • Campus event                                                  │
│  • Social media                                                  │
│  • College notice                                                │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOWNLOADS APP                               │
├─────────────────────────────────────────────────────────────────┤
│  Downloads "The Hub" from App Store / Play Store                │
│  Opens app → Sees walkthrough screens                           │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PHONE VERIFICATION                          │
├─────────────────────────────────────────────────────────────────┤
│  Enters phone number                                             │
│  Receives OTP via SMS                                            │
│  Verifies OTP → Account created                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VOUCH CHECK                                │
├─────────────────────────────────────────────────────────────────┤
│  System checks: Has someone vouched for this phone number?      │
│                                                                  │
│  ┌─────────────────┐           ┌─────────────────┐              │
│  │   HAS VOUCH     │           │   NO VOUCH      │              │
│  │   ─────────     │           │   ────────      │              │
│  │ Proceed to      │           │ Three options:  │              │
│  │ onboarding      │           │ • Find vouch    │              │
│  │ with voucher    │           │ • Continue as   │              │
│  │ info displayed  │           │   Guest         │              │
│  │                 │           │ • Retry check   │              │
│  └────────┬────────┘           └────────┬────────┘              │
│           │                             │                        │
└───────────┴─────────────────────────────┴───────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE ONBOARDING                           │
├─────────────────────────────────────────────────────────────────┤
│  17-step onboarding flow (see detailed section below)           │
│  • Basic info: Name, email, birthday, avatar, gender, bio       │
│  • Education: College/school, course, year                      │
│  • Interests: Select 2-5 technology interests                   │
│  • Skills: Programming languages and proficiency                │
│  • Category philosophy: Learn about Kutty/Young/Friends values  │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ACTIVE MEMBER                               │
├─────────────────────────────────────────────────────────────────┤
│  Full access to The Hub:                                         │
│  • Attend unlimited learning activities                          │
│  • Join Study Jams                                               │
│  • Create and showcase projects                                  │
│  • Apply for opportunities                                       │
│  • Check-in at TinkerSpace                                       │
│  • Vouch for others                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Guest Experience

Users without a vouch can experience TinkerHub as guests with limited access.

### Who Becomes a Guest?

- Users who choose "Continue as Guest" during vouch check
- Users who haven't been vouched but want to explore

### Guest Limitations

| Feature | Guest Access | Full Member Access |
|---------|-------------|-------------------|
| Learning Activities | 2 activities max | Unlimited |
| TinkerSpace visits | Counts toward 2-event limit | Unlimited |
| Create projects | No | Yes |
| Apply for opportunities | No | Yes |
| Access exclusive events | No | Yes |
| Vouch others | No | Yes |
| Public profile | Limited | Full |

### Guest Journey

```
Guest registers for 1st activity
        │
        ▼
Attends activity, enjoys experience
        │
        ▼
Registers for 2nd activity
        │
        ▼
After 2nd activity:
        │
   ┌────┴────┐
   │         │
Gets vouch   No vouch
   │         │
   ▼         ▼
Becomes    "Exhausted" status
full       Cannot register for
member     more activities
```

### Guest-to-Member Conversion

When a guest receives a vouch:

1. **Vouch received**: Existing member sends invite to guest's phone
2. **System detects vouch**: Next app open shows "You've been vouched!"
3. **Profile updated**:
   - `isGuest` → `false`
   - `isOnboard` → `true`
   - `invitedBy` → set to voucher's ID
4. **Full access unlocked**: All features become available

### Guest UI Experience

Guests see a special screen with:
- Yellow "Limited access" header
- Clear explanation of what they can/cannot do
- Options to find someone who can vouch them
- "Continue as Guest" button

**Key Files:**
- `/TinkerHub-App/lib/screens/onboarding-v2/check_vouch.dart`
- `/TinkerHub-App-Backend/internal/handler/attendee.go` (2-event limit)

---

## Member Journey

Once onboarded, members follow typical engagement patterns:

### First Week
1. **Explore home feed** - See featured activities and Study Jams
2. **Complete profile** - Add bio, skills, social links
3. **Register for first activity** - Workshop or meetup
4. **Join campus** - Connect with local chapter

### First Month
1. **Attend 2-3 activities** - Build engagement
2. **Join a Study Jam** - Commit to learning cohort
3. **Create first project** - Showcase on profile
4. **Connect Discord** - Join community chat

### Ongoing Engagement
1. **Regular activity attendance** - Build reputation
2. **Complete Study Jams** - Develop skills
3. **Apply for opportunities** - Internships, jobs
4. **Vouch others** - Grow the community
5. **Become campus lead** - Take on leadership

---

## Campus Lead Journey

Campus leads are student leaders managing TinkerHub chapters at their colleges.

### Becoming a Campus Lead

1. **Active participation** - Regular attendance, community contribution
2. **Nomination** - Identified by existing leads or HQ
3. **Onboarding** - Learn campus management in Koottam dashboard
4. **Assignment** - Added to `sub_org_admins` with role "Lead"

### Campus Lead Responsibilities

| Area | Tasks |
|------|-------|
| **Activities** | Create, organize, and report on campus events |
| **Members** | Approve new members, manage campus community |
| **Study Jams** | Run campus-specific learning programs |
| **Reporting** | Submit event reports, track engagement |
| **Coordination** | Work with HQ on org-wide initiatives |

### Campus Lead Tools

- **Koottam Dashboard** - Web admin interface
- **Discord** - Community coordination
- **The Hub App** - Manage learners, check-in attendees

---

# Part 2: Core Features

## Authentication & Onboarding

### Phone-Based Authentication

TinkerHub uses phone number as the primary identity:

1. **Enter phone number** - User inputs their mobile number
2. **Receive OTP** - One-time password sent via SMS
3. **Verify OTP** - User enters code to authenticate
4. **JWT tokens** - Session managed with access + refresh tokens

**Why phone-based?**
- Most students in India have phones, not always email
- Prevents duplicate accounts
- Enables phone-based vouching

### Onboarding Flow (17 Steps)

The onboarding flow collects comprehensive member information through an indexed sequence of screens:

#### Phase 1: Basic Information (Steps 1-6)

| Step | Screen | Fields | Validation |
|------|--------|--------|------------|
| 1 | Name | First name, Last name | Min 3 chars, alphabetic only |
| 2 | Email | Email address, Communication opt-in | Valid email format |
| 3 | Birthday | Date of birth | Min age: 7 years |
| 4 | Avatar | Profile picture | Square crop, face visible |
| 5 | Gender | Male / Female / Non-binary | Required selection |
| 6 | Bio | Self-description | Min 16 chars, max 280 |

#### Phase 2: Education Type (Step 7)

User selects their current status:
- Currently in college → College flow
- Completed college → College flow
- Currently in school → School flow
- Finished school (not in college) → School flow

#### Phase 3A: College Student Flow (Steps 8-12)

| Step | Screen | Fields | Notes |
|------|--------|--------|-------|
| 8 | District | Kerala district selection | "Outside Kerala" option available |
| 9 | College | Searchable college list | Filtered by district |
| 10 | Course | Academic program | B.Tech, BCA, etc. |
| 11 | Stream | Specialization | CSE, ECE, etc. (if applicable) |
| 12 | Year | Admission and graduation years | Date pickers |

#### Phase 3B: School Student Flow (Step 8)

| Step | Screen | Fields | Notes |
|------|--------|--------|-------|
| 8 | School Name | Text input | Manual entry |

#### Phase 4: Skills & Interests (Steps 13-15)

| Step | Screen | Fields | Validation |
|------|--------|--------|------------|
| 13 | Interests | Multi-select chips | Select 2-5 interests |
| 14 | Languages | Programming languages | Optional, max 5 |
| 15 | Proficiency | Rate each language | Beginner/Intermediate/Advanced |

#### Phase 5: Confirmation (Step 16-17)

| Step | Screen | Action |
|------|--------|--------|
| 16 | Confirm | Review all info, accept terms |
| 17 | Setting Up | Profile created, proceed to category |

### Locked Fields After Onboarding

These fields **cannot be changed** after profile confirmation (for certificate integrity):
- Full Name
- Date of Birth
- Gender
- College/School
- Course and Stream
- Year of admission/graduation

**Key Files:**
- `/TinkerHub-App/lib/screens/onboarding-v2/`
- `/TinkerHub-App-Backend/internal/handler/user.go`

---

## Membership Categories

Members are **auto-assigned** to categories based on education data:

### Kutty Makers (School Students)

| Aspect | Description |
|--------|-------------|
| **Who** | School students (typically ages 10-17) |
| **Philosophy** | Learning through play and exploration |
| **Focus** | Early exposure to technology and making |
| **Events** | Age-appropriate workshops and activities |

### Young Makers (College Students)

| Aspect | Description |
|--------|-------------|
| **Who** | College/university students |
| **Philosophy** | Peer learning, project building, community contribution |
| **Focus** | Skill development and career preparation |
| **Events** | Hackathons, Study Jams, workshops, meetups |

### Friends of TinkerHub (Alumni & Supporters)

| Aspect | Description |
|--------|-------------|
| **Who** | Graduated students, professionals, mentors |
| **Philosophy** | Giving back, mentorship, supporting next generation |
| **Focus** | Mentoring, volunteering, speaking at events |
| **Events** | Mentoring sessions, guest lectures |

### Category Transitions

Members can transition between categories as their status changes (e.g., student graduates → Friends of TinkerHub). This is updated via profile category field.

**Database:** `memberships.category_id` → links to `membership_categories` table

---

## Vouching System

The vouching system serves as TinkerHub's quality control and community growth mechanism.

### Purpose

| Goal | How Vouching Helps |
|------|-------------------|
| **Quality Control** | Only vetted members join |
| **Community Building** | Members bring their networks |
| **Exclusivity** | Invite-only feel increases value |

### How Vouching Works

```
Existing Member                    New User
      │                                │
      │ Knows new user's phone number  │
      │                                │
      ▼                                │
[Opens Vouch screen]                   │
      │                                │
      ▼                                │
[Enters phone number]                  │
      │                                │
      ▼                                │
[Invitation created] ─────────────────►│
      │                    (SMS sent)  │
      │                                ▼
      │                      [Downloads app]
      │                                │
      │                                ▼
      │                      [Enters same phone]
      │                                │
      │                                ▼
      │◄──────────────────── [Vouch verified!]
      │                                │
[Sees invite accepted]                 ▼
                             [Completes onboarding]
                                       │
                                       ▼
                             [Full member access]
```

### Invitation States

| Status | Description |
|--------|-------------|
| `pending` | Invitation sent, not yet accepted |
| `accepted` | New user has joined and completed onboarding |

### Vouch Visibility

- **On inviter's profile**: Shows list of members they vouched
- **On invitee's profile**: Shows "Vouched by [Name]"
- **In member directory**: Vouch connections visible

**Key Files:**
- `/TinkerHub-App/lib/screens/vouch.dart`
- `/TinkerHub-App-Backend/internal/handler/invite.go`

---

## Member Profiles

### Profile Components

| Section | Fields |
|---------|--------|
| **Basic Info** | Name, avatar, bio, contact |
| **Social Links** | GitHub, LinkedIn, Instagram, Twitter |
| **Education** | Schools, colleges, degrees, years |
| **Experience** | Jobs, internships, volunteering |
| **Skills** | Technical skills, interests, languages |
| **Activity** | Events attended, projects, Study Jams |

### Public Profiles

Members have public portfolio pages at `tinkerhub.org/@username`:

- **Theme**: "Mangosteen" is the default portfolio theme
- **Visibility**: Can be set to private
- **Deep linking**: Accessible via `/@username` or `/u/:id`

### GitHub Integration

Members can connect GitHub to:
- Display contribution activity on profile
- Verify technical skills
- Auto-import projects

**Connection flow:**
1. Click "Connect GitHub" in profile settings
2. OAuth redirect to GitHub
3. Authorize TinkerHub app
4. Token stored, contributions displayed

### Profile Editing

| Field Type | Editable? | Notes |
|------------|-----------|-------|
| Bio, avatar | Yes | Anytime |
| Social links | Yes | Anytime |
| Skills, interests | Yes | Anytime |
| Work experience | Yes | Can add/remove |
| **Name** | **No** | Locked after onboarding |
| **Education (primary)** | **No** | Locked for certificate integrity |
| **Birthday, gender** | **No** | Locked after onboarding |

**Key Files:**
- `/TinkerHub-App/lib/screens/main/profile/`
- `/TinkerHub-App/lib/screens/edit_profile/`

---

# Part 3: Learning & Events

## Learning Activities

Learning Activities (internally called "events") are the core engagement mechanism. They range from single-session workshops to multi-day hackathons.

### Activity Types

| Type | Code | Description | Example |
|------|------|-------------|---------|
| Talk Session | `Talk_Session` | Speaker presentations | Guest lectures, tech talks |
| Meetup | `Meetup` | Casual gatherings | Community meetups |
| Core Team Meeting | `Core_Team_Meeting` | Internal meetings | Campus lead syncs |
| Learning Program | `Learning_Program` | Structured learning | Skill workshops |
| Workshop | `Workshop` | Hands-on sessions | Coding bootcamps |
| Hackathon | `Hackathon` | Build competitions | 24-48 hour events |
| Project Building | `Project_Building_Program` | Extended projects | Multi-session builds |

### Activity Lifecycle

```
draft ──► published ──► [paused] ──► cancelled
              │
              ▼
         Event runs
              │
              ▼
         completed
```

| Status | Description |
|--------|-------------|
| `draft` | Created but not visible to members |
| `published` | Visible, open for registration |
| `paused` | Registration temporarily stopped |
| `cancelled` | Event cancelled, registrations voided |

### Activity Configuration

#### Basic Settings
- Name, description, banner image
- Start and end dates/times
- Location (physical address) or virtual (meet URL)

#### Registration Settings
| Setting | Effect |
|---------|--------|
| `isInviteOnly` | Registration requires approval |
| `isLimitedSeats` | Enforces capacity limits |
| `registrationDeadline` | Cutoff for signups |
| `campusExclusive` | Restricted to specific campus |
| `categoryExclusive` | Restricted to membership categories |

#### Advanced Features
| Setting | Effect |
|---------|--------|
| `teamEvent` | Enables team formation |
| `multipleVenue` | Event at multiple locations |
| `isProjectBased` | Requires project submission |
| `isDependent` | Requires prerequisite attendance |
| `hasPrize` | Enables prize claiming |

### Registration Flow

```
Member discovers activity (home feed, campus page, shared link)
                    │
                    ▼
            Checks eligibility:
              • Campus match (if exclusive)
              • Category match (if exclusive)
              • Seats available (if limited)
              • Prerequisite attended (if dependent)
                    │
                    ▼
           Clicks "Register"
                    │
                    ▼
        ┌───────────────────────┐
        │  Registration Status  │
        ├───────────────────────┤
        │ "registered" - Auto   │ ← For open activities
        │ "applied" - Review    │ ← For invite-only
        └───────────────────────┘
                    │
                    ▼
            Receives ticket
              (QR code)
```

### Check-in Process

```
Day of activity
        │
        ▼
Member arrives at venue
        │
        ▼
Opens ticket in app
  (shows QR code)
        │
        ▼
Organizer scans QR with app
        │
        ▼
System verifies ticket:
  • Valid for this activity
  • Not already checked in
        │
        ▼
Check-in confirmed:
  • checkIn = true
  • checkInTime = now()
  • checkInBy = organizer ID
        │
        ▼
Member's app receives
WebSocket notification
  (haptic + toast)
```

### Team-Based Activities

For hackathons and group projects:

1. **Team Creation**
   - Leader creates team with name
   - System generates 8-char join code
   - Sets max team size

2. **Team Joining**
   - Member enters join code
   - Validated against max size and venue
   - Added to team roster

3. **Team Stages** (for multi-stage events)
   - Discord connection (optional)
   - Team approval (all members registered)
   - Check-in
   - Project submission
   - Feedback
   - Prize claim

### Post-Activity

#### Organizer Report
After activity ends, organizers submit:
- Ratings (1-5): Experience, facilitation, organization
- Photos from the event
- Materials (presentations, recordings)
- Assessment: Worth organizing?

#### Attendee Feedback
Checked-in attendees provide:
- Ratings (1-5): Experience, facilitation, networking, organization
- Free text: What they liked, how to improve

#### Prize Claiming
For activities with prizes:
- Winners claim via shipping form
- Collect address and t-shirt size
- Deadline enforced

**Key Files:**
- `/TinkerHub-App/lib/screens/event/`
- `/TinkerHub-App-Backend/internal/handler/event.go`
- `/TinkerHub-App-Backend/internal/handler/attendee.go`

---

## Multi-Venue Activities

Multi-Venue Activities are distributed programs running simultaneously across multiple physical locations while maintaining a unified identity.

### Philosophy

Multi-Venue Activities reflect how TinkerHub operates—chapters, colleges, and cities running parallel activities under a shared purpose. The Hub provides structure and visibility while respecting local ownership.

### What Makes an Activity Multi-Venue?

A Multi-Venue Activity is **one activity entity** with:
- Common theme, objective, and identity
- Multiple physical venues (campuses, cities, partner spaces)
- Shared or loosely synced timeline
- Central visibility with local execution freedom

**Examples:**
- Hackathons across 50+ campuses
- Watch-parties with local discussions
- Project sprints like TinkHerHack or Useless Projects

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARENT ACTIVITY                               │
│  Name, description, overall dates, theme                        │
│  multipleVenue: true                                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   VENUE 1     │  │   VENUE 2     │  │   VENUE 3     │
├───────────────┤  ├───────────────┤  ├───────────────┤
│ Location      │  │ Location      │  │ Location      │
│ Local hosts   │  │ Local hosts   │  │ Local hosts   │
│ Capacity      │  │ Capacity      │  │ Capacity      │
│ Own deadline  │  │ Own deadline  │  │ Own deadline  │
│ Own schedule  │  │ Own schedule  │  │ Own schedule  │
└───────────────┘  └───────────────┘  └───────────────┘
```

### Venue Properties

| Property | Description |
|----------|-------------|
| `name` | Venue name (city, campus) |
| `address` | Physical location |
| `totalSeats` | Venue capacity |
| `isExclusive` | Restrict to specific campus |
| `subOrgId` | Linked campus (if exclusive) |
| `registrationDeadline` | Venue-specific cutoff |
| `startDate`, `endDate` | Venue-specific timing |

### Exclusive vs Non-Exclusive Venues

| Type | Who Can Register |
|------|------------------|
| **Exclusive** (`isExclusive: true`) | Only members from linked campus |
| **Non-Exclusive** (`isExclusive: false`) | Any member from any campus |

**Smart Fallback:**
1. System shows venues matching member's campus first
2. If campus venue full/expired, shows non-exclusive alternatives

### Venue Selection & Lock-in

#### Selection Process
1. Member registers for multi-venue activity
2. Venue selection screen shows available venues
3. Member selects venue
4. `attendee.venueId` set permanently

#### Lock-in Rules

| Stage | Can Switch Venue? |
|-------|-------------------|
| Before registration | N/A |
| At registration | Select venue (one-time) |
| **After registration** | **No - venue locked** |

**Why Lock-in?**
- Fair team composition
- Accurate capacity planning
- Venue-specific evaluations
- Simplified logistics

### Team-Venue Relationships

For project-based multi-venue activities:
- Teams belong to **one venue only**
- All team members must have same venue
- Join codes only work within venue
- Projects evaluated at venue level first

### Project-Based Multi-Venue Activities

Some activities span multiple days with project outcomes:

| Characteristic | Description |
|----------------|-------------|
| Project-Centric | Participation anchored on project outcome |
| Multi-Day | Work spans several days or weeks |
| Flexible Slots | Venues may offer different time slots |
| Shared Evaluation | Common judging criteria across venues |
| Local Support | Mentorship handled per venue |

**Examples:** TinkHerHack, Useless Projects, Build Sprints

**Key Files:**
- `/TinkerHub-App/lib/screens/event/team_based/venue.dart`
- `/TinkerHub-App-Backend/internal/handler/event_venue.go`

---

## Study Jams

Study Jams are **multi-week learning cohorts** combining structured curriculum, peer learning, and mentorship.

### What is a Study Jam?

A Study Jam is a learning program with:
- Multiple sessions over several weeks
- Facilitators guiding the cohort
- Peer learning groups
- Progress tracking
- Discord community channel
- Optional project requirements

### Study Jam Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      STUDY JAM                                   │
│  Name: "Python Fundamentals"                                     │
│  Duration: 4 weeks                                               │
│  Status: active                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Sessions (Lessons):                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Week 1      │  │ Week 2      │  │ Week 3      │  ...         │
│  │ Intro       │  │ Variables   │  │ Functions   │              │
│  │ mandatory   │  │ mandatory   │  │ mandatory   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  Facilitators:                                                   │
│  • Host: Jane (industry mentor)                                  │
│  • Co-facilitator: John (campus lead)                           │
│                                                                  │
│  Subscribers: 45 active learners                                │
│                                                                  │
│  Resources: Slides, exercises, reading materials                │
│                                                                  │
│  Discord: #python-fundamentals channel                          │
└─────────────────────────────────────────────────────────────────┘
```

### Study Jam Lifecycle

```
┌─────────┐
│  draft  │ ◄── Created, adding sessions
└────┬────┘
     │ Add 2+ sessions + 1+ host
     ▼
┌─────────────┐
│  published  │ ◄── Open for subscriptions
└──────┬──────┘
       │
       ▼
   Sessions run
   (weekly)
       │
       ▼
   Last session
   completed
       │
       ▼
   Study Jam ends
   (status: past)
```

### Subscription Flow

```
Member discovers Study Jam
        │
        ▼
Clicks "Subscribe"
        │
        ▼
Subscription status: "applied"
        │
        ▼
Admin reviews in "Manage Learners"
        │
   ┌────┴────┐
   │         │
Accept     Reject
   │         │
   ▼         ▼
"active"   "rejected"
   │
   ▼
• Auto-registered for mandatory sessions
• Added to Discord channel
• Can access resources
```

### Progress Tracking

Members' progress is tracked across all sessions:

```
┌─────────────────────────────────────────┐
│  Study Jam Progress                      │
├─────────────────────────────────────────┤
│                                          │
│  [●] Session 1 - Intro          ✓       │
│  [●] Session 2 - Variables      ✓       │
│  [○] Session 3 - Functions   (upcoming) │
│  [●] Session 4 - Loops       ✗ missed   │
│  [○] Session 5 - Projects    (upcoming) │
│                                          │
│  Progress: ████████░░ 60%               │
│                                          │
│  ⚠️ You missed 1 mandatory session      │
└─────────────────────────────────────────┘
```

#### Progress Status

| Missed Mandatory | Status | Consequence |
|------------------|--------|-------------|
| 0 | On pace | Continue normally |
| 1 | At risk | Warning shown |
| 2+ | Depends on settings | Configurable per Study Jam |

### Mandatory vs Optional Sessions

| Type | `groupMandatory` | Auto-Register | Affects Progress |
|------|------------------|---------------|------------------|
| Mandatory | `true` | Yes (all subscribers) | Yes |
| Optional | `false` | No (manual) | No |

### Facilitators

| Role | Capabilities |
|------|--------------|
| **Host** (`isHost: true`) | Sync Discord, manage resources, full control |
| **Facilitator** | View progress, assist learners |

### Discord Integration

Each Study Jam gets:
- Dedicated Discord channel (created on publish)
- Facilitators added automatically
- Subscribers added when approved
- Automated session reminders

**Key Files:**
- `/TinkerHub-App/lib/screens/study_jams/`
- `/TinkerHub-App-Backend/internal/handler/event_group.go`

---

## Projects

Projects serve as both **portfolio showcase** and **event submissions**.

### Project Types

| Type | Purpose |
|------|---------|
| Portfolio Projects | Personal/academic work for profile |
| Event Submissions | Hackathon and competition entries |
| Study Jam Projects | Projects from learning programs |

### Project Information

| Field | Description |
|-------|-------------|
| `name` | Project title |
| `tagline` | Short description |
| `description` | Full details |
| `cover_image` | Banner image |
| `project_url` | Live demo link |
| `source_code_url` | GitHub/repository |
| `categories` | Tags |
| `open_source` | Is code public? |
| `can_collaborate` | Accepting collaborators? |

### Project Status

| Status | Description |
|--------|-------------|
| `Review Pending` | Submitted, awaiting admin review |
| `Accepted` | Approved and visible |

### Collaborators

- Multiple members can be added
- Display order customizable
- Each linked to their profile

### Project Stages

For larger projects, track milestones:
- Planning
- Development
- Testing
- Launch

### Event-Based Projects

For hackathons and competitions:
- Linked to event and team
- Submission deadline enforced
- Requires GitHub link (unless `allowNonGithubLinks`)

**Key Files:**
- `/TinkerHub-App/lib/screens/project/`
- `/TinkerHub-App-Backend/internal/handler/project.go`

---

# Part 4: Community & Opportunities

## Opportunities

Opportunities connect members with jobs, internships, and volunteering positions.

### Opportunity Types

| Type | Description |
|------|-------------|
| Jobs | Full-time positions at partner companies |
| Internships | Internship opportunities for students |
| Volunteering | Volunteer roles within TinkerHub |
| Fellowships | Fellowship programs and grants |

### Eligibility System

Opportunities can define requirements:

| Criterion | Description |
|-----------|-------------|
| Activity-based | Minimum event attendance count |
| Project-based | Minimum number of projects |
| Study Jam-based | Minimum Study Jam completion |
| Campus-based | Must be from active campus |
| Student-only | Restricted to current students |
| Graduation year | Specific year required |
| Custom question | Screening question |

### Application Flow

```
Member views opportunity
        │
        ▼
System checks eligibility
        │
        ▼
Member answers eligibility question (if required)
        │
        ▼
Member completes task (if required)
        │
        ▼
Application submitted
        │
        ▼
┌─────────────────────────────┐
│   Application Status        │
├─────────────────────────────┤
│ pending - Under review      │
│ shortlisted - Selected      │
│ accepted - Offer made       │
│ rejected - Not selected     │
└─────────────────────────────┘
```

**Key Files:**
- `/TinkerHub-App/lib/screens/opportunity/`
- `/TinkerHub-App-Backend/internal/handler/opportunity.go`

---

## TinkerSpace

TinkerSpace is TinkerHub's **24/7 physical makerspace** in Kochi.

### Purpose

A dedicated workspace where members can:
- Work on projects
- Collaborate with others
- Access tools and equipment
- Attend in-person events
- Connect with mentors

### Check-in System

```
Member arrives at TinkerSpace
        │
        ▼
Opens app → Check-in screen
        │
        ▼
Selects purpose:
  • Working on project
  • Attending event
  • Mentoring
  • General visit
        │
        ▼
Links project (optional)
        │
        ▼
Checks in (timestamp recorded)
        │
        ▼
Works at space
        │
        ▼
Checks out when leaving
```

### Check-in Data

| Field | Description |
|-------|-------------|
| `check_in_time` | When member arrived |
| `check_out_time` | When member left |
| `purpose` | Why they're visiting |
| `is_mentor` | Visiting as mentor? |
| `working_on` | What they're working on |
| `project_id` | Linked project |

### Manager Reports

Space managers can submit assessments:
- Work status evaluation
- Engagement quality
- Member's progress notes

**Key Files:**
- `/TinkerHub-App/lib/screens/check-in/`
- `/TinkerHub-App/lib/screens/space/`

---

## Campus Management

Campuses (sub-organizations) are student-led TinkerHub chapters at colleges and schools.

### Campus Structure

| Component | Description |
|-----------|-------------|
| Name | Campus/chapter name |
| Institution | College/school details |
| Location | District, address, map |
| Leadership | Campus leads by academic year |
| Members | Makers belonging to campus |
| Events | Campus-specific activities |

### Campus Leadership

Each campus has yearly leadership:

| Role | Description |
|------|-------------|
| Lead | Primary campus leader |
| Co-Lead | Supporting leadership |

Leadership tracked by academic year for historical records.

### Campus State

| State | Description |
|-------|-------------|
| `unknown` | Status not verified |
| `active` | Currently operating |

### Institutional Contacts

Campuses can store:
- Principal/head name and email
- Faculty coordinator name and email

**Key Files:**
- `/TinkerHub-App/lib/screens/campus/`
- `/TinkerHub-App-Backend/internal/handler/suborgs.go`

---

## Awards & Recognition

The Awards system provides **monthly recognition** for outstanding members and campuses.

### Award Types

| Award | Recipient | Frequency |
|-------|-----------|-----------|
| Campus of the Month | Top-performing campus | Monthly |
| Maker of the Month | Outstanding member | Monthly |

### Award Structure

- Awards organized into groups (categories)
- Can be assigned to members or campuses
- Visual icons for earned/unearned states
- Displayed on profiles

**Key Files:**
- `/TinkerHub-App-Backend/internal/handler/awards.go`

---

# Part 5: Platform & Admin

## Notifications & Discord

### Notification Channels

| Channel | Use Case | Status |
|---------|----------|--------|
| Push Notifications | Event reminders, updates | Active |
| Email | Newsletters, important comms | Active |
| SMS | OTP only | Active |
| WhatsApp | Reserved | Not active |

### Notification Types

- Event registration confirmations
- Event reminders (day before, hour before)
- Check-in confirmations
- Opportunity updates
- Study Jam session reminders
- System announcements

### Discord Integration

Discord is the primary community chat platform:

| Feature | Description |
|---------|-------------|
| Community Chat | Main discussion channels |
| Event Coordination | Plan and discuss events |
| Study Jam Channels | Dedicated channel per cohort |
| Bot Integrations | Sync data between app and Discord |

**Discord Features:**
- Account linking (Discord ID in profile)
- Study Jam channel auto-creation
- Session reminders via bot
- Member sync when subscribers approved

**Key Files:**
- `/TinkerHub-App-Backend/internal/handler/notifications.go`
- `/hub-comms/` (Communication engine)

---

## Admin Dashboards

### Koottam Dashboard

Web-based admin interface for HQ staff, campus leads, and organizers.

**URL:** Koottam internal dashboard

#### Features by Module

| Module | Capabilities |
|--------|--------------|
| **Dashboard** | Statistics, charts, overview metrics |
| **Activities** | Create, edit, manage events; attendee management |
| **Study Jams** | Create, publish, manage cohorts |
| **Opportunities** | Post jobs, review applications |
| **Campuses** | View and manage campus chapters |
| **Members** | Search and view profiles |

#### Role-Based Access

| Role | Access |
|------|--------|
| SuperAdmin | Full access, all campuses |
| Admin | Full access, all campuses |
| CampusAdmin | Own campus only |
| Staff | Assigned features |

### TH-Resources Dashboard

Resource library management for templates and guides.

#### Resource Types

| Type | Description |
|------|-------------|
| Event Templates | Templates for running activities |
| Activity Playbooks | Step-by-step guides |
| Campus Guides | Guides for campus leads |
| Learning Materials | Curated resources |

**Key Files:**
- `/Tinkerhub-Koottam/src/pages/`
- `/TH-Resources/src/pages/`

---

## Technical Reference

### User Roles

| Role | ID | Description |
|------|-----|-------------|
| SuperAdmin | 1 | Full system access |
| Admin | 2 | HQ administrative access |
| CampusAdmin | 3 | Campus-specific access |
| Staff | 5 | Limited admin access |
| Maker | 4 | Regular member |

### Deep Linking Routes

| Route | Purpose |
|-------|---------|
| `/event/:id` | Activity details |
| `/@:username` | Member profile by username |
| `/u/:id` | Member profile by ID |
| `/campus/:id` | Campus details |
| `/opportunity/:id` | Opportunity details |
| `/project/:id` | Project details |
| `/study-jam/:id/:slug` | Study Jam details |
| `/feedback/:id` | Event feedback form |
| `/checkin` | Check-in page |
| `/vouch` | Vouch page |
| `/onboard/:invitedBy` | Onboarding with referral |

### Tech Stack

| Component | Technology |
|-----------|------------|
| Mobile App | Flutter, Riverpod, GoRouter |
| Backend API | Go, Echo framework, PostgreSQL |
| Admin Dashboard | React, Vite, TanStack Query |
| Resources Dashboard | React, Vite |
| Comms Engine | Bun, Elysia, Prisma |
| Push | Firebase Cloud Messaging |
| Storage | AWS S3 |
| Analytics | Mixpanel, Firebase Analytics |
| Config | Firebase Remote Config |

### Database Tables (Core)

| Table | Purpose |
|-------|---------|
| `users` | Phone-based authentication |
| `memberships` | Member profiles |
| `roles` | Permission levels |
| `orgs` | Parent organization |
| `sub_orgs` | Campus chapters |
| `events` | Learning activities |
| `attendees` | Registrations and check-ins |
| `event_groups` | Study Jams |
| `event_venue` | Multi-venue locations |
| `projects` | Member projects |
| `opportunities` | Job/internship listings |
| `invitations` | Vouch system |
| `space_check_in` | TinkerSpace attendance |

### Key File Locations

| Feature | Mobile App | Backend |
|---------|------------|---------|
| Auth | `/lib/screens/auth/` | `/internal/handler/auth.go` |
| Onboarding | `/lib/screens/onboarding-v2/` | `/internal/handler/user.go` |
| Events | `/lib/screens/event/` | `/internal/handler/event.go` |
| Study Jams | `/lib/screens/study_jams/` | `/internal/handler/event_group.go` |
| Projects | `/lib/screens/project/` | `/internal/handler/project.go` |
| Opportunities | `/lib/screens/opportunity/` | `/internal/handler/opportunity.go` |
| Check-in | `/lib/screens/check-in/` | `/internal/handler/checkin.go` |
| Vouch | `/lib/screens/vouch.dart` | `/internal/handler/invite.go` |

---

## Appendix: Enum Values Quick Reference

| Field | Possible Values |
|-------|-----------------|
| `events.type` | Talk_Session, Meetup, Core_Team_Meeting, Learning_Program, Workshop, Hackathon, Project_Building_Program |
| `events.status` | draft, published, paused, cancelled |
| `attendees.registration_status` | registered, applied |
| `roles.name` | SuperAdmin, Admin, CampusAdmin, Staff, Maker |
| `projects.status` | Review Pending, Accepted |
| `opportunity_applications.status` | pending, shortlisted, accepted, rejected |
| `invitations.status` | pending, accepted |
| `event_groups.status` | draft, active |
| `event_groups.access_level` | public, private |
| `sub_orgs.state` | unknown, active |
| `membership_categories.title` | Kutty Makers, Young Makers, Friends of TinkerHub |
| `tshirt_size` | S, M, L, XL, XXL |
| `notification_record.mode` | email, sms, whatsapp, push |

---

*Last updated: February 2026*
