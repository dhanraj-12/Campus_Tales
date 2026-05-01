const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Resource = require("./models/Resource");

dotenv.config();

const resources = [
  // DSA
  {
    title: "Striver's A-to-Z DSA Sheet",
    description: "The most comprehensive roadmap for DSA, covering everything from basics to advanced topics.",
    link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    category: "DSA",
    isRecommended: true,
    tags: ["Sheet", "Roadmap", "Striver"],
  },
  {
    title: "CS-31 Sheet (Love Babbar)",
    description: "A curated list of 450 coding questions to master DSA concepts.",
    link: "https://lovebabbar.com/dsasheet",
    category: "DSA",
    tags: ["Sheet", "Practice"],
  },
  // Core Subjects
  {
    title: "Operating Systems - GateSmashers",
    description: "Best playlist to understand OS concepts for interviews and exams.",
    link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9or8DFsi9m7xYmdfXWp4",
    category: "Core Subjects",
    subCategory: "OS",
    tags: ["OS", "Video"],
  },
  {
    title: "DBMS - Knowledge Gate",
    description: "In-depth explanation of Database Management Systems and SQL.",
    link: "https://www.youtube.com/playlist?list=PLmXKhU9FNesR1rSES7cBQT7VJqc1l8P8s",
    category: "Core Subjects",
    subCategory: "DBMS",
    tags: ["DBMS", "SQL", "Video"],
  },
  {
    title: "Computer Networks - GateSmashers",
    description: "Comprehensive guide to networking fundamentals.",
    link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",
    category: "Core Subjects",
    subCategory: "Computer Networks",
    tags: ["CN", "Networking", "Video"],
  },
  // System Design
  {
    title: "Gaurav Sen - System Design",
    description: "Excellent introduction to architectural patterns and system design interview prep.",
    link: "https://www.youtube.com/playlist?list=PLMCXHnjXn7mE6S-C97yRtmIdS7XitG_sC",
    category: "System Design",
    isRecommended: true,
    tags: ["System Design", "High Level Design"],
  },
  {
    title: "ByteByteGo - System Design Blog",
    description: "Simplified explanations of complex system design topics with great diagrams.",
    link: "https://blog.bytebytego.com/",
    category: "System Design",
    tags: ["Blog", "Diagrams"],
  },
];

const seedResources = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");

    // Clear existing
    await Resource.deleteMany({ category: { $in: ["DSA", "Core Subjects", "System Design"] } });
    
    // Insert new
    await Resource.insertMany(resources);
    
    console.log("✅ Resources Seeded Successfully!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedResources();
