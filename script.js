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
     AI ASSISTANT — sample knowledge base + rule engine
     --------------------------------------------------------- */
  const knowledgeBase = [
    {
      key:'leave',
      title:'Annual Leave',
      keywords:['leave','vacation','annual leave','time off','holiday'],
      answer:"Based on the sample policy, annual leave requests should be submitted through the approved HR process. If the request requires approval, it will be routed to the employee's designated manager. This is a demonstration workflow only.",
      action:{label:'Leave Request', prefix:'LV', dept:'HR / Line Manager'}
    },
    {
      key:'hours',
      title:'Working Hours',
      keywords:['working hours','office hours','shift','start time','end time'],
      answer:"Based on the sample policy, standard working hours are recorded through the approved HR/timekeeping system. This is demonstration information only, not AKL's actual policy."
    },
    {
      key:'expense',
      title:'Expense Claims',
      keywords:['expense','reimbursement','claim','receipt'],
      answer:"This appears to be a procurement/finance-related request. The production system could validate the request, identify the appropriate workflow and route it to the authorized approver.",
      action:{label:'Expense Claim', prefix:'EX', dept:'Finance'}
    },
    {
      key:'it',
      title:'IT Support',
      keywords:['it issue','laptop','wifi','password','printer','vpn','email not working','it request'],
      answer:"This request appears to belong to IT. Please submit an IT service request through the approved company process. In a production system, the AI could create and route the request automatically.",
      action:{label:'IT Service Request', prefix:'IT', dept:'IT Service Desk'}
    },
    {
      key:'purchase',
      title:'Purchase Requests',
      keywords:['purchase','procurement','buy','vendor','po','purchase order'],
      answer:"This appears to be a procurement/finance-related request. The production system could validate the request, identify the appropriate workflow and route it to the authorized approver.",
      restrictedRoles:['finance','manager','operations','admin'],
      restrictedNote:"Purchase order details and vendor spend are treated as finance-restricted information in this prototype.",
      action:{label:'Purchase Request', prefix:'PR', dept:'Finance / Procurement'}
    },
    {
      key:'payroll',
      title:'Salary & Payroll',
      keywords:['salary','payroll','payslip','pay slip','compensation','bonus'],
      answer:"Salary and payroll information would be retrieved directly from the approved HR/payroll system for the verified employee only.",
      restrictedRoles:['hr','finance','admin'],
      restrictedNote:"Salary and payroll data is confidential and restricted to HR, Finance and Management roles in this prototype."
    },
    {
      key:'documents',
      title:'Employee Documents',
      keywords:['salary certificate','employment letter','payslip','document request','certificate'],
      answer:"Based on the sample policy, employee document requests are routed through HR for verification and issuance. This is a demonstration workflow only.",
      action:{label:'Document Request', prefix:'DR', dept:'HR'}
    },
  ];

  const kbList = document.getElementById('kb-list');
  knowledgeBase.forEach(item => {
    const li = document.createElement('li');
    const tag = item.restrictedRoles ? '<span class="kb-restricted">Restricted</span>' : 'Sample policy topic';
    li.innerHTML = `<strong>${item.title}</strong>${tag}`;
    kbList.appendChild(li);
  });

  const suggestions = [
    {label:'Annual Leave', question:'How do I request annual leave?'},
    {label:'Submit 3-Day Leave', question:'I want to request 3 days leave.'},
    {label:'IT Request', question:'I need help with an IT issue.'},
    {label:'Purchase Request', question:'I need to submit a purchase request.'},
    {label:'Salary Info', question:'What is my salary this month?'},
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

  function addMessage(text, sender){
    const msg = document.createElement('div');
    msg.className = 'msg ' + (sender === 'user' ? 'msg-user' : 'msg-assistant');
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  const departmentGuess = [
    {dept:'HR', words:['leave','vacation','salary','payslip','onboarding','offboarding','policy','staff']},
    {dept:'Finance', words:['invoice','expense','payment','budget','purchase','po','finance']},
    {dept:'IT', words:['laptop','password','wifi','system','login','network','printer']},
    {dept:'Sales', words:['customer','client','order','crm','lead','enquiry']},
    {dept:'Operations', words:['production','tannery','batch','quality','warehouse','shipment']},
  ];

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
    const text = userText.toLowerCase();

    // report/management keyword — special case, not tied to a KB topic
    if (/\breport\b|\bdashboard\b|\banalytics\b/.test(text)){
      return {text:"This appears to be a management reporting request. The production system could generate an executive summary from approved data sources. You can preview sample report types under Reports & Analytics.", action:null, pending:null};
    }

    for (const item of knowledgeBase){
      if (item.keywords.some(k => text.includes(k))){
        if (item.restrictedRoles && !item.restrictedRoles.includes(currentRole)){
          return {text:`I can see this is a ${item.title} question, but that information is restricted based on your current role ("${getRole().label}"). ${item.restrictedNote} Please contact the authorized department directly, or switch roles above to preview what an authorized user would see.`, action:null, pending:null};
        }

        // Leave requests get a smarter, two-step flow: only file a request when a
        // specific day count is actually given — a plain question just gets the policy answer.
        if (item.key === 'leave'){
          const days = extractDays(userText);
          if (days){
            return {
              text:`Based on the sample policy, I can help with that. To confirm — you're requesting ${days} day${days > 1 ? 's' : ''} of annual leave. Should I go ahead and submit this request? (yes/no)`,
              action:null,
              pending:{type:'leave', days, action:item.action}
            };
          }
          return {text:item.answer, action:null, pending:null};
        }

        return {text:item.answer, action:item.action || null, pending:null};
      }
    }

    // guess department for unmatched requests
    for (const g of departmentGuess){
      if (g.words.some(w => text.includes(w))){
        return {text:`I don't have enough approved information to answer that accurately. This appears to be an ${g.dept} matter. Please contact ${g.dept}.`, action:null, pending:null};
      }
    }

    return {text:"I don't have approved information for that question. Please contact the appropriate department or use an approved company information source.", action:null, pending:null};
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
      addMessage(result.text, 'assistant');
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

  addMessage('Welcome to the Al Khaznah AI Assistant. How can I help you today?', 'assistant');

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
