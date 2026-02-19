/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                  MAVEN — Slack Coaching Bot                  ║
 * ║           Built with Slack Bolt + Anthropic Claude           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * SETUP GUIDE:
 * ─────────────────────────────────────────────────────────────
 * 1. Install dependencies:
 *      npm install @slack/bolt @anthropic-ai/sdk dotenv
 *
 * 2. Create a Slack App at api.slack.com/apps
 *    Under "OAuth & Permissions" add Bot Token Scopes:
 *      - chat:write, commands, im:history, im:read
 *      - im:write, views:open, users:read
 *    Under "Slash Commands" create:
 *      - /maven  →  "Open Maven coaching toolkit"
 *    Under "Interactivity & Shortcuts": Enable it
 *    Under "Socket Mode": Enable (easiest for setup)
 *    Under "App-Level Tokens": Create with connections:write scope
 *    Under "Event Subscriptions": Enable + add message.im
 *
 * 3. Create .env file:
 *      SLACK_BOT_TOKEN=xoxb-...
 *      SLACK_APP_TOKEN=xapp-...
 *      SLACK_SIGNING_SECRET=...
 *      ANTHROPIC_API_KEY=sk-ant-...
 *
 * 4. Run: node maven-slack-bot.js
 * ─────────────────────────────────────────────────────────────
 */

require("dotenv").config();
const { App } = require("@slack/bolt");
const Anthropic = require("@anthropic-ai/sdk");

// ─── Initialize ───────────────────────────────────────────────────────────────

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Leadership Code ──────────────────────────────────────────────────────────
// ⚠️  REPLACE THIS with Theo's actual Leadership Code framework.
// Maven will speak this language in every coaching response.

const LEADERSHIP_CODE = `
The Leadership Code is a values-driven framework for great people managers. Core principles:

1. KNOW YOURSELF — Great leaders lead from self-awareness. Know your strengths, 
   your blind spots, and your impact on others. Lead authentically.

2. GROW YOUR PEOPLE — Your job is to make your team better every day. Invest in 
   development, give honest feedback, and create space for growth.

3. BUILD TRUST — Trust is the foundation of every great team. Be consistent, 
   transparent, and follow through on your commitments.

4. LEAD WITH COURAGE — Hard conversations, bold decisions, and honest feedback 
   all require courage. Lean in. Don't avoid.

5. CREATE CLARITY — Ambiguity is the enemy of great performance. Great managers 
   create clarity around expectations, priorities, and purpose.

6. CHAMPION YOUR TEAM — Advocate fiercely for your people. Celebrate wins, 
   remove obstacles, and make sure their work is seen and valued.

// ← REPLACE WITH YOUR ACTUAL LEADERSHIP CODE PRINCIPLES
`;

// ─── Maven System Prompt ──────────────────────────────────────────────────────

const MAVEN_SYSTEM_PROMPT = `You are Maven, a values-driven manager development coach embedded in Slack.
You speak the language of the Leadership Code — a framework built on the belief that great managers 
are made through intentional practice, self-awareness, and courageous action.

${LEADERSHIP_CODE}

Your voice and style is inspired by Adam Grant: research-backed, direct, and counterintuitive. 
You challenge conventional management wisdom with evidence. You use punchy, memorable sentences. 
You cite behavioral science and organizational psychology naturally. You're not afraid to say 
"the data says otherwise" or "most managers get this backwards." You combine intellectual rigor 
with genuine warmth. You tell stories that illuminate principles. You make people think differently, 
not just feel better. Every insight should feel like something worth sharing.

Your coaching approach:
- Lead with a counterintuitive insight or reframe — challenge the manager's assumptions first
- Back claims with research or real-world evidence when possible
- Be direct. Say the hard thing clearly. Don't bury the lead.
- Focus on just-in-time coaching — managers need help RIGHT NOW, not theory
- Adult learners need WHY before HOW — always lead with purpose
- End with a question that makes them think, not just act

Formatting rules for Slack (STRICT):
- Use *bold* for key terms and emphasis
- Use bullet points with • for lists
- Use numbered lists for sequential steps
- Generous line breaks between sections for readability
- NO markdown headers (#, ##) — use *bold labels* instead
- Responses should feel like a well-designed newsletter, not a wall of text
- Keep total response under 350 words`;

// ─── Topic Definitions ────────────────────────────────────────────────────────

const TOPICS = {
  hard_conversations: {
    label: "💬 Hard Conversations",
    emoji: "💬",
    why: `Hard conversations are where great managers are made. Avoiding them doesn't make problems disappear — it compounds them. Every day you delay, you're choosing your own comfort over your team's growth. The Leadership Code calls this *leading with courage* — and it's one of the most transformative skills you can build.`,
    tips: [
      "*Prepare, don't script.* Know your key point and desired outcome. Clarity beats a memorized script every time.",
      "*Lead with curiosity, not conclusions.* Start with 'I've noticed X — help me understand what's going on' instead of delivering a verdict.",
      "*Name the discomfort.* It's okay to say 'This is a hard conversation for me too.' Naming it reduces tension and builds immediate trust.",
    ],
    deep_dive_intro: `Hard conversations aren't just about delivering bad news — they're about *creating shared reality*. Most managers avoid them fearing they'll damage the relationship. But the relationship suffers most when hard things go unsaid. Silence is not safety.`,
    big_ideas: [
      "*Clarity is kindness.* Vague feedback is not compassion — it's avoidance dressed up as niceness.",
      "*Your discomfort is data, not a stop sign.* The urge to soften or hedge? That's the moment to lean in.",
      "*The conversation you avoid has already started.* Your team can feel when something is off. The silence is louder than you think.",
    ],
    dig_deeper_prompt: `/maven → select "Hard Conversations" → type: "Coach me through a specific conversation I need to have with [describe the person and situation]"`,
  },

  better_11s: {
    label: "🎯 Better 1:1s",
    emoji: "🎯",
    why: `1:1s are the single highest-leverage activity in a manager's week. Done well, they build trust, surface problems early, and accelerate growth. The Leadership Code principle of *growing your people* starts here — in this recurring 30-60 minutes you have with each person.`,
    tips: [
      "*Make it their meeting.* The agenda belongs to your direct report. You're there to listen, coach, and unblock — not run a status update.",
      "*Ask questions that go deeper.* Try: 'What's energizing you?' or 'What's getting in your way this week?'",
      "*End with one commitment.* Ask 'What's the one thing I can do before our next 1:1?' — then actually do it.",
    ],
    deep_dive_intro: `Most 1:1s fail because managers default to *status updates* instead of *connection and coaching*. The shift from tactical to developmental conversations is what separates managers who retain great people from those who wonder why their team keeps leaving.`,
    big_ideas: [
      "*Presence > Agenda.* The most important thing you bring is your full attention. Close the laptop.",
      "*Patterns matter more than single sessions.* What your people return to repeatedly — those are their real development needs.",
      "*Psychological safety is built in 1:1s.* How you respond when someone shares a struggle determines whether they'll share the next one.",
    ],
    dig_deeper_prompt: `/maven → select "Better 1:1s" → type: "Help me redesign my 1:1 approach with [name/role] — here's the current dynamic: [describe]"`,
  },

  performance_issues: {
    label: "📉 Performance Issues",
    emoji: "📉",
    why: `When performance issues go unaddressed, they don't just affect one person — they erode team trust and lower the bar for everyone. The Leadership Code is clear: *building trust* means being fair and consistent, and *growing your people* means not giving up when things get hard.`,
    tips: [
      "*Separate the person from the performance.* You're addressing a gap between expectation and reality — not labeling a 'bad employee.'",
      "*Make the expectation explicit first.* Have you clearly defined what 'good' looks like? If not, start there before escalating.",
      "*Document as you go.* Notes from conversations and agreed-upon timelines protect everyone and create real accountability.",
    ],
    deep_dive_intro: `Performance management isn't a punishment — it's a *development process*. The best managers approach it with high standards AND genuine care. They don't rescue people from consequences, but they also don't give up before giving real support.`,
    big_ideas: [
      "*Early and often beats late and dramatic.* A small honest conversation now prevents a crisis six months later.",
      "*Your team is watching.* How you handle underperformance signals what you stand for and what you'll tolerate.",
      "*People deserve a real chance.* Clear expectations + genuine support + consistent feedback = a fair process.",
    ],
    dig_deeper_prompt: `/maven → select "Performance Issues" → type: "Help me address performance issues with [role] who is struggling with [specific behavior/output]"`,
  },

  giving_feedback: {
    label: "📣 Giving Feedback",
    emoji: "📣",
    why: `Feedback is the fuel of growth. Without it, even your strongest performers plateau. The Leadership Code principle of *growing your people* is impossible without honest, timely feedback — and yet most managers either avoid it or save it for reviews.`,
    tips: [
      "*Be specific, behavioral, timely.* 'Great job' doesn't help. 'In yesterday's meeting, when you interrupted Sam twice, it shut down the conversation' — that's coaching.",
      "*Use SBI: Situation → Behavior → Impact.* Describe what happened, the specific behavior, and the impact you observed. No interpretation.",
      "*Deliver it like a gift.* Your tone and intention matter as much as your words. Feedback lands better when people feel you're in their corner.",
    ],
    deep_dive_intro: `The best feedback cultures aren't built on annual reviews — they're built on *continuous, low-stakes conversations* where feedback is normal and expected. When feedback is rare, it feels like a big deal. When it's frequent, it becomes growth fuel.`,
    big_ideas: [
      "*Positive feedback is not optional.* Recognizing great work specifically and publicly is just as important as corrective feedback.",
      "*Ask before you tell.* 'How do you think that went?' often gets you further than jumping straight to your assessment.",
      "*Feedback is a relationship investment.* The more trust you've built, the more honestly you can speak — and the better it lands.",
    ],
    dig_deeper_prompt: `/maven → select "Giving Feedback" → type: "Help me give feedback to [role] about [specific behavior or situation I observed]"`,
  },

  team_conflict: {
    label: "🔥 Team Conflict",
    emoji: "🔥",
    why: `Conflict on a team is not a sign of failure — avoidance is. Healthy teams disagree. The Leadership Code principles of *creating clarity* and *building trust* both require you to step into conflict, not around it. Your willingness to address tension is one of the biggest signals of your leadership character.`,
    tips: [
      "*Name it before it names you.* 'I've noticed some friction between you two — I want to address it directly.' Silence gives conflict permission to grow.",
      "*Meet individually before you bring people together.* Understand each perspective privately before facilitating a joint conversation.",
      "*Redirect to shared goals.* Move from 'who's right' to 'what do we both want for the team?' Shared purpose breaks most stalemates.",
    ],
    deep_dive_intro: `The best teams have *productive conflict* — they challenge ideas, disagree openly, and push each other's thinking. The difference between destructive and productive conflict is psychological safety and a manager who models healthy disagreement.`,
    big_ideas: [
      "*Your neutrality is not optional.* Take sides and you lose both parties. Stay curious, stay fair.",
      "*Unresolved conflict has a cost.* Low collaboration, passive resistance, attrition — all downstream effects of conflict left to fester.",
      "*Some conflict is about more than the conflict.* Tension is often a symptom of unclear roles or unmet needs. Look for the root.",
    ],
    dig_deeper_prompt: `/maven → select "Team Conflict" → type: "Help me navigate conflict between [describe the situation and people involved]"`,
  },

  new_manager: {
    label: "🧭 New Manager / Team Development",
    emoji: "🧭",
    why: `The transition from individual contributor to manager is one of the hardest pivots in a career. Everything that made you successful before can work against you now. The Leadership Code starts with *know yourself* — because new managers who succeed are the ones who get honest about what they don't yet know.`,
    tips: [
      "*Listen before you lead.* In your first 30 days, questions are more powerful than answers. Understand the team before you try to shape it.",
      "*Relationships are your foundation.* 1:1s with every team member in week one — not to assess, but to understand. Ask: 'What's working? What isn't?'",
      "*Define your style out loud.* Tell your team how you operate, how you make decisions, what you value. Don't make them guess.",
    ],
    deep_dive_intro: `New managers often struggle not from lack of talent, but because no one told them that *management is a completely different job*. Your success now depends on developing others, not just performing yourself. That's a profound shift — and it takes real intention to make it.`,
    big_ideas: [
      "*Your job is to multiply, not add.* You succeed when your team succeeds. Investing in people pays back in ways your individual output never could.",
      "*Ask for feedback early and often.* The best new managers actively seek input on how they're doing. It builds trust and accelerates learning.",
      "*Own your mistakes out loud.* Naming your missteps openly is one of the fastest ways to build credibility with a new team.",
    ],
    dig_deeper_prompt: `/maven → select "New Manager" → type: "I'm a new manager and I need help with [specific challenge you're navigating right now]"`,
  },

  team_development: {
    label: "🌱 Team Development",
    emoji: "🌱",
    why: `Every team goes through predictable stages of growth — and most managers don't realize they're the variable that either accelerates or stalls the journey. Tuckman's model (Forming → Storming → Norming → Performing) gives you a map. The Leadership Code principle of *growing your people* isn't just about individuals — it's about building a team that performs together at its highest level.`,
    tips: [
      "*Diagnose before you prescribe.* Ask: which stage is my team in right now? Forming needs safety and clarity. Storming needs facilitation. Norming needs reinforcement. Performing needs autonomy and challenge.",
      "*Name the stage with your team.* Transparency accelerates development. Telling your team 'We're in Storming — this is normal and here's how we move through it' builds trust and reduces anxiety.",
      "*Your leadership role shifts at every stage.* Forming = guide and clarify. Storming = coach and facilitate. Norming = reinforce and step back. Performing = protect focus and raise the bar.",
    ],
    deep_dive_intro: `Tuckman's model isn't just a theory — it's a diagnostic tool for managers who want to be intentional about how they build their teams. Most teams get stuck in Storming not because the team is broken, but because the manager doesn't know how to move them forward. Naming the stage changes your entire approach.`,
    big_ideas: [
      "*Storming is not failure — avoidance is.* Conflict in the Storming stage is a sign of investment. Teams that never storm never truly bond. Your job is to facilitate, not suppress.",
      "*Performing teams still need you.* High-performing teams don't need less leadership — they need different leadership. Protect their focus, clear obstacles, and keep raising the bar.",
      "*Teams can regress.* New members, restructures, or major change can send a Performing team back to Forming overnight. Recognizing regression early lets you respond instead of react.",
    ],
    dig_deeper_prompt: `/maven → select "Team Development" → type: "My team seems to be in [Forming/Storming/Norming/Performing] and I'm struggling with [specific dynamic or challenge]"`,
  },
};

// ─── Claude Coaching Function ─────────────────────────────────────────────────

async function getPersonalizedCoaching(topicKey, userQuestion) {
  const topic = TOPICS[topicKey];

  const prompt = `A manager selected the topic "${topic.label}" and shared this specific situation:

"${userQuestion}"

Using the Leadership Code and your coaching expertise:
1. Acknowledge their specific situation with empathy (2 sentences max)
2. Give 3-4 concrete, tailored recommendations for THEIR situation — not generic advice
3. Close with one powerful coaching question to deepen their thinking

Format for Slack: use *bold* for key points, bullet points with •, generous line spacing.
Keep under 350 words. Be direct and warm. Anchor to Leadership Code principles by name.`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 700,
    system: MAVEN_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].text;
}

// ─── Block Kit Builders ───────────────────────────────────────────────────────

function buildWelcomeModal() {
  return {
    type: "modal",
    callback_id: "maven_topic_modal",
    title: { type: "plain_text", text: "Maven ⚡" },
    submit: { type: "plain_text", text: "Get Coached →" },
    close: { type: "plain_text", text: "Not now" },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Welcome, Manager.* 👋\n\nMaven is your on-the-go coaching toolkit — built for the moments when you need a thought partner *right now.*\n\n_Select a topic and describe your situation. The more specific you are, the better the coaching._",
        },
      },
      { type: "divider" },
      {
        type: "input",
        block_id: "topic_block",
        label: { type: "plain_text", text: "📌 What's on your mind today?" },
        element: {
          type: "static_select",
          action_id: "topic_select",
          placeholder: { type: "plain_text", text: "Choose a coaching topic..." },
          options: Object.entries(TOPICS).map(([value, data]) => ({
            text: { type: "plain_text", text: data.label },
            value,
          })),
        },
      },
      {
        type: "input",
        block_id: "question_block",
        label: { type: "plain_text", text: "✏️ Describe your specific situation" },
        hint: {
          type: "plain_text",
          text: "What's actually happening? Who's involved? What outcome do you want?",
        },
        element: {
          type: "plain_text_input",
          action_id: "question_input",
          multiline: true,
          placeholder: {
            type: "plain_text",
            text: "e.g. 'I need to address declining work quality with a team member who's been going through personal issues. I've been avoiding it for two weeks...'",
          },
        },
      },
    ],
  };
}

function buildCoachingBlocks(topicKey, coachingText, firstName) {
  const topic = TOPICS[topicKey];

  return [
    // Header
    {
      type: "header",
      text: { type: "plain_text", text: `Maven Coaching ${topic.emoji}` },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${topic.label}* — Coaching for ${firstName}`,
      },
    },
    { type: "divider" },

    // Why This Matters
    {
      type: "section",
      text: { type: "mrkdwn", text: `*⚡ Why This Matters*` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: topic.why },
    },
    { type: "divider" },

    // 3 Practical Tips
    {
      type: "section",
      text: { type: "mrkdwn", text: `*🎯 3 Tips You Can Use Right Now*` },
    },
    ...topic.tips.map((tip, i) => ({
      type: "section",
      text: { type: "mrkdwn", text: `${i + 1}. ${tip}` },
    })),
    { type: "divider" },

    // Personalized Coaching
    {
      type: "section",
      text: { type: "mrkdwn", text: `*🧠 Coaching for Your Situation*` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: coachingText },
    },
    { type: "divider" },

    // Opt-in prompt
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Want to go deeper?* 👇\nThere's more — a richer exploration, 3 big ideas, and a prompt to keep this going on your own terms.`,
      },
    },
    {
      type: "actions",
      block_id: `dig_deeper_actions_${topicKey}`,
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "📖 Yes, dig deeper" },
          style: "primary",
          action_id: `dig_deeper_yes_${topicKey}`,
          value: topicKey,
        },
        {
          type: "button",
          text: { type: "plain_text", text: "✓ I'm good, thanks" },
          action_id: `dig_deeper_no_${topicKey}`,
          value: topicKey,
        },
      ],
    },
  ];
}

function buildDigDeeperBlocks(topicKey) {
  const topic = TOPICS[topicKey];

  return [
    { type: "divider" },
    {
      type: "header",
      text: { type: "plain_text", text: `📚 Dig Deeper — ${topic.label.replace(/^\S+\s/, "")}` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: topic.deep_dive_intro },
    },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*💡 3 Big Ideas to Take With You*` },
    },
    ...topic.big_ideas.map((idea, i) => ({
      type: "section",
      text: { type: "mrkdwn", text: `${i + 1}. ${idea}` },
    })),
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🚀 Keep the Conversation Going*\n\nReady to go further? Here's exactly what to type next:\n\n> ${topic.dig_deeper_prompt}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `_Maven — Your Leadership Code coaching partner. Built on the belief that great managers are made, not born._`,
        },
      ],
    },
  ];
}

function buildClosingBlocks() {
  return [
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `✅ *You're set!* Come back to Maven anytime — great managers keep coming back to the fundamentals.\n\nType \`/maven\` to start a new session.`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `_Maven — Your Leadership Code coaching partner._`,
        },
      ],
    },
  ];
}

// ─── /maven-pdf Slash Command ────────────────────────────────────────────────

app.command("/maven-pdf", async ({ command, ack, client }) => {
  await ack();
  const userId = command.user_id;
  const topicArg = command.text?.trim();

  // Show topic picker if no argument
  if (!topicArg) {
    await client.chat.postMessage({
      channel: userId,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*📄 Maven 1-Pager Generator*

Type `/maven-pdf [topic]` to generate a downloadable coaching guide.

Available topics:
• `hard-conversations`
• `better-11s`
• `performance-issues`
• `giving-feedback`
• `team-conflict`
• `new-manager`
• `team-development`",
          },
        },
      ],
      text: "Maven PDF Generator",
    });
    return;
  }

  // Map slug to topic key
  const slugMap = {
    "hard-conversations": "hard_conversations",
    "better-11s": "better_11s",
    "performance-issues": "performance_issues",
    "giving-feedback": "giving_feedback",
    "team-conflict": "team_conflict",
    "new-manager": "new_manager",
    "team-development": "team_development",
  };

  const topicKey = slugMap[topicArg.toLowerCase()];
  if (!topicKey || !TOPICS[topicKey]) {
    await client.chat.postMessage({
      channel: userId,
      text: `Topic "${topicArg}" not found. Try: hard-conversations, better-11s, performance-issues, giving-feedback, team-conflict, new-manager, or team-development`,
    });
    return;
  }

  const topic = TOPICS[topicKey];

  try {
    await client.chat.postMessage({ channel: userId, text: `⏳ Generating your Maven 1-pager on *${topic.label}*...` });

    // Generate enhanced PDF content via Claude
    const pdfContent = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1000,
      system: MAVEN_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Create a concise, high-impact coaching guide on "${topic.label}" for managers. 
        Include: a bold opening insight, the core WHY, 3 actionable tips, 3 big ideas, and one reflection question.
        Write in Adam Grant's voice — research-backed, counterintuitive, direct.
        Format as clean plain text suitable for a 1-page PDF. Use clear section labels.`
      }],
    });

    const guideText = pdfContent.content[0].text;

    // Post as a well-formatted Slack message (acts as the 1-pager)
    await client.chat.postMessage({
      channel: userId,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: `Maven 1-Pager: ${topic.label}` },
        },
        { type: "divider" },
        {
          type: "section",
          text: { type: "mrkdwn", text: guideText },
        },
        { type: "divider" },
        {
          type: "context",
          elements: [{
            type: "mrkdwn",
            text: `_Maven — Leadership Code Coaching Guide | To save: copy this message or use Slack's "Save" feature_`,
          }],
        },
      ],
      text: `Maven 1-Pager: ${topic.label}`,
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    await client.chat.postMessage({ channel: userId, text: "Something went wrong generating your guide. Try again!" });
  }
});

// ─── /maven Slash Command ─────────────────────────────────────────────────────

app.command("/maven", async ({ command, ack, client }) => {
  await ack();
  try {
    await client.views.open({
      trigger_id: command.trigger_id,
      view: buildWelcomeModal(),
    });
  } catch (error) {
    console.error("Error opening Maven modal:", error);
  }
});

// ─── Modal Submission ─────────────────────────────────────────────────────────

app.view("maven_topic_modal", async ({ ack, body, view, client }) => {
  await ack();

  const topicKey = view.state.values.topic_block.topic_select.selected_option?.value;
  const userQuestion = view.state.values.question_block.question_input.value;
  const userId = body.user.id;

  if (!topicKey || !userQuestion?.trim()) return;

  try {
    // Get user's name for personalization
    const userInfo = await client.users.info({ user: userId });
    const firstName = (userInfo.user?.real_name || "Manager").split(" ")[0];

    // Get Claude's personalized coaching
    const coachingText = await getPersonalizedCoaching(topicKey, userQuestion);

    // Send to user's DM
    await client.chat.postMessage({
      channel: userId,
      blocks: buildCoachingBlocks(topicKey, coachingText, firstName),
      text: `Maven coaching on ${TOPICS[topicKey].label}`,
    });
  } catch (error) {
    console.error("Maven coaching error:", error);
    await client.chat.postMessage({
      channel: userId,
      text: "Something went wrong with Maven. Please try `/maven` again in a moment.",
    });
  }
});

// ─── Dig Deeper Actions ───────────────────────────────────────────────────────

Object.keys(TOPICS).forEach((topicKey) => {
  // Yes — send dig deeper content
  app.action(`dig_deeper_yes_${topicKey}`, async ({ ack, body, client }) => {
    await ack();
    const channel = body.channel?.id || body.user.id;
    try {
      await client.chat.postMessage({
        channel,
        blocks: buildDigDeeperBlocks(topicKey),
        text: `Digging deeper on ${TOPICS[topicKey].label}`,
      });
    } catch (error) {
      console.error("Dig deeper error:", error);
    }
  });

  // No — send closing message
  app.action(`dig_deeper_no_${topicKey}`, async ({ ack, body, client }) => {
    await ack();
    const channel = body.channel?.id || body.user.id;
    try {
      await client.chat.postMessage({
        channel,
        blocks: buildClosingBlocks(),
        text: "Maven session complete.",
      });
    } catch (error) {
      console.error("Closing message error:", error);
    }
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

(async () => {
  await app.start();
  console.log(`
╔══════════════════════════════════════════╗
║   ⚡ Maven is live on Slack!             ║
║   Type /maven to open the toolkit       ║
╚══════════════════════════════════════════╝`);
})();
