# Secret Santa 🎅

A fullstack Next.js application for managing Secret Santa gift exchanges with internationalization, OAuth authentication, and automated email notifications.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google
- 🌍 **Internationalization** - Support for English and Spanish
- 📧 **Automated Email Notifications** - Send Secret Santa assignments via Resend
- 👥 **Group Management** - Create and manage multiple Secret Santa groups
- 🎲 **Circular Pairing Algorithm** - Fair assignment ensuring everyone gives and receives exactly one gift
- 🔒 **Finalization Protection** - Prevent edits after assignments are made
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Email**: Resend
- **Internationalization**: next-intl
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- Resend API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pleytonsoftware/secret-santa.git
cd secret-santa
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/secret_santa"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

5. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Login** - Sign in with your Google account
2. **Create a Group** - Click "Create New Group" and enter a name
3. **Add Participants** - Add participants with their name and email
4. **Randomize** - Click "Randomize & Send Emails" to create assignments and notify everyone
5. **Done!** - Each participant receives an email with their Secret Santa assignment

## Project Structure

```
secret-santa/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── groups/
│   │   │   └── locale/
│   │   ├── dashboard/
│   │   │   ├── groups/[groupId]/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   ├── prisma.ts
│   │   └── secret-santa.ts
│   ├── messages/
│   │   ├── en.json
│   │   └── es.json
│   └── types/
├── .env.example
└── next.config.ts
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/groups` | Get all groups for authenticated user |
| POST | `/api/groups` | Create a new group |
| GET | `/api/groups/[groupId]` | Get group details with participants |
| PATCH | `/api/groups/[groupId]` | Update group name/description |
| DELETE | `/api/groups/[groupId]` | Delete group |
| POST | `/api/groups/[groupId]/participants` | Add participant to group |
| DELETE | `/api/groups/[groupId]/participants/[participantId]` | Remove participant |
| POST | `/api/groups/[groupId]/randomize` | Generate assignments and send emails |

## License

MIT
