#!/usr/bin/env node
/**
 * Migrate blog posts from www.workofo.com/blog into this site's Wix Blog.
 * Text-only (covers stay empty unless imagery is attached later).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const TOKEN = process.env.TOKEN || readFileSync('/tmp/wix_token_workofo.txt', 'utf8').trim();
const SITE_ID = process.env.SITE_ID || readFileSync('/tmp/wix_site_workofo.txt', 'utf8').trim();

async function wix(method, path, body) {
  const res = await fetch(`https://www.wixapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'wix-site-id': SITE_ID,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 1200)}`);
  }
  return json;
}

function para(text) {
  return {
    type: 'PARAGRAPH',
    id: randomUUID().slice(0, 8),
    nodes: [{ type: 'TEXT', id: '', nodes: [], textData: { text, decorations: [] } }],
    paragraphData: {},
  };
}

function heading(text, level = 2) {
  return {
    type: 'HEADING',
    id: randomUUID().slice(0, 8),
    nodes: [{ type: 'TEXT', id: '', nodes: [], textData: { text, decorations: [] } }],
    headingData: { level },
  };
}

function bullets(items) {
  return {
    type: 'BULLETED_LIST',
    id: randomUUID().slice(0, 8),
    nodes: items.map((t) => ({
      type: 'LIST_ITEM',
      id: randomUUID().slice(0, 8),
      nodes: [
        {
          type: 'PARAGRAPH',
          id: randomUUID().slice(0, 8),
          nodes: [{ type: 'TEXT', id: '', nodes: [], textData: { text: t, decorations: [] } }],
          paragraphData: {},
        },
      ],
    })),
  };
}

function ricos(blocks) {
  return { nodes: blocks };
}

/** @type {Array<{title:string,slug:string,excerpt:string,blocks:any[]}>} */
const POSTS = [
  {
    title: 'Workforce Management Industry Trends and the Path to Automated Planning Solutions',
    slug: 'workforce-management-industry-trends-and-the-path-to-automated-planning-solutions',
    excerpt:
      'Discover workforce management trends and how automated scheduling solutions revolutionize scheduling and efficiency.',
    blocks: [
      para(
        'Workforce management is changing rapidly, driven by technological innovation and the increasing complexity of managing a diverse and distributed workforce. Traditional methods of workforce planning are giving way to automated solutions that deliver efficiency, productivity and employee satisfaction.',
      ),
      heading('Evolution of Automated Planning'),
      para(
        'The last few years have seen a radical swing towards automated workforce management solutions based on complex algorithms and artificial intelligence. According to Market Research Future, the workforce management market is expected to grow at a CAGR of 9.8% between 2021 and 2027, driven by demand for automation and cloud-based functionality.',
      ),
      para(
        'Automated planning solutions analyze large volumes of data quickly and accurately, helping managers make staffing decisions and reallocate resources. They reduce the time spent on scheduling and free managers for strategic work, while helping businesses stay compliant with changing labor laws.',
      ),
      heading('Business Case: Kesko Senukai Call Center'),
      para(
        'Kesko Senukai implemented Workofo’s workforce management solution in their call center. They moved from a rigid fixed-shift system to a more flexible, automated planning approach, resulting in significant savings of employee hours.',
      ),
      para(
        'Change brought challenges at first, but over time employees appreciated flexible schedules and preferences being accommodated—raising satisfaction and productivity while reducing turnover. A step-by-step rollout gave people time to adapt.',
      ),
      heading('Industry Trends and Statistics'),
      para(
        'Key trends reshaping workforce management include cloud-based solutions, AI and machine learning, and employee self-service tools.',
      ),
      bullets([
        'Cloud workforce management: Deloitte reports 74% of organizations use cloud-based HR and WFM solutions.',
        'AI and ML: McKinsey notes AI-powered WFM can increase productivity by up to 20%.',
        'Employee self-service: Gartner links self-service tools to up to 30% less admin load and 25% higher satisfaction.',
      ]),
      heading('Benefits of Automated Planning Solutions'),
      bullets([
        'Efficiency and accuracy with complex data processed faster than manual methods.',
        'Employee satisfaction through flexible schedules that respect preferences.',
        'Compliance and risk management via automated rule tracking.',
        'Strategic decision making with real-time data and analytics.',
      ]),
      heading('So, What Does It All Boil Down To?'),
      para(
        'Automated scheduling is changing fast—delivering efficiency, accuracy, satisfaction and compliance. Companies should adopt gradually: introduce the technology, let people adjust, then change planning logic and processes. Automated planning is becoming essential for competitive advantage.',
      ),
    ],
  },
  {
    title: 'Summer Vacation Challenges to Workforce Management: Be Prepared',
    slug: 'summer-vacation-challenges-to-workforce-management-be-prepared',
    excerpt:
      'Summer is here and with it comes the holiday season eagerly awaited by employees and workforce management challenges for the management.',
    blocks: [
      para(
        'Summer brings holidays employees look forward to—and serious workforce management challenges. Leave requests can overlap with high demand, so planning and strategy are essential to keep operations seamless while keeping people satisfied.',
      ),
      heading('Summer Holidays and Their Effects on Workforce Management'),
      para(
        'According to a SHRM survey, 68% of employees take at least one week of vacation during summer. Without good management, that can undermine productivity and customer service. The challenge is balancing time-off expectations with operational needs.',
      ),
      heading('Early Planning and Communication'),
      para(
        'Identify peak leave windows early, communicate holiday policies, and ask people to plan ahead. Scheduling tools like Workofo help manage vacation requests, shift planning and real-time communication so last-minute conflicts drop.',
      ),
      heading('Fair and Transparent Scheduling Practices'),
      para(
        'Whether you use first-come, first-served or other methods, transparency matters. Explain criteria clearly and decide fairly to protect trust and cooperation.',
      ),
      heading('Balancing Employee Needs with Business Requirements'),
      para(
        'Flexible arrangements, fair compensation for holiday coverage, and watching for burnout all help. Temporary or part-time help can cover peaks without overloading permanent staff. Harvard Business Review notes flexibility can boost productivity and cut turnover.',
      ),
      heading('Conclusion'),
      para(
        'Careful planning, clear communication and fair schedules make summer manageable. Tools like Workofo predict load and optimize schedules around vacations, wishes, labor rules and business constraints.',
      ),
    ],
  },
  {
    title: 'Technology in Retail: How AI and Machine Learning Revolutionize Staffing',
    slug: 'ai-and-machine-learning-in-retail-staffing',
    excerpt:
      'The retail industry is undergoing significant transformations, driven by evolving customer expectations, economic challenges, and the need to stay competitive.',
    blocks: [
      para(
        'Retailers face tough staffing challenges: cost control, labor shortages, compliance and fluctuating customer flow. AI and machine learning are reshaping how retailers schedule and manage people.',
      ),
      heading('Challenges in Retail'),
      para(
        'Cost pressure, attracting and retaining staff, labor compliance and operational efficiency all collide. Optimal staffing against changing workload is more critical than ever.',
      ),
      heading('Optimizing Workforce Schedules with AI'),
      para(
        'Workofo uses machine learning on historical data, foot traffic, seasonality, sales plans, promotions, weather and more to forecast demand for the next three months, then builds constraint-based schedules that respect rules, wishes, competences and working speeds.',
      ),
      heading('Cost Reduction and Increased Efficiency'),
      para(
        'By reallocating suboptimal hours, Workofo can yield savings of up to 15% without hurting performance. Overtime and underutilized hours that often sit near 5% can fall to 1% or less, while automation cuts manager admin time.',
      ),
      heading('Enhancing Customer Experiences'),
      para(
        'Better alignment of staff to demand means shorter waits, faster service and stronger loyalty.',
      ),
      heading('Improving Employee Satisfaction'),
      para(
        'Self-service for schedules, preferences, time off and swaps—plus fair distribution of favorite and unfavorite shifts—reduces stress and turnover.',
      ),
      heading('Navigating Compliance and Reducing Risk'),
      para(
        'Modern WFM automates adherence to labor laws and internal rules consistently across the organization, lowering the risk of fines and reputational damage.',
      ),
      heading('A Future Powered by Intelligence'),
      para(
        'Embracing AI and ML in workforce management helps retailers stay ahead. Workofo’s SaaS platform shows how data-driven staffing supports modern retail.',
      ),
    ],
  },
  {
    title: 'How Workforce Management Solutions Can Reduce Costs',
    slug: 'how-workforce-management-solutions-can-reduce-costs',
    excerpt:
      "In today's competitive business landscape and the challenging economic climate, controlling costs while maintaining operational efficiency is a top priority.",
    blocks: [
      para(
        'Workforce management solutions offer a multifaceted approach to cost reduction—covering labor, compliance and operational expenses.',
      ),
      heading('Reducing Labor Costs'),
      para(
        'Automated scheduling and AI optimization avoid under- and overstaffing. Workofo typically finds about 10% of hours that are suboptimally planned and reallocates them to peak demand.',
      ),
      para(
        'Automation also cuts administrative cost: managers often see a 60–80% reduction in time spent creating and managing schedules, with fewer last-minute payroll issues.',
      ),
      heading('Targeting Operational Inefficiencies'),
      para(
        'Real-time KPIs and predictive analytics surface hidden waste and forecast staffing needs more accurately.',
      ),
      heading('Managing Risk and Compliance'),
      para(
        'Updated labor rules and consistent application across sites reduce fines and uneven planning quality—especially important for multi-country organizations.',
      ),
      heading('Enhancing Productivity and Engagement'),
      para(
        'Transparent self-service scheduling improves retention, while integrations with HR, POS and payroll keep resources used effectively.',
      ),
      heading('Conclusion'),
      para(
        'Solutions like Workofo help reduce costs without sacrificing efficiency—an increasingly vital edge in today’s market.',
      ),
    ],
  },
  {
    title: 'Contact Center Workforce Management Made Easy: Tips and Tricks',
    slug: 'contact-center-workforce-management',
    excerpt:
      'Why is contact center workforce management (WFM) important? Effective WFM can increase productivity and customer satisfaction.',
    blocks: [
      para(
        '73% of business owners report a direct correlation between customer service and business performance. Contact center WFM aligns agent numbers, skills and schedules with expected interaction volume.',
      ),
      heading('What is contact center workforce management?'),
      para(
        'It is a strategic approach to managing agents so productivity and utilization stay high while customers get good service across voice, email, chat and social.',
      ),
      heading('Key elements'),
      bullets([
        'Forecasting: predict interaction volume (often in 15-minute intervals).',
        'Scheduling: match skills, preferences, breaks, labor law and fairness.',
        'Intraday management: cover sickness, overtime and last-minute changes.',
        'Payroll and reporting: pay accurately and track service-level KPIs.',
      ]),
      heading('Streamlining with WFM software'),
      para(
        'Workofo is an AI-powered platform for forecasting, rule management, scheduling and optimization. Benefits include 5–15% time savings, better service levels, higher agent satisfaction via the mobile app, and clearer team communication.',
      ),
      heading('Results you can expect'),
      para(
        'In one tech company contact center (~400 employees), Workofo reallocated 10.5% of hours (service level +3.5%), raised productive hours by 2.1%, and cut planning errors by 96%.',
      ),
      heading('Conclusion'),
      para(
        'Accurate forecasting, efficient scheduling and real-time management—backed by strong WFM software—create a streamlined contact center. Schedule a demo at workofo.com/get-in-touch.',
      ),
    ],
  },
  {
    title: '10 Best Workforce Optimization Software for Your Business',
    slug: 'workforce-optimization-software',
    excerpt:
      'An average employee wastes about 4.5 hours each week. Here are ten workforce optimization tools to save time and money.',
    blocks: [
      para(
        'Research shows the average employee wastes about 4.5 hours each week—nearly six work weeks a year. Workforce optimization software helps reclaim that time across hospitality, retail, logistics, warehouses and contact centers.',
      ),
      heading('What is workforce optimization software?'),
      para(
        'It streamlines scheduling and employee management. Key features include scheduling, labor forecasting, rule management, performance, time tracking and payroll. Benefits: higher productivity, less admin time, better employee and customer satisfaction, and lower costs.',
      ),
      heading('10 best options'),
      bullets([
        'Workofo — AI forecasting and optimal schedules; save 5–15% of employee time; strong for retail, contact centers, warehouses, logistics and multi-site hospitality.',
        'Verint — flexible scheduling and real-time adherence for contact centers.',
        'UKG (Ultimate Kronos Group) — Ready / Dimensions / Pro suites for HR, payroll and talent.',
        'Relex — retail-focused planning with supply chain and inventory strengths.',
        'Quinyx — mobile scheduling and engagement.',
        'Calabrio — contact-center forecasting, analytics and self-scheduling.',
        'Hotschedules — hospitality scheduling and team communication.',
        'Planday — scheduling, time tracking and staff management with clear pricing tiers.',
        'Humanity — dynamic scheduling popular in healthcare and hospitality.',
        'Deputy — scheduling plus labor compliance tools.',
      ]),
      heading('Conclusion'),
      para(
        'There is no single best tool for every team. If you need accurate forecasting and AI optimization in retail, call centers, warehouses, logistics or large hospitality chains, Workofo is a strong fit—sign up for a demo to free up to 15% of workforce resources.',
      ),
    ],
  },
  {
    title: '7 Best Ways to Improve Your Workforce Management',
    slug: '7-best-ways-to-improve-your-workforce-management',
    excerpt:
      'Learn how workforce management can reduce scheduling mistakes, ensure labor law compliance and improve productivity.',
    blocks: [
      para(
        'When demand spikes, hiring alone is rarely enough. Workforce management helps you forecast demand, allocate people correctly and run more efficiently without unnecessary headcount.',
      ),
      heading('What is workforce management?'),
      para(
        'WFM helps businesses understand and forecast work so resources are allocated properly—covering analytics, productivity, scheduling, timekeeping, reporting and compliance. Without tools, managers can waste ~20% of time on admin.',
      ),
      heading('Core WFM components'),
      bullets([
        'Demand forecasting',
        'Scheduling',
        'Absence management',
        'Overtime management',
        'Workforce analytics',
        'Workforce budgeting',
      ]),
      heading('Seven ways Workofo improves WFM'),
      bullets([
        'Reduce admin time and find extra hours with automated, preference-aware schedules.',
        'Predict workload from historical data and current trends.',
        'Calculate workforce demands for your specific business rules.',
        'Respect labor law when scheduling shifts.',
        'Transition to flexible shifts without hurting productivity.',
        'Highlight differences between planned and actual hours worked.',
        'Create detailed what-if scenarios before changing the operating model.',
      ]),
      heading('Business benefits'),
      para(
        'Clients have reported outbound sales hour gains, eliminated labor-code violations, 5–13% hour savings, higher satisfaction and lower turnover across telecom, parcel delivery and grocery delivery operations.',
      ),
      heading('Conclusion'),
      para(
        'Workofo helps organizations optimize day-to-day workforce processes. Get in touch to see what it can do for your company.',
      ),
    ],
  },
];

async function main() {
  console.log('Fetching author member…');
  const members = await wix('GET', '/members/v1/members?fieldsets=PUBLIC&paging.limit=1');
  const memberId = members.members?.[0]?.id || members.members?.[0]?._id;
  if (!memberId) throw new Error('No site member for blog author');
  console.log('Author:', memberId);

  // Remove earlier demo seed posts (not from workofo.com)
  console.log('Listing existing posts…');
  const existing = await wix('POST', '/blog/v3/posts/query', {
    query: { paging: { limit: 100 } },
    fieldsets: ['URL'],
  });
  const existingItems = existing.posts || existing.items || [];
  const keepSlugs = new Set(POSTS.map((p) => p.slug));
  for (const p of existingItems) {
    const slug = p.slug;
    const id = p.id || p._id;
    if (!keepSlugs.has(slug)) {
      console.log(`Deleting demo/old post: ${p.title} (${slug})`);
      try {
        // Prefer draft-posts delete for unpublished changes; try posts delete
        await wix('DELETE', `/blog/v3/draft-posts/${id}`).catch(() =>
          wix('DELETE', `/blog/v3/posts/${id}`),
        );
      } catch (e) {
        console.warn('  delete failed:', String(e.message).slice(0, 200));
      }
    } else {
      console.log(`Already have matching slug, will recreate if needed: ${slug}`);
    }
  }

  // Re-list to see which slugs remain
  const after = await wix('POST', '/blog/v3/posts/query', {
    query: { paging: { limit: 100 } },
    fieldsets: ['URL'],
  });
  const have = new Set((after.posts || after.items || []).map((p) => p.slug));

  const toCreate = POSTS.filter((p) => !have.has(p.slug));
  console.log(`Creating ${toCreate.length} posts…`);

  // Create one-by-one for reliability on large bodies
  const results = [];
  for (const post of toCreate) {
    console.log(`  → ${post.slug}`);
    try {
      const res = await wix('POST', '/blog/v3/draft-posts', {
        draftPost: {
          title: post.title,
          slug: post.slug,
          memberId,
          excerpt: post.excerpt,
          richContent: ricos(post.blocks),
        },
        publish: true,
      });
      results.push({ slug: post.slug, ok: true, id: res.draftPost?.id || res.post?.id });
    } catch (e) {
      console.warn('  retry once…', String(e.message).slice(0, 160));
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await wix('POST', '/blog/v3/draft-posts', {
          draftPost: {
            title: post.title,
            slug: post.slug,
            memberId,
            excerpt: post.excerpt,
            richContent: ricos(post.blocks),
          },
          publish: true,
        });
        results.push({ slug: post.slug, ok: true, id: res.draftPost?.id || res.post?.id });
      } catch (e2) {
        results.push({ slug: post.slug, ok: false, error: String(e2.message).slice(0, 400) });
      }
    }
  }

  const final = await wix('POST', '/blog/v3/posts/query', {
    query: { paging: { limit: 100 } },
    fieldsets: ['URL'],
  });
  const list = (final.posts || final.items || []).map((p) => ({ title: p.title, slug: p.slug }));
  writeFileSync('/tmp/wix_blog_migration.json', JSON.stringify({ results, list }, null, 2));
  console.log('\nLive posts:');
  list.forEach((p) => console.log('-', p.slug));
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
