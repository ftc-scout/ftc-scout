# Video Clipping Feature

## Overview

The video clipping feature allows authorized users to associate YouTube videos with specific matches. Users can:
- Log in to the system
- Add YouTube video clips to matches by specifying timestamps
- Play clipped videos directly from the match table

## Setup Instructions

### 1. Database Migration

The feature adds two new tables to the database:
- `user` - Stores user authentication information
- `match_video` - Stores video clip information

These tables will be created automatically when the server starts with `SYNC_DB=1` in the environment.

### 2. Create an Admin User

To create a user who can clip videos, run:

```bash
npm run create-user --workspace=packages/server
```

This will prompt you for a username and password. The created user will have permission to clip videos.

### 3. Environment Variables

Make sure you have the following in your `packages/server/.env` file:

```env
SESSION_SECRET="your-secret-key-here"  # Change this in production!
```

For the frontend (`packages/web/.env`), ensure you have:

```env
PUBLIC_SERVER_ORIGIN="localhost:4000"
PUBLIC_FRONTEND_CODE="anystring"
```

## Usage

### Logging In

1. Navigate to `/login` on the frontend
2. Enter your username and password
3. After successful login, you'll be redirected to the home page
4. Your username will appear in the top navigation bar

### Adding Videos to Matches

1. Log in to the system
2. Navigate to an event's matches page
3. For each match, you'll see a "+" button in the "Video" column (if you're logged in)
4. Click the "+" button to open the "Add Match Video" dialog
5. Fill in the following information:
   - **YouTube URL**: The full YouTube URL (e.g., `https://www.youtube.com/watch?v=...`)
   - **Start Time**: When the match starts in the video (format: `MM:SS` or seconds)
   - **End Time**: When the match ends in the video (format: `MM:SS` or seconds)
6. Click "Add Video" to save

### Playing Videos

1. Matches with videos will show a play button (▶️) in the "Video" column
2. Click the play button to open the video player modal
3. The video will automatically start at the specified start time and end at the specified end time

## Technical Details

### Backend

**New Entities:**
- `User`: Manages user authentication with bcrypt password hashing
- `MatchVideo`: Stores video information linked to specific matches

**GraphQL API:**

Queries:
- `me`: Get current logged-in user
- `getMatchVideos(eventSeason, eventCode, matchId)`: Get all videos for a specific match
- `getAllMatchVideos`: Get all videos in the system

Mutations:
- `login(username, password)`: Authenticate and start a session
- `logout`: End the current session
- `createMatchVideo(...)`: Add a new video clip to a match
- `deleteMatchVideo(id)`: Remove a video clip (only by creator)

**Authentication:**
- Uses express-session for session management
- Passwords are hashed with bcrypt
- Session data is stored in memory (consider Redis for production)
- CORS is configured to allow credentials

### Frontend

**New Components:**
- `UserMenu.svelte`: Shows login/logout status in navbar
- `Login page (+page.svelte)`: User authentication form
- `VideoPlayerModal.svelte`: YouTube video player with timestamp support
- `AddVideoModal.svelte`: Form for adding videos to matches

**Modified Components:**
- `TradMatchRow.svelte`: Added video play/add buttons
- `TradMatchTableHeader.svelte`: Added "Video" column header
- `Navbar.svelte`: Added user menu

## Security Considerations

1. **Password Storage**: Passwords are hashed using bcrypt with 10 salt rounds
2. **Session Security**: 
   - Sessions expire after 7 days
   - Set `SESSION_SECRET` to a strong random value in production
   - Use HTTPS in production and set `secure: true` on cookies
3. **Authorization**: Only users with `canClipVideos: true` can add videos
4. **Deletion**: Users can only delete their own videos

## Future Enhancements

- Add Redis for session storage in production
- Add user management UI for admins
- Support multiple videos per match
- Add video preview/thumbnail
- Add video quality selection
- Implement video editing (trim, adjust timestamps)
- Add support for other video platforms (Twitch, Vimeo)
