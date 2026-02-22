// import { io } from "socket.io-client";
const { io } = require("socket.io-client");
const socket = io("http://localhost:8080", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZvbHVudGVlckBnbWFpbC5jb20iLCJpZCI6IjY5NzU4YjRhM2EzNDZjZjQyOWEwMzdjNSIsImFjdGl2ZVJvbGUiOiJBVFRFTkRFRSIsImlhdCI6MTc2OTMzODgwOCwiZXhwIjoxNzY5MzU2ODA4fQ.glIEWS7bzSG12eMg-7_PFKmizb-EkuF-0EbyM_t1fPY",
    eventId: "69758e723a346cf429a037ee",
  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("message:new", (msg) => {
  console.log("📩 New message:", msg.text);
});
/* 
1. i am learning english, so i will write in english to improve my english skills.
2.i am a software engineer, so i will write about software engineering topics to improve my technical writing skills.
3. i will write about my daily life and experiences to improve my storytelling skills.




*/