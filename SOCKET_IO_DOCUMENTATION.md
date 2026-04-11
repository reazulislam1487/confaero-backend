# Socket.IO API Documentation

## Overview

This backend uses Socket.IO for real-time communication. All socket connections require JWT authentication via handshake headers.

**Base Connection URL:** `http://<your-backend-url>` (e.g., `http://localhost:8080`)

---

## Connection & Authentication

### Connecting to Socket.IO

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  auth: {
    token: "<JWT_ACCESS_TOKEN>",
    eventId: "<EVENT_ID>"
  },
  // OR using headers:
  extraHeaders: {
    token: "<JWT_ACCESS_TOKEN>",
    eventId: "<EVENT_ID>"
  }
});
```

### Required Authentication Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `token` | string | Yes | JWT access token for user authentication |
| `eventId` | string | Yes | The event ID the user is participating in |

### Authentication Behavior

- ✅ **SUPER_ADMIN** role: Automatic access to all events
- ✅ **Participant/Organizer**: Access only if registered in the event
- ❌ **Unauthorized**: Connection will be rejected with error

### Connection Events

```javascript
socket.on("connect", () => {
  console.log("Connected to server", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error.message);
});
```

---

## General Messaging Events

### Client → Server Events

#### 1. `send-message`

Send a message to all users in the event room.

**Payload:**
```typescript
{
  receiverId: string;      // Target user ID (can be null for broadcast)
  text: string;            // Message text content
  attachments?: string[];  // Optional array of attachment URLs
}
```

**Example:**
```javascript
socket.emit("send-message", {
  receiverId: null,
  text: "Hello everyone!",
  attachments: ["https://example.com/file.pdf"]
});
```

---

### Server → Client Events

#### 1. `message:new`

Received when a new message is broadcast to the event room.

**Payload:**
```typescript
{
  id: string;              // Message ID from database
  senderId: string;        // Sender's user ID
  text: string;            // Message text
  attachments?: string[];  // Attachment URLs
  createdAt: string;       // ISO timestamp
  // ... other database fields
}
```

**Example:**
```javascript
socket.on("message:new", (message) => {
  console.log("New message:", message);
  // Add to chat UI
});
```

#### 2. `user:online`

Received when a user joins the event.

**Payload:**
```typescript
{
  userId: string;
}
```

**Example:**
```javascript
socket.on("user:online", ({ userId }) => {
  console.log(`${userId} is now online`);
  // Update user presence UI
});
```

#### 3. `user:offline`

Received when a user disconnects from the event.

**Payload:**
```typescript
{
  userId: string;
  lastSeen: Date;
}
```

**Example:**
```javascript
socket.on("user:offline", ({ userId, lastSeen }) => {
  console.log(`${userId} went offline at ${lastSeen}`);
  // Update user presence UI
});
```

#### 4. `active-count`

Received when the number of active users in the event changes.

**Payload:** `number` (count of currently active users)

**Example:**
```javascript
socket.on("active-count", (count) => {
  console.log(`Active users: ${count}`);
  // Update active users counter in UI
});
```

#### 5. `error`

Received when an error occurs during socket operations.

**Payload:**
```typescript
{
  message: string;
}
```

**Example:**
```javascript
socket.on("error", ({ message }) => {
  console.error("Socket error:", message);
  // Show error notification
});
```

---

## Event Live Session Events

These events manage real-time features during live event sessions (chat, polls, microphone control).

### Connection to Session Rooms

After connecting to the main socket, users must join a specific session room to receive live updates.

#### Client → Server: `event-live:join-session`

Join a live session room.

**Payload:**
```typescript
{
  sessionIndex: number;    // The session number/index to join
}
```

**Example:**
```javascript
socket.emit("event-live:join-session", {
  sessionIndex: 1
});
```

**What happens:**
- User is added to the session room: `event-live:{eventId}:session:{sessionIndex}`
- Viewer count is updated and broadcast to all users in the room

---

### Live Chat Events

#### Client → Server: `event-live:send-message`

Send a message in the live session chat.

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
  text: string;            // Message text (will be trimmed)
}
```

**Example:**
```javascript
socket.emit("event-live:send-message", {
  sessionIndex: 1,
  text: "Great presentation!"
});
```

#### Server → Client: `event-live:message-new`

Received when someone sends a message in the live session chat.

**Payload:**
```typescript
{
  userId: string;          // Sender's user ID
  text: string;            // Message text
  time: Date;              // Timestamp
}
```

**Example:**
```javascript
socket.on("event-live:message-new", (message) => {
  console.log(`${message.userId}: ${message.text}`);
  // Add to live chat UI
});
```

---

### Poll Events

#### Client → Server: `event-live:create-poll`

⚠️ **SPEAKER ONLY** - Creates a new poll in the session.

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
  question: string;        // Poll question
  options: string[];       // Array of poll option texts
}
```

**Example:**
```javascript
socket.emit("event-live:create-poll", {
  sessionIndex: 1,
  question: "What topic should we cover next?",
  options: ["AI", "Blockchain", "Web3"]
});
```

#### Server → Client: `event-live:poll-created`

Received when a poll is created in the session.

**Payload:**
```typescript
{
  id: string;              // Poll ID
  question: string;        // Poll question
  options: Array<{
    text: string;          // Option text
    count: number;         // Vote count (initially 0)
  }>;
}
```

**Example:**
```javascript
socket.on("event-live:poll-created", (poll) => {
  console.log("New poll:", poll.question);
  // Show poll UI to users
});
```

#### Client → Server: `event-live:vote-poll`

Vote on a poll option.

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
  pollId: string;          // The poll ID
  optionIndex: number;     // Index of the option to vote for (0-based)
}
```

**Example:**
```javascript
socket.emit("event-live:vote-poll", {
  sessionIndex: 1,
  pollId: "poll-123",
  optionIndex: 0
});
```

#### Server → Client: `event-live:poll-updated`

Received when someone votes on a poll (broadcast to session room).

**Payload:**
```typescript
{
  pollId: string;          // The poll ID
  optionIndex: number;     // The option that received a vote
}
```

**Example:**
```javascript
socket.on("event-live:poll-updated", (data) => {
  console.log(`Vote cast on poll ${data.pollId}, option ${data.optionIndex}`);
  // Update poll UI with new counts
});
```

---

### Session Control Events

#### Client → Server: `event-live:session-ended`

⚠️ **SPEAKER ONLY** - Ends the live session.

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
}
```

**Example:**
```javascript
socket.emit("event-live:session-ended", {
  sessionIndex: 1
});
```

#### Server → Client: `event-live:session-ended`

Received when the speaker ends the session.

**Payload:**
```typescript
{
  endedBy: "SPEAKER";
  endedAt: Date;
}
```

**Example:**
```javascript
socket.on("event-live:session-ended", (data) => {
  console.log(`Session ended at ${data.endedAt}`);
  // Show session ended UI
});
```

---

### Microphone Control Events

#### Client → Server: `event-live:mute-all-attendees`

⚠️ **SPEAKER ONLY** - Mutes all attendees in the session (speaker is excluded).

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
}
```

**Example:**
```javascript
socket.emit("event-live:mute-all-attendees", {
  sessionIndex: 1
});
```

#### Server → Client: `event-live:force-mute`

Received by attendees when speaker mutes all (speaker does NOT receive this).

**Payload:**
```typescript
{
  message: string;
}
```

**Example:**
```javascript
socket.on("event-live:force-mute", (data) => {
  console.log(data.message);
  // Mute user's microphone in WebRTC/audio setup
});
```

#### Client → Server: `event-live:unmute-all-attendees`

⚠️ **SPEAKER ONLY** - Unmutes all attendees in the session (speaker is excluded).

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
}
```

**Example:**
```javascript
socket.emit("event-live:unmute-all-attendees", {
  sessionIndex: 1
});
```

#### Server → Client: `event-live:allow-unmute`

Received by attendees when speaker unmutes all (speaker does NOT receive this).

**Payload:**
```typescript
{
  message: string;
}
```

**Example:**
```javascript
socket.on("event-live:allow-unmute", (data) => {
  console.log(data.message);
  // Allow user to unmute their microphone
});
```

---

### Session Viewer Count

#### Server → Client: `event-live:viewer-count`

Received when the viewer count changes in a session room.

**Payload:**
```typescript
{
  sessionIndex: number;    // Session room index
  count: number;           // Number of viewers in session
}
```

**Example:**
```javascript
socket.on("event-live:viewer-count", ({ sessionIndex, count }) => {
  console.log(`Session ${sessionIndex}: ${count} viewers`);
  // Update viewer count display
});
```

---

## Server-Initiated Notifications

### `notification:new`

Emitted by the server when sessions are created or updated.

**Payload:**
```typescript
{
  eventId: string;         // The event ID
  payload: {
    type: "SESSION_CREATED" | "SESSION_UPDATED";
    refId?: string;        // Reference ID (e.g., session ID)
    title?: string;        // Notification title
    message?: string;      // Notification message
  }
}
```

**Example:**
```javascript
socket.on("notification:new", (data) => {
  console.log("Notification:", data.payload.type);
  // Show notification to user
});
```

---

## Disconnect Handling

### Client → Server: `disconnect`

Automatically triggered when the client disconnects.

**What the server does:**
- Removes user from active users list
- Updates presence map
- Saves `lastSeen` timestamp to database
- Emits `user:offline` to remaining users
- Updates viewer count if user was in a session

**Example:**
```javascript
socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
  // Handle disconnection in UI
});
```

---

## Complete Event Reference

### Client → Server (Emit)

| Event Name | Module | Parameters | Access |
|------------|--------|------------|--------|
| `send-message` | General Messaging | `{ receiverId, text, attachments? }` | Authenticated Users |
| `event-live:join-session` | Event Live | `{ sessionIndex }` | Authenticated Users |
| `event-live:send-message` | Event Live | `{ sessionIndex, text }` | Authenticated Users |
| `event-live:create-poll` | Event Live | `{ sessionIndex, question, options }` | **SPEAKER ONLY** |
| `event-live:vote-poll` | Event Live | `{ sessionIndex, pollId, optionIndex }` | Authenticated Users |
| `event-live:session-ended` | Event Live | `{ sessionIndex }` | **SPEAKER ONLY** |
| `event-live:mute-all-attendees` | Event Live | `{ sessionIndex }` | **SPEAKER ONLY** |
| `event-live:unmute-all-attendees` | Event Live | `{ sessionIndex }` | **SPEAKER ONLY** |

### Server → Client (Listen)

| Event Name | Module | Payload | Description |
|------------|--------|---------|-------------|
| `message:new` | General Messaging | Message object | New message in event room |
| `user:online` | General Messaging | `{ userId }` | User connected to event |
| `user:offline` | General Messaging | `{ userId, lastSeen }` | User disconnected from event |
| `active-count` | General Messaging | `number` | Active user count |
| `error` | General Messaging | `{ message }` | Error occurred |
| `event-live:message-new` | Event Live | `{ userId, text, time }` | New live session chat message |
| `event-live:poll-created` | Event Live | Poll object | New poll created |
| `event-live:poll-updated` | Event Live | `{ pollId, optionIndex }` | Poll received vote |
| `event-live:session-ended` | Event Live | `{ endedBy, endedAt }` | Session ended by speaker |
| `event-live:force-mute` | Event Live | `{ message }` | Attendee muted (not sent to speaker) |
| `event-live:allow-unmute` | Event Live | `{ message }` | Attendee unmuted (not sent to speaker) |
| `event-live:viewer-count` | Event Live | `{ sessionIndex, count }` | Session viewer count updated |
| `notification:new` | Server | `{ eventId, payload }` | Session created/updated notification |

---

## Complete Usage Example

```javascript
import { io } from "socket.io-client";

// 1. Connect and authenticate
const socket = io("http://localhost:8080", {
  extraHeaders: {
    token: "your-jwt-token-here",
    eventId: "your-event-id-here"
  }
});

// 2. Connection handlers
socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  
  // Join a live session room
  socket.emit("event-live:join-session", { sessionIndex: 1 });
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection failed:", error.message);
});

// 3. Listen for general messaging events
socket.on("message:new", (message) => {
  console.log("📨 New message:", message);
});

socket.on("user:online", ({ userId }) => {
  console.log("🟢 User online:", userId);
});

socket.on("user:offline", ({ userId, lastSeen }) => {
  console.log("🔴 User offline:", userId, lastSeen);
});

socket.on("active-count", (count) => {
  console.log("👥 Active users:", count);
});

// 4. Listen for live session events
socket.on("event-live:message-new", (msg) => {
  console.log("💬 Live chat:", msg);
});

socket.on("event-live:poll-created", (poll) => {
  console.log("📊 Poll created:", poll);
});

socket.on("event-live:poll-updated", (data) => {
  console.log("🗳️ Poll updated:", data);
});

socket.on("event-live:viewer-count", ({ sessionIndex, count }) => {
  console.log(`👀 Session ${sessionIndex}: ${count} viewers`);
});

socket.on("event-live:session-ended", (data) => {
  console.log("🏁 Session ended:", data);
});

socket.on("event-live:force-mute", (data) => {
  console.log("🔇 Muted:", data.message);
  // Disable microphone in WebRTC/audio setup
});

socket.on("event-live:allow-unmute", (data) => {
  console.log("🔊 Unmuted:", data.message);
  // Enable microphone in WebRTC/audio setup
});

// 5. Listen for server notifications
socket.on("notification:new", (data) => {
  console.log("🔔 Notification:", data.payload);
});

// 6. Send messages
function sendMessage(text) {
  socket.emit("send-message", {
    receiverId: null,
    text: text
  });
}

function sendLiveChatMessage(text) {
  socket.emit("event-live:send-message", {
    sessionIndex: 1,
    text: text
  });
}

function voteOnPoll(pollId, optionIndex) {
  socket.emit("event-live:vote-poll", {
    sessionIndex: 1,
    pollId: pollId,
    optionIndex: optionIndex
  });
}

// 7. Speaker-only actions (only if user has SPEAKER role)
function createPoll(question, options) {
  socket.emit("event-live:create-poll", {
    sessionIndex: 1,
    question: question,
    options: options
  });
}

function endSession() {
  socket.emit("event-live:session-ended", {
    sessionIndex: 1
  });
}

function muteAllAttendees() {
  socket.emit("event-live:mute-all-attendees", {
    sessionIndex: 1
  });
}

// 8. Disconnect
function disconnect() {
  socket.disconnect();
}

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
```

---

## Error Handling

Common errors you may encounter:

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `token missing` | No JWT token in headers | Provide valid token in handshake |
| `eventId missing` | No eventId in headers | Provide eventId in handshake |
| `user not found` | Invalid token or user doesn't exist | Re-authenticate user |
| `Unauthorized` | User is not participant/organizer of event | Verify user is registered for the event |
| `You must join a session first` | Sending message without joining session | Call `event-live:join-session` first |
| `Only speakers can perform this action` | Non-speaker trying speaker-only action | Check user role before allowing action |

---

## Room Structure

The backend uses the following room naming convention:

| Room Pattern | Purpose | Who Joins |
|--------------|---------|-----------|
| `event:{eventId}` | General event room | All authenticated users on connect |
| `event-live:{eventId}:session:{sessionIndex}` | Live session room | Users who call `event-live:join-session` |

---

## Notes for Frontend Developers

1. **Authentication is mandatory**: Always include `token` and `eventId` in the connection handshake
2. **Join session rooms**: Users won't receive live session events until they call `event-live:join-session`
3. **Speaker role checks**: Poll creation, session ending, and mic control require SPEAKER role
4. **Auto-reconnection**: Socket.IO client handles reconnection automatically. Re-join session rooms on reconnect
5. **Presence tracking**: Use `user:online` and `user:offline` events to maintain user presence state
6. **Error handling**: Always listen to the `error` event to catch and display socket errors

---

## Testing with Socket Test Script

A test script is provided at `socket-test.js` for basic connectivity testing:

```bash
# Update the script with your token and eventId
node socket-test.js
```

This will connect to the socket server and log connection events and incoming messages.
