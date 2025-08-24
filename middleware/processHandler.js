process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // cleanup, then exit
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  // cleanup, then exit
  process.exit(1);
});

