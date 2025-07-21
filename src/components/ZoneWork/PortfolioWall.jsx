import React, { useState, useRef } from 'react';
import CaseFileSticky from './CaseFileSticky.jsx';
import ExperienceModal from './ExperienceModal.jsx';

// Sample data for experiences
const experiences = [
  {
    id: 'atlas',
    title: 'Social Payment Super App',
    company: 'A Leading Pan-African Technology Group',
    year: '2022–2023',
    type: 'FinTech, Social Media, Super App',
    summary: 'Led MVP launch for a chat + payments Super App. Distilled a complex vision into a focused, shippable product that blended social and financial lives.',
    details: `**Industry:** FinTech, Social Media, Super App\n\n**The Challenge:**\nThe client, a major African technology group, had an ambitious vision to create an all-in-one Super App combining chat, payments, and a marketplace of services. The primary challenge was immense complexity. How do you launch a minimum viable product (MVP) for an app that aims to do everything? We needed to distill this grand vision into a focused, shippable product that could gain initial traction, build user trust, and validate the core hypothesis: that users desire a seamless blend of their social and financial lives.\n\n**My Role:**\nAs the Product Manager for the core MVP, I led the product from conception to launch. I defined the product strategy, owned the feature roadmap, and translated the executive vision into actionable user stories and specs for a cross-functional team of 15 designers and engineers.\n\n**The Process: From Vision to Viable Product**\n- **Strategic Deconstruction & Focus:** Championed a core-loop MVP (Chat → Pay), prioritizing social and payment features to drive adoption.\n- **Roadmapping & Prioritization:** Used MoSCoW to focus on must-haves: secure onboarding, encrypted chat, instant P2P transfers, and clear transaction history.\n- **Agile Execution & Collaboration:** Authored all specs, ran bi-weekly sprints, and led reviews to keep the team aligned.\n- **Proactive Problem-Solving:** Resolved a critical KYC integration issue by forming a task force, facilitating daily stand-ups, and co-developing a solution, saving weeks of delay.\n\n**Client Testimonial:**\n"Siddarth is a strategic thinker with outstanding presentation skills. He played a crucial role in building the MVP of our customer-facing app, translating our vision into a functional product. His proactive problem-solving and collaborative approach is appreciable. Siddarth is a valuable asset to any team, and I highly recommend him."
`,
    skills: ['Product Management', 'Strategy', 'Agile', 'FinTech', 'MVP', 'Stakeholder Management', 'Problem Solving'],
    image: '',
    link: '',
    color: 'yellow',
  },
  {
    id: 'spatial-ar',
    title: 'Designing an Interface for Spatial Productivity',
    company: 'A Fortune 500 Leader in Enterprise Hardware',
    year: '2021–2022',
    type: 'Augmented Reality, Enterprise Hardware & Software, Spatial Computing',
    summary: 'UX/UI design for AR smart glasses, creating an intuitive multi-monitor experience for enterprise users. Drove adoption and won international design awards.',
    details: `**Industry:** Augmented Reality (AR), Enterprise Hardware & Software, Spatial Computing

**The Challenge:**
In the new era of hybrid work, knowledge workers are often constrained by the physical limitations of their laptop screens, especially when handling sensitive data in public spaces. The client engineered a new category of AR smart glasses to solve this, offering a secure, personal, and expansive workspace. The core design challenge was: how do we create a software experience that allows a traditional PC user to intuitively manage multiple, life-sized virtual monitors in 3D space? The interface needed to be powerful yet have a near-zero learning curve to drive enterprise adoption.

**My Role:**
As a Senior Experience Design Consultant, I was embedded with the core software team to lead the design of this new computing paradigm. My role went beyond interface design to include project facilitation and strategy. I was responsible for defining the primary user interaction model, leading the UX/UI design for the "Virtual Display Manager" software, facilitating design workshops, and conducting user validation sessions with enterprise customers.

**The Process: Designing for a New Dimension**
- **Immersion & Foundational Research:** Deep dive into hardware capabilities and AR/VR/desktop patterns to create evidence-based design principles.
- **Conceptualization & Interaction Design:** Led ideation workshops, landed on a "gaze-and-select" model for managing virtual displays—low-fatigue, precise, and instantly understandable. Designed user flows for placing, resizing, and curving up to five virtual monitors in physical space.
- **Rapid Prototyping & User Validation:** Built interactive prototypes, conducted usability testing with enterprise users. The gaze-and-select model was 90% faster and rated 4.5/5 on intuitiveness.
- **UI System Design & Engineering Handoff:** Designed a minimalist UI system, delivered detailed specs and motion examples, and ensured a smooth handoff to engineering.

**Client Testimonial:**
"It is with great pleasure I recommend Siddarth. He is a talented and intellectual User Experience Designer. He has a great deal of enthusiasm and technical knowledge about Augmented Reality and Virtual Reality and this shows in his work. He's very self motivated, he's highly organized. He is comfortable being responsible for the project management, communication and facilitation of projects as well as the design. His ideas are creative, while sensitive to industry and platform standards and reflect great usability. He is comfortable validating concepts with customers and is a very effective communicator with engineering teams as well as stakeholders and executives. He is a great asset to any company exploring Augmented or Virtual reality solutions."

**The Outcome**
- The user experience was a cornerstone of the product's successful launch and critical reception, setting a new benchmark for enterprise AR.
- **Prestigious Industry Recognition:** The software experience was a central component in the product winning multiple international design awards, including top honors from Germany and the US for both product and user experience design excellence.
- **Positive Critical Reception:** The intuitive design was highlighted as a key differentiator in major tech publications, praised for its "uncluttered," "seamless," and "surprisingly simple" approach to AR productivity.
- **Foundation for a New Product Category:** The project successfully delivered on its promise, providing a secure and productive multi-screen solution for the hybrid workforce. The design patterns and interaction models we established became foundational for the client's broader strategy in the spatial computing market.
`,
    skills: ['UX Design', 'AR', 'Spatial Computing', 'Prototyping', 'User Research', 'UI System', 'Facilitation', 'Enterprise'],
    image: '',
    link: '',
    color: 'blue',
  },
  {
    id: 'exp3',
    title: 'Driving Growth Through UX Revamp and Product Coaching',
    company: 'Logbase.io',
    year: '2020–2021',
    type: 'B2B SaaS, E-commerce, Shopify Apps',
    summary: 'Led a UX/UI overhaul and product coaching engagement for a Shopify app, making powerful features accessible and upskilling the client team in user-centric design.',
    details: `**Industry:** B2B SaaS, E-commerce, Shopify Apps\n\n**The Challenge:**\nLogbase had developed a powerful and feature-rich upsell & cross-sell application for Shopify merchants. While successful, user analytics and feedback indicated a key problem: the app's power was hidden behind a complex interface. Less tech-savvy merchants struggled with the initial setup and failed to discover the most valuable features. The challenge was twofold: first, to redesign the app to be more intuitive, and second, to equip the internal team with the product thinking principles needed to maintain and build upon a user-centric foundation.\n\n**My Role:**\nAs a Product & UX Consultant, my engagement was a blend of execution and enablement. I was tasked with leading the hands-on UI/UX revamp of the core product. Concurrently, a crucial part of my role was to coach the client's team on product thinking, helping them build a sustainable, user-centric culture that would last long after our engagement ended.\n\n**The Process: A Partnership in Design and Thinking**\nMy approach was to treat the redesign not as a siloed project, but as a live training ground for the internal team.\n\n- **Collaborative Discovery:** I initiated the project by facilitating a workshop with the internal team to collaboratively audit the product. Together, we analyzed user session recordings, support tickets, and app reviews. This not only produced richer insights but also served as a practical first lesson in building empathy and identifying user pain points from qualitative data.\n\n- **Guided Ideation & Strategy:** With a shared understanding of the problems, I guided the team through a series of "How Might We..." brainstorming sessions. This structured framework for ideation led us to co-develop the core strategic solution: a new "Guided Setup" model. This process taught the team a repeatable method for translating user problems into creative, viable solutions.\n\n- **Prototyping as a Teaching Tool:** While I led the creation of a high-fidelity, interactive prototype in Figma, I used the process as a teaching opportunity. I held weekly review sessions to explain the design rationale—the "why" behind decisions on information architecture, cognitive load, and interaction design. This demystified the design process for the team.\n\n- **Building a Validation Muscle:** To ensure our new design was effective, I coached the team on how to prepare, conduct, and synthesize their own usability tests using the prototype. We validated that merchants could launch a campaign 70% faster with the new design. More importantly, I left the team with a repeatable framework for gathering user feedback, empowering them to make data-informed decisions independently in the future.\n\n**Client Testimonial:** "Siddarth collaborated with us as a consultant to revamp the UI/UX of our products, providing valuable insights throughout the process. He demonstrated a high level of professionalism, and we look forward to working with him again in the future."\n\n**The Outcome**\nThe dual-focus engagement delivered a significantly improved product and an upskilled, more confident internal team.\n\n- **Empowered Internal Team:** The engagement successfully established a user-centric mindset and new internal processes. The team is now equipped with the frameworks and skills to continue optimizing their products with confidence and autonomy.\n- **Top-Tier Market Reputation:** The app is now consistently praised for its user-friendly interface and easy setup—a direct result of the new design and the team's ongoing commitment to the user experience.`,
    skills: ['UX/UI Design', 'Product Coaching', 'Workshop Facilitation', 'Prototyping', 'User Research', 'Design Systems', 'Team Enablement'],
    image: '',
    link: '',
    color: 'green',
  },
];

export default function PortfolioWall() {
  const [modalId, setModalId] = useState(null);
  const [originRect, setOriginRect] = useState(null);
  const stickyRefs = useRef({});

  function handleStickyClick(id) {
    const node = stickyRefs.current[id];
    if (node) {
      const rect = node.getBoundingClientRect();
      setOriginRect(rect);
    } else {
      setOriginRect(null);
    }
    setModalId(id);
  }

  function handleCloseModal() {
    setModalId(null);
    setOriginRect(null);
  }

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1.2rem',
        padding: '3rem 0',
        position: 'relative', // needed for modal centering
      }}>
        {experiences.map(exp => (
          <CaseFileSticky
            key={exp.id}
            ref={el => stickyRefs.current[exp.id] = el}
            experience={exp}
            onClick={() => handleStickyClick(exp.id)}
          />
        ))}
        {modalId && (
          <ExperienceModal
            experience={experiences.find(e => e.id === modalId)}
            open={!!modalId}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
} 