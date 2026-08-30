/* ===========================================================
   AKL AI Solutions — Prototype logic
   Vanilla JS only. No external APIs, no backend, no build step.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     NAVIGATION
     --------------------------------------------------------- */
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  const ROLES = [
    {id:'employee',   label:'Employee',                 sections:['dashboard','assistant','hr']},
    {id:'manager',    label:'Manager',                  sections:['dashboard','assistant','hr','documents','reports']},
    {id:'hr',         label:'HR',                       sections:['dashboard','assistant','hr','documents','reports']},
    {id:'finance',    label:'Finance',                  sections:['dashboard','assistant','finance','documents','reports']},
    {id:'it',         label:'IT',                       sections:['dashboard','assistant','it','documents']},
    {id:'sales',      label:'Sales',                    sections:['dashboard','assistant','sales','reports']},
    {id:'operations', label:'Operations',                sections:['dashboard','assistant','operations','reports']},
    {id:'admin',      label:'Management (CEO/CFO)',      sections:['dashboard','assistant','documents','reports','hr','finance','sales','it','operations','social']},
  ];
  let currentRole = 'employee';
  function getRole(){ return ROLES.find(r => r.id === currentRole); }
  function sectionAllowed(section){ return getRole().sections.includes(section); }

  function goToSection(section){
    navItems.forEach(n => n.classList.toggle('active', n.dataset.section === section));
    views.forEach(v => v.classList.toggle('active', v.id === 'view-' + section));
    document.getElementById('content').scrollTo({top:0, behavior:'instant'});
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function attemptNav(section){
    if (sectionAllowed(section)){
      goToSection(section);
    } else {
      const sectionLabels = {dashboard:'Dashboard',assistant:'AI Assistant',documents:'Documents',reports:'Reports & Analytics',hr:'HR & Employee',finance:'Finance',sales:'Sales & CRM',it:'IT Service Desk',operations:'Operations',social:'Social Media'};
      showToast(`Access restricted — ${sectionLabels[section] || section} isn't available for the "${getRole().label}" role in this prototype.`);
    }
  }

  function applyRolePermissions(){
    navItems.forEach(item => {
      const allowed = sectionAllowed(item.dataset.section);
      item.classList.toggle('nav-restricted', !allowed);
    });
    document.querySelectorAll('.module-card').forEach(card => {
      const allowed = sectionAllowed(card.dataset.section);
      card.classList.toggle('module-restricted', !allowed);
    });
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem && !sectionAllowed(activeItem.dataset.section)){
      goToSection('dashboard');
    }
    const rolePill = document.getElementById('assistant-role-pill');
    if (rolePill) rolePill.textContent = getRole().label;
  }

  document.getElementById('role-select').addEventListener('change', e => {
    currentRole = e.target.value;
    applyRolePermissions();
    showToast(`Now viewing as: ${getRole().label}`);
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => attemptNav(item.dataset.section));
  });

  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => attemptNav(el.dataset.nav));
  });

  /* ---------------------------------------------------------
     TOAST
     --------------------------------------------------------- */
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }
  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', () => showToast(el.dataset.toast));
  });

  /* ---------------------------------------------------------
     DATA — AI Modules (dashboard)
     --------------------------------------------------------- */
  const modules = [
    {name:'AI Business Assistant', section:'assistant', desc:'Answers employee questions and routes requests to the correct department using a demonstration knowledge base.'},
    {name:'Document Intelligence', section:'documents', desc:'Extracts and structures information from approved business documents such as PDFs and spreadsheets.'},
    {name:'Reports & Analytics', section:'reports', desc:'Converts structured information into management-ready charts and summary reports.'},
    {name:'HR & Employee Services', section:'hr', desc:'Supports leave requests, policy questions and employee document workflows.'},
    {name:'Finance Automation', section:'finance', desc:'Assists with invoice extraction, expense workflows and financial reporting.'},
    {name:'Sales & CRM', section:'sales', desc:'Classifies customer enquiries and supports lead routing and follow-up.'},
    {name:'IT Service Desk', section:'it', desc:'Provides first-line troubleshooting and creates classified IT service requests.'},
    {name:'Operations Intelligence', section:'operations', desc:'Summarizes operational data and flags exceptions for management review.'},
    {name:'Social Media Intelligence', section:'social', desc:'Tracks sample platform performance and surfaces content and growth trends.'},
  ];

  const moduleGrid = document.getElementById('module-grid');
  modules.forEach(m => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.dataset.section = m.section;
    card.innerHTML = `<h3>${m.name}</h3><p>${m.desc}</p><span class="module-explore">Explore</span>`;
    card.addEventListener('click', () => attemptNav(m.section));
    moduleGrid.appendChild(card);
  });

  /* ---------------------------------------------------------
     Dashboard workflow strip
     --------------------------------------------------------- */
  function renderWorkflow(container, steps){
    container.innerHTML = '';
    steps.forEach((s, i) => {
      const step = document.createElement('div');
      step.className = 'wf-step';
      step.innerHTML = `<span class="wf-num">${String(i+1).padStart(2,'0')}</span><span class="wf-title">${s}</span>`;
      container.appendChild(step);
      if (i < steps.length - 1){
        const arrow = document.createElement('div');
        arrow.className = 'wf-arrow';
        arrow.textContent = '→';
        container.appendChild(arrow);
      }
    });
  }

  renderWorkflow(document.getElementById('dashboard-workflow'), [
    'Employee / Manager', 'AI Assistant', 'Business Workflow', 'Approval / Validation', 'Approved System / Report'
  ]);

  /* ---------------------------------------------------------
     Integration diagram
     --------------------------------------------------------- */
  const integrationTargets = ['ERP 1','ERP 2','ERP 3','CRM','HR System','Finance System','Document Storage','Email / Notification'];
  const intTargetEl = document.getElementById('integration-targets');
  integrationTargets.forEach(t => {
    const el = document.createElement('span');
    el.className = 'integration-target';
    el.textContent = t;
    intTargetEl.appendChild(el);
  });

  /* ---------------------------------------------------------
     Security grid
     --------------------------------------------------------- */
  const securityItems = [
    'Role-based access', 'Employee authentication', 'Department-level permissions',
    'Approval controls', 'Audit logs', 'Data minimization',
    'Secure API connections', 'No unrestricted database access', 'Human approval for sensitive workflows',
    'Production data segregation', 'Backup and recovery', 'Monitoring'
  ];
  const securityGrid = document.getElementById('security-grid');
  securityItems.forEach(s => {
    const el = document.createElement('div');
    el.className = 'security-item';
    el.textContent = s;
    securityGrid.appendChild(el);
  });

  /* ---------------------------------------------------------
     AI ASSISTANT — expanded knowledge base + smarter matching engine
     (ported from the standalone Employee Policy Assistant, merged
     with this portal's role restrictions and demo ticket-creation)
     --------------------------------------------------------- */
  const knowledgeBase = [
    // ---------------- HR ----------------
    {
      id:'hr-annual-leave', department:'HR', topic:'Annual Leave',
      keywords:['annual leave','vacation','vacation days','leave days','days off','how many leave','holiday allowance','pto','time off','yearly leave'],
      answer:"Full-time employees accrue 22 working days of annual leave per calendar year, accrued monthly. Leave requests should be submitted through the HR portal at least 5 working days in advance and require manager approval. Unused leave of up to 5 days may be carried over into the following year.",
      action:{label:'Leave Request', prefix:'LV', dept:'HR / Line Manager'}
    },
    {
      id:'hr-sick-leave', department:'HR', topic:'Sick Leave',
      keywords:['sick leave','sick day','sick days','medical leave','unwell','ill','medical certificate','calling in sick'],
      answer:"Employees are entitled to up to 15 days of paid sick leave per year. A medical certificate is required for absences of 2 consecutive days or more. Employees should notify their line manager before their shift start time whenever possible."
    },
    {
      id:'hr-working-hours', department:'HR', topic:'Working Hours',
      keywords:['working hours','work hours','shift timing','shift hours','office hours','start time','end time','standard hours','what time do i start'],
      answer:"Standard working hours are Sunday to Thursday, 8:00 AM to 5:00 PM, with a one-hour lunch break. Production floor staff follow shift schedules issued monthly by their department supervisor."
    },
    {
      id:'hr-attendance', department:'HR', topic:'Attendance',
      keywords:['attendance','clock in','clock out','late arrival','punctuality','attendance policy','biometric','time tracking'],
      answer:"Employees must clock in and out using the biometric terminals at each site entrance. Three unexplained late arrivals within a month will trigger an automatic notice from HR to the employee and their manager."
    },
    {
      id:'hr-employee-records', department:'HR', topic:'Employee Records',
      keywords:['employee records','update my details','change address','personal information','update phone number','hr file','employment file'],
      answer:"Employees can update personal details such as address, phone number, and emergency contacts through the HR self-service portal. Changes to bank account details require submission of a signed request form to HR."
    },
    {
      id:'hr-remote-work', department:'HR', topic:'Remote Work',
      keywords:['remote work','work from home','wfh','hybrid','telework','work remotely','home office'],
      answer:"Remote work is available only to eligible office-based roles and must be pre-approved by a direct manager. Production, warehouse, and site-based roles are not eligible for remote work due to operational requirements."
    },
    {
      id:'hr-payroll', department:'HR', topic:'Salary & Payroll',
      keywords:['salary','payroll','payslip','pay slip','compensation','bonus'],
      answer:"Salary and payroll information would be retrieved directly from the approved HR/payroll system for the verified employee only.",
      restrictedRoles:['hr','finance','admin'],
      restrictedNote:"Salary and payroll data is confidential and restricted to HR, Finance and Management roles in this prototype."
    },
    {
      id:'hr-employee-documents', department:'HR', topic:'Employee Documents',
      keywords:['salary certificate','employment letter','document request','certificate','proof of employment'],
      answer:"Based on the sample policy, employee document requests (such as salary certificates or employment letters) are routed through HR for verification and issuance. This is a demonstration workflow only.",
      action:{label:'Document Request', prefix:'DR', dept:'HR'}
    },

    // ---------------- FINANCE ----------------
    {
      id:'fin-expense-claims', department:'Finance', topic:'Expense Claims',
      keywords:['expense claim','expense claims','submit an expense','reimbursement','claim expenses','expense form','how do i get reimbursed'],
      answer:"Expense claims are submitted through the Finance portal with itemized receipts attached. Claims under AED 500 are typically processed within 5 working days. Claims must be submitted within 30 days of the expense.",
      action:{label:'Expense Claim', prefix:'EX', dept:'Finance'}
    },
    {
      id:'fin-expense-deadline', department:'Finance', topic:'Expense Submission Deadline',
      keywords:['expense deadline','when to submit expenses','submission deadline','expense cutoff','expense submission date'],
      answer:"All expense claims for a given month must be submitted no later than the 5th working day of the following month to be included in that month's reimbursement cycle. Late submissions roll over to the next cycle."
    },
    {
      id:'fin-business-meals', department:'Finance', topic:'Business Meals',
      keywords:['business meals','client dinner','meal allowance','food expense','entertainment expense','client lunch'],
      answer:"Business meals with clients or partners are reimbursable up to AED 150 per person, subject to prior manager approval and an itemized receipt. Alcohol is not covered under this policy."
    },
    {
      id:'fin-purchase-orders', department:'Finance', topic:'Purchase Requests',
      keywords:['purchase','procurement','buy','vendor','po','purchase order'],
      answer:"This appears to be a procurement/finance-related request. The production system could validate the request, identify the appropriate workflow and route it to the authorized approver.",
      restrictedRoles:['finance','manager','operations','admin'],
      restrictedNote:"Purchase order details and vendor spend are treated as finance-restricted information in this prototype.",
      action:{label:'Purchase Request', prefix:'PR', dept:'Finance / Procurement'}
    },

    // ---------------- IT ----------------
    {
      id:'it-password-reset', department:'IT', topic:'Password Reset',
      keywords:['password reset','forgot my password','reset password','locked out',"can't log in",'cannot log in','forgot password'],
      answer:'Passwords can be reset from the login screen using the "Forgot Password" link, which sends a reset code to your registered company email. If you no longer have access to your email, contact the IT Help Desk directly.',
      action:{label:'IT Service Request', prefix:'IT', dept:'IT Service Desk'}
    },
    {
      id:'it-email-access', department:'IT', topic:'Email / Outlook Access',
      keywords:['email access','outlook',"can't access email",'email not working','email issue','outlook not opening','mailbox'],
      answer:"Outlook access issues are usually resolved by a mailbox re-sync, which IT can trigger remotely. Submit an IT ticket with your username and a screenshot of any error message for the fastest response.",
      action:{label:'IT Service Request', prefix:'IT', dept:'IT Service Desk'}
    },
    {
      id:'it-laptop-support', department:'IT', topic:'Laptop / Computer Support',
      keywords:['laptop','computer not working','laptop issue','laptop broken','computer support','device not working','screen not working',"my laptop isn't working"],
      answer:"For hardware issues, log a ticket through the IT Help Desk with a description of the problem. A loaner device can be issued within 1 business day while your equipment is being repaired.",
      action:{label:'IT Service Request', prefix:'IT', dept:'IT Service Desk'}
    },
    {
      id:'it-network-wifi', department:'IT', topic:'Network / Wi-Fi Support',
      keywords:['wifi','wi-fi','network issue',"can't connect to wifi",'internet not working','connection problem','network down'],
      answer:'If you cannot connect to the office Wi-Fi, first try forgetting and rejoining the "AKT-Staff" network. If the issue continues across multiple devices, it is likely a site-wide outage — check the IT status board or submit a ticket for updates.',
      action:{label:'IT Service Request', prefix:'IT', dept:'IT Service Desk'}
    },

    // ---------------- OPERATIONS ----------------
    {
      id:'ops-ppe-safety', department:'Operations', topic:'PPE and Workplace Safety',
      keywords:['ppe','personal protective equipment','safety gear','gloves','safety goggles','protective equipment','safety policy','do i need ppe','chemical safety','tannery floor','tanning drum'],
      answer:"PPE, including chemical-resistant gloves, safety goggles, and closed-toe footwear, is mandatory in all tanning, dyeing, and finishing areas at all times. Staff working near tanning drums or the wastewater treatment plant require additional respiratory protection. Supervisors conduct spot checks, and PPE is issued free of charge through the site stores."
    },
    {
      id:'ops-incident-reporting', department:'Operations', topic:'Incident Reporting',
      keywords:['report an accident','incident reporting','workplace accident','injury report','report injury','safety incident','near miss','chemical spill'],
      answer:"Workplace incidents, including near misses and chemical spills, must be reported to the on-site Operations Supervisor immediately and logged in the Incident Report system within 24 hours. Medical attention should always be sought first.",
      action:{label:'Incident Report', prefix:'IR', dept:'Operations Supervisor'}
    },
    {
      id:'ops-production-access', department:'Operations', topic:'Production Area Access',
      keywords:['production area access','restricted area','enter production floor','access badge','who can enter production','tannery access'],
      answer:"Access to the tannery floor, dyeing, and finishing areas requires a valid site access badge and completion of the site safety induction. Visitors and non-production staff must be accompanied by an authorized escort at all times."
    },
    {
      id:'ops-sustainability', department:'Operations', topic:'Sustainability Practices',
      keywords:['sustainability','solar power','water recycling','recycled water','eco friendly','environmental practices','chrome free tanning','camel leather'],
      answer:"Al Khaznah Leathers operates a solar-powered production line and an on-site water treatment plant that recycles process water for irrigation and reuse. Employees working in tanning and finishing follow chrome-free handling procedures as part of the site's Leather Working Group certification requirements."
    },
  ];

  const kbList = document.getElementById('kb-list');
  knowledgeBase.forEach(item => {
    const li = document.createElement('li');
    const tag = item.restrictedRoles ? '<span class="kb-restricted">Restricted</span>' : `<span class="kb-dept">${item.department}</span>`;
    li.innerHTML = `<strong>${item.topic}</strong>${tag}`;
    kbList.appendChild(li);
  });

  const suggestions = [
    {label:'Annual Leave', question:'How many annual leave days do I get?'},
    {label:'Submit 3-Day Leave', question:'I want to request 3 days leave.'},
    {label:'Sick Leave', question:'What is the sick leave policy?'},
    {label:'IT Password Reset', question:'I forgot my password'},
    {label:'PPE & Safety', question:'Do I need PPE on the tannery floor?'},
    {label:'Purchase Request', question:'I need to submit a purchase request.'},
    {label:'Salary Info', question:'What is my salary this month?'},
    {label:'Incident Report', question:'I need to report a workplace accident.'},
    {label:'Management Report', question:'Can you generate a management report?'},
    {label:'Random Text', question:'kadkaha 1908103 !@#!@##a'},
  ];
  const suggestedRow = document.getElementById('suggested-row');
  suggestions.forEach(s => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggested-chip';
    chip.textContent = s.label;
    chip.addEventListener('click', () => handleUserMessage(s.question));
    suggestedRow.appendChild(chip);
  });

  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  function addMessage(text, sender, meta){
    const msg = document.createElement('div');
    msg.className = 'msg ' + (sender === 'user' ? 'msg-user' : 'msg-assistant');

    const bubbleText = document.createElement('div');
    bubbleText.textContent = text;
    msg.appendChild(bubbleText);

    if (meta && (meta.department || meta.topic)){
      const metaEl = document.createElement('div');
      metaEl.className = 'msg-meta' + (meta.resolved ? '' : ' meta-unresolved');
      let inner = '';
      if (meta.department) inner += `<span class="meta-label">Department: </span><span class="meta-value">${meta.department}</span>`;
      if (meta.resolved && meta.topic) inner += `<span class="meta-label">Topic: </span><span class="meta-value">${meta.topic}</span>`;
      if (!meta.resolved && !meta.topic) inner += `<span class="meta-label">Status: </span><span class="meta-value">Not in knowledge base</span>`;
      metaEl.innerHTML = inner;
      msg.appendChild(metaEl);
    }

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* ---- Department fallback routing (when no exact policy matches) ---- */
  const DEPARTMENT_ROUTES = [
    {department:'HR', keywords:['leave','attendance','working hours','employee record','employment','salary','payroll','contract','probation','resignation','promotion','hr','vacation','sick']},
    {department:'Finance', keywords:['expense','reimburse','payment','invoice','salary','payroll','allowance','budget','finance','travel allowance','claim','tax']},
    {department:'IT', keywords:['password','email','outlook','laptop','computer','wifi','wi-fi','network','login','access','software','printer','it','system','app']},
    {department:'Operations', keywords:['ppe','safety','production','incident','accident','warehouse','machine','equipment','site','operations','hazard','tannery']},
    {department:'Sales', keywords:['customer','client','order','crm','lead','enquiry','sales']},
  ];

  /* ---- Text normalization / tokenization ---- */
  const STOPWORDS = new Set(['a','an','the','is','are','was','were','do','does','did','i','my','me','you','your','we','our','it','its','to','of','for','in','on','at','and','or','how','what','when','where','can','could','should','would','please','about','get','have','has','will','am','be','with','this','that','there','if']);

  function normalize(text){
    return text.toLowerCase().trim().replace(/[’']/g, "'").replace(/[^a-z0-9'\-\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function stem(word){
    if (word.length <= 3) return word;
    if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
    if (word.endsWith('ss') || word.endsWith('us') || word.endsWith('is')) return word;
    if (word.endsWith('s')) return word.slice(0, -1);
    return word;
  }
  function tokenize(text){
    return normalize(text).split(' ').filter(tok => tok.length > 0 && !STOPWORDS.has(tok)).map(stem);
  }
  function escapeRegExp(str){ return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function containsWholePhrase(haystack, phrase){
    const pattern = new RegExp('(^|\\s)' + escapeRegExp(phrase) + '($|\\s)');
    return pattern.test(haystack);
  }

  /* ---- Matching / scoring engine ---- */
  const CONFIDENCE_THRESHOLD = 1;

  function scoreKeywordAgainstQuestion(keyword, normalizedQuestion, questionTokens){
    const normalizedKeyword = normalize(keyword);
    if (normalizedKeyword.length > 2 && containsWholePhrase(normalizedQuestion, normalizedKeyword)) return 1;
    const keywordContentTokens = tokenize(keyword);
    if (keywordContentTokens.length === 0) return 0;
    const questionTokenSet = new Set(questionTokens);
    return keywordContentTokens.every(kt => questionTokenSet.has(kt)) ? 1 : 0;
  }

  function findBestMatch(userQuestion){
    const normalizedQuestion = normalize(userQuestion);
    const questionTokens = tokenize(userQuestion);
    let best = {entry:null, score:0};
    knowledgeBase.forEach(entry => {
      let entryScore = 0;
      entry.keywords.forEach(keyword => {
        const score = scoreKeywordAgainstQuestion(keyword, normalizedQuestion, questionTokens);
        if (score > entryScore) entryScore = score;
      });
      if (entryScore > best.score) best = {entry, score:entryScore};
    });
    return (best.entry && best.score >= CONFIDENCE_THRESHOLD) ? best : {entry:null, score:best.score};
  }

  function guessDepartmentSmart(userQuestion){
    const normalizedQuestion = normalize(userQuestion);
    const questionTokens = new Set(tokenize(userQuestion));
    let best = {department:null, score:0};
    DEPARTMENT_ROUTES.forEach(route => {
      let routeScore = 0;
      route.keywords.forEach(keyword => {
        const normalizedKeyword = normalize(keyword);
        if (normalizedKeyword.includes(' ')){
          if (containsWholePhrase(normalizedQuestion, normalizedKeyword)) routeScore += 1;
        } else if (questionTokens.has(normalizedKeyword)){
          routeScore += 1;
        }
      });
      if (routeScore > best.score) best = {department:route.department, score:routeScore};
    });
    return best.department;
  }

  /* ---- Small talk / vague input / gibberish handling ---- */
  function pickVariant(list){ return list[Math.floor(Math.random() * list.length)]; }

  const VAGUE_META_WORDS = new Set(['question','questions','query','queries','ask','asking','asked','doubt','doubts','concern','concerns','help','assist','assistance','info','information','something','anything','thing','issue','issues','need','needs','needed','want','wants','wanted','got','talk','speak','chat','quick']);

  const EVERYDAY_WORDS = ['hi','hello','hey','morning','afternoon','evening','thanks','thank','please','help','question','ask','asking','policy','policies','company','staff','employee','employees','work','working','office','need','want','tell','know','information','info','contact','today','tomorrow','sorry','yes','no','ok','okay','bye','goodbye','team','manager','supervisor','department','site','tannery','leather','name','who','why','explain','understand','sure','good','great','fine','problem'];

  const KNOWLEDGE_VOCABULARY = (function buildVocabulary(){
    const vocab = new Set();
    knowledgeBase.forEach(entry => entry.keywords.forEach(kw => tokenize(kw).forEach(tok => vocab.add(tok))));
    DEPARTMENT_ROUTES.forEach(route => route.keywords.forEach(kw => tokenize(kw).forEach(tok => vocab.add(tok))));
    EVERYDAY_WORDS.forEach(w => { tokenize(w).forEach(tok => vocab.add(tok)); if (w.indexOf(' ') === -1) vocab.add(w); });
    return vocab;
  })();

  const SMALL_TALK = new Set(['hi','hello','hey','hiya','yo','good morning','good afternoon','good evening','thanks','thank you','cheers','ok','okay','bye','goodbye','see you','test','testing']);

  function generateRef(prefix){
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${num}`;
  }
  function extractDays(text){
    const m = text.match(/(\d+)\s*(day|days)/i);
    return m ? parseInt(m[1], 10) : null;
  }
  function isAffirmative(text){
    return /^\s*(yes|yeah|yep|yup|confirm|correct|sure|ok|okay|go ahead|please do)\b/i.test(text.trim());
  }
  function isNegative(text){
    return /^\s*(no|nope|cancel|nevermind|never mind|don'?t)\b/i.test(text.trim());
  }

  let pendingConfirmation = null; // {days, action}

  function findAnswer(userText){
    const trimmed = userText.trim();
    const normalizedQuestion = normalize(trimmed);

    // Portal-specific shortcut: management/report requests aren't a KB topic.
    if (/\breport\b|\bdashboard\b|\banalytics\b/.test(normalizedQuestion)){
      return {text:"This appears to be a management reporting request. The production system could generate an executive summary from approved data sources. You can preview sample report types under Reports & Analytics.", action:null, pending:null, department:null, topic:null, resolved:true};
    }

    // Small talk.
    if (SMALL_TALK.has(normalizedQuestion)){
      const text = pickVariant([
        'Hello! What can I help you with today — leave, expenses, IT, or something else?',
        'Hi there. Happy to help — what would you like to know?',
        'Hey! Ask me anything about leave, expenses, IT support, or workplace policies.'
      ]);
      return {text, action:null, pending:null, department:null, topic:null, resolved:true};
    }

    // No letters at all — stray keys, digits, symbols.
    if (!/[a-z]/i.test(trimmed)){
      const text = pickVariant([
        'That looks like it might have been a stray key press rather than a question — mind giving it another go? You can ask me things like "how many leave days do I get" or "how do I reset my password."',
        'I\'m not seeing an actual question in there, just numbers or symbols. Try typing it out, for example: "what are the working hours" or "how do I submit an expense claim."',
        'Hmm, that didn\'t come through as a question I can work with. Feel free to type it in plain words — something like "do I need PPE in the production area" works well.'
      ]);
      return {text, action:null, pending:null, department:null, topic:null, resolved:false};
    }

    const meaningfulTokens = tokenize(trimmed);
    if (meaningfulTokens.length === 0){
      const text = pickVariant([
        'Could you say a little more? Try naming a topic, like leave, expenses, IT, or safety.',
        'I need a bit more to go on — what\'s the topic? For example, leave, working hours, or IT support.'
      ]);
      return {text, action:null, pending:null, department:null, topic:null, resolved:false};
    }

    // Vague "I have a question" style input with no real topic yet.
    const nonMetaTokens = meaningfulTokens.filter(tok => !VAGUE_META_WORDS.has(tok));
    if (nonMetaTokens.length === 0){
      const text = pickVariant([
        'Of course — go ahead. What would you like to know? I can help with leave, expenses, IT support, attendance, or workplace safety.',
        'Sure, happy to help. What\'s on your mind? Try asking about leave, expense claims, IT support, or safety procedures.',
        'I\'m listening — what would you like to ask? I cover things like leave, working hours, expenses, and IT support.'
      ]);
      return {text, action:null, pending:null, department:null, topic:null, resolved:true};
    }

    // Confident knowledge-base match.
    const {entry} = findBestMatch(trimmed);
    if (entry){
      if (entry.restrictedRoles && !entry.restrictedRoles.includes(currentRole)){
        return {
          text:`I can see this is a ${entry.topic} question, but that information is restricted based on your current role ("${getRole().label}"). ${entry.restrictedNote} Please contact the authorized department directly, or switch roles above to preview what an authorized user would see.`,
          action:null, pending:null, department:entry.department, topic:entry.topic, resolved:false
        };
      }

      // Leave requests get a two-step confirm flow: only file a request when a
      // specific day count is actually given — a plain question just gets the policy answer.
      if (entry.id === 'hr-annual-leave'){
        const days = extractDays(userText);
        if (days){
          return {
            text:`Based on the sample policy, I can help with that. To confirm — you're requesting ${days} day${days > 1 ? 's' : ''} of annual leave. Should I go ahead and submit this request? (yes/no)`,
            action:null, pending:{type:'leave', days, action:entry.action},
            department:entry.department, topic:entry.topic, resolved:true
          };
        }
      }

      return {text:entry.answer, action:entry.action || null, pending:null, department:entry.department, topic:entry.topic, resolved:true};
    }

    // No exact match, but the question touches a department's territory.
    const department = guessDepartmentSmart(trimmed);
    if (department){
      const text = pickVariant([
        `I don't have a specific answer for that in the current knowledge base, but this sounds like something for the ${department} Department — worth reaching out to them directly.`,
        `That's not covered in what I have on file. The ${department} Department would be the right team to ask.`,
        `I can't confirm that from the knowledge base I have, so I'd point you to the ${department} Department for an accurate answer.`
      ]);
      return {text, action:null, pending:null, department, topic:null, resolved:false};
    }

    // Nothing matched — distinguish real-but-off-topic from genuine gibberish.
    const recognizedCount = meaningfulTokens.filter(tok => KNOWLEDGE_VOCABULARY.has(tok)).length;
    if (recognizedCount === 0){
      const text = pickVariant([
        'I couldn\'t quite make sense of that one — could you rephrase it? I\'m best with questions about leave, expenses, IT support, attendance, or workplace safety.',
        'Hmm, that one lost me. Try rewording it — something like "what\'s the sick leave policy" or "how do I connect to Wi-Fi" is the kind of thing I can help with.',
        'Not sure I followed that. Could you try asking again in plain words? I cover leave, expenses, IT, and workplace safety topics.'
      ]);
      return {text, action:null, pending:null, department:null, topic:null, resolved:false};
    }

    const text = pickVariant([
      'That\'s a bit outside what I\'m set up to help with here — I\'m focused on company policies. Try asking about leave, expenses, IT support, or workplace safety.',
      'I\'m built specifically for policy questions, so that one\'s outside my lane. Ask me about things like annual leave, expense claims, or IT support instead.',
      'That\'s not something I can help with through this tool — I only cover company policy topics. Try leave, attendance, expenses, or IT.'
    ]);
    return {text, action:null, pending:null, department:null, topic:null, resolved:false};
  }

  function handleUserMessage(text){
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';

    // If we're mid-confirmation on a pending request, resolve that first.
    if (pendingConfirmation){
      const p = pendingConfirmation;
      pendingConfirmation = null;
      setTimeout(() => {
        if (isAffirmative(text)){
          const ref = generateRef(p.action.prefix);
          const detail = p.type === 'leave' ? ` (${p.days} day${p.days > 1 ? 's' : ''})` : '';
          addMessage(`Demo request created — Reference #${ref}. Type: ${p.action.label}${detail}. Status: Routed to ${p.action.dept}. (Prototype simulation only — no real system connected.)`, 'assistant');
        } else if (isNegative(text)){
          addMessage("No problem — that request wasn't submitted. Let me know if you'd like to try again.", 'assistant');
        } else {
          addMessage("I didn't catch a clear yes or no — please reply \"yes\" to submit the request or \"no\" to cancel it.", 'assistant');
          pendingConfirmation = p; // keep waiting
        }
      }, 400);
      return;
    }

    const result = findAnswer(text);
    setTimeout(() => {
      addMessage(result.text, 'assistant', {department:result.department, topic:result.topic, resolved:result.resolved});
      if (result.pending){
        pendingConfirmation = result.pending;
      } else if (result.action){
        setTimeout(() => {
          const ref = generateRef(result.action.prefix);
          addMessage(`Demo request created — Reference #${ref}. Type: ${result.action.label}. Status: Routed to ${result.action.dept}. (Prototype simulation only — no real system connected.)`, 'assistant');
        }, 1000);
      }
    }, 400);
  }

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    handleUserMessage(chatInput.value);
  });

  addMessage('Welcome to the Al Khaznah AI Assistant. You can ask about leave, working hours, expenses, IT support, attendance, workplace safety, employee documents, or sustainability practices.', 'assistant');

  /* ---------------------------------------------------------
     DOCUMENTS — upload demo
     --------------------------------------------------------- */
  const docSteps = [
    {n:'01', t:'Upload', d:'Receive approved PDF, Excel or document files.'},
    {n:'02', t:'Extract', d:'Identify text, tables, fields and relevant information.'},
    {n:'03', t:'Analyze', d:'Structure and validate extracted information.'},
    {n:'04', t:'Report', d:'Generate Excel, charts, PDF or PowerPoint outputs.'},
  ];
  const docStepsEl = document.getElementById('doc-steps');
  docSteps.forEach(s => {
    const card = document.createElement('div');
    card.className = 'step-card';
    card.innerHTML = `<span class="wf-num">${s.n}</span><h3>${s.t}</h3><p>${s.d}</p>`;
    docStepsEl.appendChild(card);
  });

  const docFileInput = document.getElementById('doc-file-input');
  const docFileName = document.getElementById('doc-file-name');
  const docFileReceived = document.getElementById('doc-file-received');
  const docProcessing = document.getElementById('doc-processing');
  const docActions = document.getElementById('doc-actions');
  const docTableWrap = document.getElementById('doc-table-wrap');
  const docTableBody = document.getElementById('doc-table-body');

  const processingStages = ['Document received','Text extraction','Tables identified','Information structured','Analysis prepared'];

  docFileInput.addEventListener('change', () => {
    docFileName.textContent = docFileInput.files.length ? docFileInput.files[0].name : 'No file selected';
    docFileReceived.classList.remove('hidden');
    docActions.classList.add('hidden');
    docTableWrap.classList.add('hidden');
    docProcessing.innerHTML = '';
    docProcessing.classList.remove('hidden');

    processingStages.forEach((stage, i) => {
      const row = document.createElement('div');
      row.className = 'processing-item';
      row.innerHTML = `<span class="check">·</span><span>${stage}</span>`;
      docProcessing.appendChild(row);
      setTimeout(() => {
        row.classList.add('done');
        row.querySelector('.check').textContent = '✓';
        if (i === processingStages.length - 1){
          docActions.classList.remove('hidden');
        }
      }, 450 * (i + 1));
    });
  });

  const sampleExtracted = [
    ['12 Jan 2026','DOC-4021','Finance','Invoice','AED 8,450','Processed'],
    ['14 Jan 2026','DOC-4022','Operations','Purchase Order','AED 21,300','Processed'],
    ['15 Jan 2026','DOC-4023','HR','Employee Document','—','Reviewed'],
    ['18 Jan 2026','DOC-4024','Finance','Expense Claim','AED 1,120','Pending'],
  ];

  document.querySelectorAll('#doc-actions [data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'view-data'){
        docTableBody.innerHTML = '';
        sampleExtracted.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = row.map(c => `<td>${c}</td>`).join('');
          docTableBody.appendChild(tr);
        });
        docTableWrap.classList.remove('hidden');
      } else {
        const labels = {excel:'Excel file', charts:'Chart set', pdf:'PDF report', ppt:'PowerPoint file'};
        showToast(`${labels[action]} generated (demo output).`);
      }
    });
  });

  /* ---------------------------------------------------------
     REPORTS & ANALYTICS
     --------------------------------------------------------- */
  const reportCaps = [
    {t:'PDF → Excel', d:'Extract structured information from approved documents.'},
    {t:'Data → Charts', d:'Convert structured data into management visualizations.'},
    {t:'Executive Report', d:'Generate summarized management reports from approved information.'},
  ];
  const reportCapGrid = document.getElementById('report-cap-grid');
  reportCaps.forEach(c => {
    const el = document.createElement('div');
    el.className = 'report-cap-card';
    el.innerHTML = `<h3>${c.t}</h3><p>${c.d}</p>`;
    reportCapGrid.appendChild(el);
  });

  function renderBarChart(container, data){
    container.innerHTML = '';
    const max = Math.max(...data.map(d => d.value));
    data.forEach(d => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      const h = Math.max(6, Math.round((d.value / max) * 120));
      col.innerHTML = `<span class="bar-value">${d.value}</span><div class="bar" style="height:${h}px"></div><span class="bar-label">${d.label}</span>`;
      container.appendChild(col);
    });
  }

  function renderLineChart(container, data){
    const w = 280, h = 120, pad = 10;
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = (max - min) || 1;
    const step = (w - pad*2) / (data.length - 1);
    const points = data.map((d,i) => {
      const x = pad + i * step;
      const y = h - pad - ((d.value - min) / range) * (h - pad*2);
      return `${x},${y}`;
    }).join(' ');
    container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline points="${points}" fill="none" stroke="#DF5E3E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${data.map((d,i)=>{const x=pad+i*step;const y=h-pad-((d.value-min)/range)*(h-pad*2);return `<circle cx="${x}" cy="${y}" r="3" fill="#1E1B17"/>`;}).join('')}
    </svg>`;
  }

  renderBarChart(document.getElementById('chart-dept'), [
    {label:'HR', value:34},{label:'Finance', value:28},{label:'IT', value:41},
    {label:'Sales', value:19},{label:'Ops', value:23},
  ]);
  renderLineChart(document.getElementById('chart-monthly'), [
    {value:12},{value:19},{value:15},{value:27},{value:24},{value:33},
  ]);
  renderBarChart(document.getElementById('chart-docs'), [
    {label:'Jan', value:52},{label:'Feb', value:61},{label:'Mar', value:48},{label:'Apr', value:70},
  ]);
  renderBarChart(document.getElementById('chart-social'), [
    {label:'IG', value:8.2},{label:'TikTok', value:14.5},{label:'FB', value:3.7},
  ]);

  /* ---------------------------------------------------------
     BUSINESS FUNCTION MODULE PAGES (generated from data)
     --------------------------------------------------------- */
  function renderModulePage(viewId, config){
    const el = document.getElementById(viewId);
    let html = `
      <div class="page-header"><h1>${config.title}</h1></div>
      <p class="page-desc">${config.desc}</p>
      <div class="section-block">
        <div class="section-heading"><h2>Potential Automation Areas</h2></div>
        <ul class="automation-list">
          ${config.areas.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      <div class="section-block">
        <div class="section-heading"><h2>${config.workflowTitle || 'Conceptual Workflow'}</h2><span class="section-tag">Conceptual</span></div>
        <div class="workflow-strip" id="${viewId}-workflow"></div>
      </div>
    `;
    if (config.extraHTML) html += config.extraHTML;
    if (config.notice) html += `<p class="notice">${config.notice}</p>`;
    el.innerHTML = html;
    renderWorkflow(document.getElementById(viewId + '-workflow'), config.workflow);
  }

  renderModulePage('view-hr', {
    title:'HR & Employee Services',
    desc:'Potential AI-assisted workflows for employee services.',
    areas:['Employee policy questions','Leave request workflows','Employee document requests','Onboarding workflows','Offboarding workflows','HR reporting','Employee request routing'],
    workflow:['Employee / Manager','AI Assistant','Business Workflow','Approval / Validation','Approved System / Report'],
    extraHTML: `
      <div class="section-block">
        <div class="section-heading"><h2>Sample Interactive Workflow</h2><span class="section-tag">Employee requests 3 days annual leave</span></div>
        <div class="interactive-flow" id="hr-flow"></div>
      </div>`,
    notice:'Production implementation requires HR policy validation, authorization rules, employee identity verification and integration with the approved HR system. The AI must not independently approve leave — approval remains with authorized personnel.'
  });
  renderHRFlow();

  renderModulePage('view-finance', {
    title:'Finance Automation',
    desc:'Potential AI-assisted workflows for finance and accounting processes.',
    areas:['Invoice document extraction','Expense request workflows','Purchase documentation','Financial report preparation','PDF and Excel processing','Management reporting'],
    workflow:['Document','AI Extraction','Validation','Finance Review','Approval','ERP / Accounting System','Report'],
    notice:'Financial approvals remain with authorized personnel. The AI assists preparation and validation only.'
  });

  renderModulePage('view-sales', {
    title:'Sales & CRM',
    desc:'Potential AI-assisted workflows for sales and customer relationship management.',
    areas:['Customer enquiry classification','Product information assistance','Lead routing','CRM data assistance','Customer follow-up support','Sales reporting'],
    workflow:['Customer Enquiry','AI Classification','Sales / CRM','Assigned Employee','Follow-up','CRM Record','Management Report'],
    notice:'This prototype does not connect to an actual CRM. Production integration requires approved CRM API access.'
  });

  renderModulePage('view-it', {
    title:'IT Service Desk',
    desc:'Potential AI-assisted workflows for first-line IT support and request routing.',
    areas:['Common IT questions','Basic troubleshooting','IT request creation','Ticket classification','Request routing','Knowledge base search'],
    workflow:['Employee','AI','Troubleshooting','Ticket','IT','Resolution','Audit Record'],
    extraHTML:`
      <div class="section-block">
        <div class="section-heading"><h2>Example Interaction</h2></div>
        <div class="it-example">
          <div class="msg msg-user" style="margin-bottom:10px;">My laptop cannot connect to Wi-Fi.</div>
          <div class="msg msg-assistant">Let's start with basic troubleshooting. If the issue remains unresolved, this request can be classified as an IT service request and routed to the appropriate support team.</div>
        </div>
      </div>`,
  });

  renderModulePage('view-operations', {
    title:'Operations Intelligence',
    desc:'Potential AI-assisted workflows for operational reporting and process monitoring.',
    areas:['Operational reporting','Production data analysis','Quality reporting','Process monitoring','Management summaries','Repetitive data collection'],
    workflow:['Operational Data','AI Analysis','Exception Detection','Assigned Department','Management Report'],
    notice:'Production automation must be designed around approved operational systems, safety controls and validated business processes.'
  });

  /* HR interactive flow (9-step, clickable next/prev) */
  function renderHRFlow(){
    const steps = [
      {t:'Employee submits request', d:'Employee describes the leave request in plain language to the AI Assistant.'},
      {t:'AI identifies request as Leave', d:'The assistant classifies the request type based on the sample knowledge base.'},
      {t:'System verifies employee identity', d:'Identity would be confirmed through the approved company identity system.'},
      {t:'System checks leave policy and balance', d:'The request is checked against policy rules and available balance in the HR/ERP system.'},
      {t:'System identifies assigned manager', d:'The employee\u2019s designated approver is determined from the org structure.'},
      {t:'Manager approval required', d:'The request is routed to the manager. The AI does not approve leave itself.'},
      {t:'Approved request is recorded', d:'Once approved, the decision is recorded against the request.'},
      {t:'HR / ERP is updated', d:'The official leave balance and record are updated in the source-of-truth system.'},
      {t:'Employee receives notification', d:'The employee is notified of the outcome.'},
    ];
    let current = 0;
    const container = document.getElementById('hr-flow');

    function render(){
      container.innerHTML = `
        <div class="interactive-flow-header">
          <h3>Step ${current + 1} of ${steps.length}</h3>
          <div class="flow-nav">
            <button type="button" id="hr-prev" ${current === 0 ? 'disabled' : ''}>‹</button>
            <button type="button" id="hr-next" ${current === steps.length - 1 ? 'disabled' : ''}>›</button>
          </div>
        </div>
        <div class="flow-progress">
          ${steps.map((_, i) => `<span class="${i < current ? 'done' : i === current ? 'current' : ''}"></span>`).join('')}
        </div>
        <div class="flow-step-title">${steps[current].t}</div>
        <div class="flow-step-desc">${steps[current].d}</div>
      `;
      document.getElementById('hr-prev').addEventListener('click', () => { current = Math.max(0, current - 1); render(); });
      document.getElementById('hr-next').addEventListener('click', () => { current = Math.min(steps.length - 1, current + 1); render(); });
    }
    render();
  }

  /* ---------------------------------------------------------
     SOCIAL MEDIA
     --------------------------------------------------------- */
  const socialData = [
    {platform:'Instagram', followers:'25,420', growth:'+8.2%', engagement:'6.4%'},
    {platform:'TikTok', followers:'18,730', growth:'+14.5%', engagement:'8.1%'},
    {platform:'Facebook', followers:'12,820', growth:'+3.7%', engagement:'5.2%'},
  ];
  const socialCards = document.getElementById('social-cards');
  socialData.forEach(s => {
    const card = document.createElement('div');
    card.className = 'social-card';
    card.innerHTML = `
      <h3>${s.platform}</h3>
      <div class="social-metric"><span>Followers</span><span>${s.followers}</span></div>
      <div class="social-metric growth"><span>Growth</span><span>${s.growth}</span></div>
      <div class="social-metric"><span>Engagement</span><span>${s.engagement}</span></div>
    `;
    socialCards.appendChild(card);
  });

  renderBarChart(document.getElementById('chart-followers'), [
    {label:'IG', value:25420 / 1000},{label:'TikTok', value:18730 / 1000},{label:'FB', value:12820 / 1000},
  ]);
  renderBarChart(document.getElementById('chart-engagement'), [
    {label:'IG', value:6.4},{label:'TikTok', value:8.1},{label:'FB', value:5.2},
  ]);
  renderBarChart(document.getElementById('chart-performance'), [
    {label:'IG', value:72},{label:'TikTok', value:88},{label:'FB', value:54},
  ]);

  /* ---------------------------------------------------------
     Initialize role-based view (default: Employee)
     --------------------------------------------------------- */
  applyRolePermissions();

});
