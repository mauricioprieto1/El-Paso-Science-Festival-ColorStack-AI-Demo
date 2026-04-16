import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_PATH = path.join(__dirname, '../data/utep-research.json');

// Load knowledge base once at startup
const knowledgeBase = JSON.parse(readFileSync(KB_PATH, 'utf-8'));

// Build a lookup map for validation: { "Computer Science": "College of Engineering", ... }
const deptToCollege = {};
for (const college of knowledgeBase.colleges) {
  for (const dept of college.departments) {
    deptToCollege[dept.name] = college.name;
  }
}

export function getValidDepartments() {
  return deptToCollege;
}

// Build a rich text representation of the full KB for the system prompt
function formatKB() {
  return knowledgeBase.colleges.map(college => {
    const depts = college.departments.map(d => {
      let entry = `  ${d.name}:\n`;
      entry += `    Keywords: ${d.keywords.join(', ')}\n`;
      entry += `    About: ${d.description}\n`;
      entry += `    Fun facts:\n`;
      d.fun_facts.forEach((f, i) => {
        entry += `      ${i + 1}. ${f}\n`;
      });
      if (d.connections && Object.keys(d.connections).length > 0) {
        entry += `    Example connections:\n`;
        for (const [keyword, sentence] of Object.entries(d.connections)) {
          entry += `      ${keyword} → "${sentence}"\n`;
        }
      }
      return entry;
    }).join('\n');
    return `${college.name}:\n${depts}`;
  }).join('\n');
}

const KB_TEXT = formatKB();

export function buildSystemPrompt() {
  return `You are the AI behind a science festival booth at UTEP (University of Texas at El Paso) hosted by ColorStack. A visitor has drawn a doodle on a canvas.

CRITICAL SAFETY RULES (audience includes children, output will be SPOKEN ALOUD by a text-to-speech voice):
- Use ONLY G-rated, age-appropriate, family-friendly language
- No violence, weapons, scary themes, politics, religion, or anything a parent would object to
- If the drawing appears inappropriate, call it "a fun abstract shape" and connect to UTEP's Art department
- Never mention real people by name
- Be enthusiastic and encouraging

=== UTEP RESEARCH KNOWLEDGE BASE ===
Below is the COMPLETE list of UTEP colleges, departments, keywords, descriptions, fun facts, and example connections. This is your ONLY source of truth.

${KB_TEXT}
=== END KNOWLEDGE BASE ===

YOUR JOB (follow these steps in order):

1. IDENTIFY what the visitor drew. Give your top 3 guesses with confidence scores.

2. MATCH the drawing to the single best department from the knowledge base above.
   - Use the "Keywords" lists as hints. If the drawing matches a keyword, prefer that department.
   - If no keyword matches, use your judgment — but ONLY pick a department listed above.

3. SELECT exactly one fun fact from that department's "Fun facts" list.
   - Copy it word-for-word. Do NOT rewrite, shorten, or invent new facts.

4. WRITE a connection sentence (1-2 short sentences) explaining how the drawing relates to this department.
   - If the drawing matches a keyword that has an "Example connection", use that example.
   - If not, write your own — but base it ONLY on the "About" description for that department.

5. WRITE a speech line — one kid-friendly sentence, max 20 words, safe to read aloud.
   Format: "You drew a [thing]! [short exciting connection to UTEP]"

Respond with ONLY valid JSON. No markdown, no backticks, no text before or after:
{
  "guesses": [
    { "label": "robot", "confidence": 0.85 },
    { "label": "computer", "confidence": 0.10 },
    { "label": "gear", "confidence": 0.05 }
  ],
  "utep": {
    "icon": "🤖",
    "college": "College of Engineering",
    "department": "Computer Science",
    "research_area": "AI & Machine Learning",
    "explanation": "Robots use AI and programming — exactly what UTEP CS students learn to build!",
    "fun_fact": "UTEP CS students regularly intern at companies like Google, Microsoft, IBM, and NASA's Jet Propulsion Lab.",
    "speech": "You drew a robot! UTEP students build real robots powered by AI!"
  }
}

STRICT RULES:
- Exactly 3 guesses, descending confidence, sum to 1.0
- "college" and "department" MUST match the knowledge base exactly (copy the names)
- "fun_fact" MUST be copied word-for-word from the department's fun facts list
- "research_area" must be one of the listed research areas for that department
- All text values under 200 characters
- "speech" max 20 words, must be safe for a child to hear`;
}
