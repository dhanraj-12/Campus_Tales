const cron = require("node-cron");
const Comment = require("../models/Comment");
const Experience = require("../models/Experience");
const sendEmail = async (options) => {
    // Import inside to avoid circular or early execution issues
    const mailer = require("./emailService");
    return await mailer(options);
};

const checkUnrepliedComments = async (overrideEmail = null) => {
  console.log("🔍 Checking for unreplied comments older than 3 days...");
  if (overrideEmail) {
    console.log(`🧪 TEST MODE: All emails will be redirected to: ${overrideEmail}`);
  }
  
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    // 1. Find all top-level comments (questions) older than 3 days
    const staleQuestions = await Comment.find({
      parentComment: null,
      createdAt: { $lte: threeDaysAgo }
    }).populate("experience");

    console.log(`📊 Found ${staleQuestions.length} stale questions in DB.`);

    // 2. Filter questions that have NO reply from the experience author
    const pendingNotifications = {};

    for (const question of staleQuestions) {
      const experience = question.experience;
      if (!experience) {
        console.log(`  ⏩ Skipping question ${question._id}: No associated experience.`);
        continue;
      }

      // Check if there's any reply by the author for this specific question
      const authorReply = await Comment.findOne({
        parentComment: question._id,
        isAuthorReply: true
      });

      if (!authorReply) {
        console.log(`  🚩 Question "${question.text.substring(0, 20)}..." has no author reply.`);
        if (!pendingNotifications[experience._id]) {
          pendingNotifications[experience._id] = {
            experience,
            questions: []
          };
        }
        pendingNotifications[experience._id].questions.push(question.text);
      } else {
        console.log(`  ✅ Question "${question.text.substring(0, 20)}..." already has an author reply.`);
      }
    }

    // 3. Send emails
    for (const expId in pendingNotifications) {
      const { experience, questions } = pendingNotifications[expId];
      
      // Need to get the author's email
      const author = await require("../models/User").findById(experience.student);
      if (!author || !author.email) continue;

      const subject = `Action Required: Unanswered questions on your "${experience.companyName}" experience`;
      const html = `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Hello ${author.name},</h2>
          <p>It looks like there are some questions on your shared experience at <strong>${experience.companyName}</strong> that haven't been answered for over 3 days.</p>
          <p>Your insights are very valuable to your peers! Here are the pending questions:</p>
          <ul style="background: #f9f9f9; padding: 15px; border-radius: 8px; list-style: none;">
            ${questions.map(q => `<li style="margin-bottom: 10px; border-bottom: 1px solid #eee; pb-2">"<em>${q}</em>"</li>`).join("")}
          </ul>
          <p>Please take a moment to reply and help others prepare better.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/experience/${experience._id}" 
             style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
             View Experience & Reply
          </a>
          <p style="margin-top: 30px; font-size: 0.8em; color: #777;">Best regards,<br>Campus Connect Team</p>
        </div>
      `;

      await sendEmail({
        email: overrideEmail || author.email,
        subject,
        html
      });
      
      if (overrideEmail) {
        console.log(`✅ Redirected notification for ${author.email} to ${overrideEmail} (Experience: ${experience.companyName})`);
      } else {
        console.log(`✅ Notification sent to ${author.email} for experience ${experience.companyName}`);
      }
    }

  } catch (error) {
    console.error("Error in notification job:", error);
  }
};

// Schedule to run every day at 9:00 AM
const initNotificationJob = () => {
  // If node-cron is not installed, this will fail gracefully when called in server.js
  try {
    cron.schedule("0 9 * * *", () => {
      checkUnrepliedComments();
    });
    console.log("⏰ Notification cron job scheduled (Daily at 9 AM)");
    
    // Optional: Run once on startup in development to test
    if (process.env.NODE_ENV === "development") {
        // checkUnrepliedComments(); 
    }
  } catch (err) {
    console.warn("Cron service could not be started. Check node-cron installation.");
  }
};

module.exports = { initNotificationJob, checkUnrepliedComments };
